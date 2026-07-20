import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import { OrderStatus, PaymentStatus, ProductStatus, type Prisma } from '@/generated/prisma/client';
import { normalizeEmail } from '@/lib/customer-auth';
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const prisma = requirePrisma();
    const intentId = paymentIntentId(session.payment_intent);
    const productPaths = new Set<string>();
    let paidOrderId: string | null = null;

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
          await tx.order.update({
            where: { id: order.id },
            data: { stripePaymentIntentId: intentId }
          });
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

      const email = session.customer_details?.email
        ? normalizeEmail(session.customer_details.email)
        : order.customerEmail;
      const matchedCustomer =
        email && email !== 'pending@stripe.checkout' ? await tx.customer.findUnique({ where: { email } }) : null;
      const billingAddress = toJson(session.customer_details?.address);
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
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product && product.quantity <= 0) {
          await tx.product.update({ where: { id: product.id }, data: { status: ProductStatus.SOLD_OUT } });
        }
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          customerId: order.customerId ?? matchedCustomer?.id,
          status: OrderStatus.PAID,
          paymentStatus: PaymentStatus.PAID,
          customerEmail: email,
          customerName: session.customer_details?.name ?? order.customerName,
          billingAddress,
          providerReference: session.id,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: intentId,
          history: {
            create: {
              message: stockIssues.length
                ? `Stripe confirmed payment, but stock could not be reduced for: ${stockIssues.join(', ')}.`
                : 'Stripe confirmed payment and inventory was reduced.'
            }
          }
        }
      });

      for (const title of stockIssues) {
        await tx.orderStatusEvent.create({
          data: {
            orderId: order.id,
            message: `Payment captured, but stock could not be reduced for ${title}.`
          }
        });
      }

      paidOrderId = order.id;
    });

    if (paidOrderId) {
      await sendPaidOrderEmails(paidOrderId);
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/sitemap.xml');
    revalidatePath('/google-merchant-feed.xml');
    for (const slug of productPaths) {
      revalidatePath(`/shop/${slug}`);
    }
  }

  return NextResponse.json({ received: true });
}
