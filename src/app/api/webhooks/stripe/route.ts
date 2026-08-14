import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderStatus, PaymentStatus, ProductStatus, type Prisma } from '@/generated/prisma/client';
import { sendPaidOrderEmails } from '@/lib/order-emails';
import { requirePrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  return value ? (JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue) : undefined;
}

function paymentIntentId(value: string | Stripe.PaymentIntent | null) {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    const prisma = requirePrisma();
    const intentId = paymentIntentId(session.payment_intent);
    const productPaths = new Set<string>();
    let paidOrderId: string | null = null;

    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
          where: {
            OR: [
              { stripeCheckoutSessionId: session.id },
              { providerReference: session.id },
              ...(session.metadata?.orderId ? [{ id: session.metadata.orderId }] : [])
            ]
          },
          include: { items: true }
        });
        if (!order) return;

        if (order.paymentStatus === PaymentStatus.PAID) {
          paidOrderId = order.id;
          if (intentId && order.stripePaymentIntentId !== intentId) {
            await tx.order.update({ where: { id: order.id }, data: { stripePaymentIntentId: intentId } });
          }
          return;
        }

        if (session.payment_status !== 'paid') {
          await tx.orderStatusEvent.create({
            data: {
              orderId: order.id,
              message: `Stripe checkout completed but payment status is ${session.payment_status}.`
            }
          });
          return;
        }

        // This conditional update is the exact-once claim. Concurrent webhook deliveries
        // wait on the same row and only one transaction can move it into PAID.
        const claimed = await tx.order.updateMany({
          where: {
            id: order.id,
            status: OrderStatus.PENDING_PAYMENT,
            paymentStatus: PaymentStatus.PENDING
          },
          data: {
            status: OrderStatus.PAID,
            paymentStatus: PaymentStatus.PAID,
            paidAt: new Date(),
            customerEmail: session.customer_details?.email?.trim().toLowerCase() || order.customerEmail,
            customerName: session.customer_details?.name ?? order.customerName,
            billingAddress: toJson(session.customer_details?.address),
            providerReference: session.id,
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: intentId
          }
        });
        if (claimed.count === 0) return;

        const stockIssues: string[] = [];
        for (const item of order.items) {
          if (!item.productId) continue;

          const updated = await tx.product.updateMany({
            where: {
              id: item.productId,
              status: ProductStatus.ACTIVE,
              quantity: { gte: item.quantity }
            },
            data: { quantity: { decrement: item.quantity } }
          });
          if (updated.count === 0) {
            stockIssues.push(item.productTitle);
            continue;
          }

          productPaths.add(item.productSlug);
          await tx.product.updateMany({
            where: { id: item.productId, quantity: { lte: 0 } },
            data: { status: ProductStatus.SOLD_OUT }
          });
        }

        await tx.orderStatusEvent.create({
          data: {
            orderId: order.id,
            message: stockIssues.length
              ? `Stripe confirmed payment, but stock could not be reduced for: ${stockIssues.join(', ')}.`
              : 'Stripe confirmed payment and inventory was reduced.'
          }
        });

        paidOrderId = order.id;
      });
    } catch (error) {
      console.error('Stripe order processing failed.', {
        eventId: event.id,
        sessionId: session.id,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return NextResponse.json({ error: 'Order processing failed.' }, { status: 500 });
    }

    // Email delivery is claimed independently and is safe to retry. A delivery failure
    // must never roll back payment or inventory state.
    if (paidOrderId) await sendPaidOrderEmails(paidOrderId);

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/sitemap.xml');
    revalidatePath('/google-merchant-feed.xml');
    for (const slug of productPaths) revalidatePath(`/shop/${slug}`);
  }

  return NextResponse.json({ received: true });
}
