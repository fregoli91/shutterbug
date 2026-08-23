import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { FulfillmentStatus, OrderStatus, PaymentStatus, Prisma } from '@/generated/prisma/client';
import { consumeOrderReservation, InventoryReservationError, releaseOrderReservation } from '@/lib/inventory-reservations';
import { sendPaidOrderEmails } from '@/lib/order-emails';
import { requirePrisma } from '@/lib/prisma';
import { validateStripePaymentSnapshot } from '@/lib/stripe-payment-validation';

export const runtime = 'nodejs';

const MAX_WEBHOOK_BYTES = 256 * 1024;
const PAID_EVENTS = new Set<Stripe.Event.Type>(['checkout.session.completed', 'checkout.session.async_payment_succeeded']);
const RELEASE_EVENTS = new Set<Stripe.Event.Type>(['checkout.session.expired', 'checkout.session.async_payment_failed']);

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  return value ? (JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue) : undefined;
}

function paymentIntentId(value: string | Stripe.PaymentIntent | null) {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

function duplicateEvent(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function sessionOrderLookup(session: Stripe.Checkout.Session) {
  return {
    OR: [
      { stripeCheckoutSessionId: session.id },
      { providerReference: session.id },
      ...(session.metadata?.orderId ? [{ id: session.metadata.orderId }] : [])
    ]
  };
}

async function processPaidSession(event: Stripe.Event, session: Stripe.Checkout.Session, stripeSecretKey: string) {
  const prisma = requirePrisma();
  return prisma.$transaction(async (tx) => {
    await tx.stripeWebhookEvent.create({ data: { id: event.id, type: event.type } });
    const order = await tx.order.findFirst({ where: sessionOrderLookup(session), include: { items: true } });
    if (!order) throw new Error('Stripe event does not match an order.');
    if (order.stripeCheckoutSessionId && order.stripeCheckoutSessionId !== session.id) {
      throw new Error('Stripe session does not match the order session.');
    }

    const intentId = paymentIntentId(session.payment_intent);
    if (order.paymentStatus === PaymentStatus.PAID) {
      await tx.stripeWebhookEvent.update({ where: { id: event.id }, data: { orderId: order.id } });
      if (intentId && order.stripePaymentIntentId !== intentId) {
        await tx.order.update({ where: { id: order.id }, data: { stripePaymentIntentId: intentId } });
      }
      return { orderId: order.id, productPaths: [] as string[] };
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT || order.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error('Stripe payment cannot be applied to the current order state.');
    }

    const paymentError = validateStripePaymentSnapshot({
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      livemode: event.livemode
    }, order.totalCents, order.currency, stripeSecretKey);
    if (paymentError) throw new Error(paymentError);

    const productPaths = await consumeOrderReservation(tx, order.id);
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        paymentStatus: PaymentStatus.PAID,
        paidAt: new Date(),
        customerEmail: session.customer_details?.email?.trim().toLowerCase() || order.customerEmail,
        customerName: session.customer_details?.name?.trim() || order.customerName,
        billingAddress: toJson(session.customer_details?.address),
        providerReference: session.id,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: intentId,
        history: { create: { message: 'Stripe confirmed the exact order total; reserved inventory was sold.' } }
      }
    });
    await tx.stripeWebhookEvent.update({ where: { id: event.id }, data: { orderId: order.id } });
    return { orderId: order.id, productPaths };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

async function processReleaseSession(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const prisma = requirePrisma();
  return prisma.$transaction(async (tx) => {
    await tx.stripeWebhookEvent.create({ data: { id: event.id, type: event.type } });
    const order = await tx.order.findFirst({
      where: sessionOrderLookup(session),
      select: { id: true, status: true, paymentStatus: true }
    });
    if (!order) return null;

    await tx.stripeWebhookEvent.update({ where: { id: event.id }, data: { orderId: order.id } });
    if (order.status !== OrderStatus.PENDING_PAYMENT || order.paymentStatus !== PaymentStatus.PENDING) return order.id;

    const released = await releaseOrderReservation(tx, order.id, `Stripe reported ${event.type}; inventory reservation released.`);
    await tx.order.updateMany({
      where: { id: order.id, status: OrderStatus.PENDING_PAYMENT, paymentStatus: PaymentStatus.PENDING },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.CANCELED,
        fulfillmentStatus: FulfillmentStatus.CANCELED,
        cancelledAt: new Date(),
        ...(!released ? { history: { create: { message: `Stripe reported ${event.type}; order cancelled.` } } } : {})
      }
    });
    return order.id;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 500 });
  }

  const contentLength = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Webhook payload is too large.' }, { status: 413 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_WEBHOOK_BYTES) {
      return NextResponse.json({ error: 'Webhook payload is too large.' }, { status: 413 });
    }
    event = new Stripe(stripeSecretKey).webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid Stripe webhook.' }, { status: 400 });
  }

  if (!PAID_EVENTS.has(event.type) && !RELEASE_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  try {
    if (PAID_EVENTS.has(event.type)) {
      const result = await processPaidSession(event, session, stripeSecretKey);
      await sendPaidOrderEmails(result.orderId);
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath('/sitemap.xml');
      revalidatePath('/google-merchant-feed.xml');
      for (const slug of result.productPaths) revalidatePath(`/shop/${slug}`);
    } else {
      await processReleaseSession(event, session);
    }
  } catch (error) {
    if (duplicateEvent(error)) return NextResponse.json({ received: true, duplicate: true });
    console.error('Stripe webhook processing failed.', {
      eventId: event.id,
      eventType: event.type,
      sessionId: session.id,
      inventoryFailure: error instanceof InventoryReservationError,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json({ error: 'Stripe event could not be processed.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
