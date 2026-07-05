import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentStatus, ProductStatus, type Prisma } from '@/generated/prisma/client';
import { normalizeEmail } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  return value ? (JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue) : undefined;
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
    const providerReference = session.id;

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { providerReference },
        include: { items: true }
      });
      if (!order || order.paymentStatus === PaymentStatus.PAID) return;

      const email = session.customer_details?.email
        ? normalizeEmail(session.customer_details.email)
        : order.customerEmail;
      const matchedCustomer =
        email && email !== 'pending@stripe.checkout' ? await tx.customer.findUnique({ where: { email } }) : null;

      await tx.order.update({
        where: { id: order.id },
        data: {
          customerId: order.customerId ?? matchedCustomer?.id,
          paymentStatus: PaymentStatus.PAID,
          customerEmail: email,
          customerName: session.customer_details?.name ?? order.customerName,
          shippingAddress: toJson(session.customer_details?.address),
          providerReference,
          history: { create: { message: 'Stripe confirmed payment.' } }
        }
      });

      for (const item of order.items) {
        if (!item.productId) continue;
        const updated = await tx.product.updateMany({
          where: { id: item.productId, quantity: { gte: item.quantity } },
          data: { quantity: { decrement: item.quantity } }
        });
        if (updated.count === 0) {
          await tx.orderStatusEvent.create({
            data: {
              orderId: order.id,
              message: `Payment captured, but stock could not be reduced for ${item.productTitle}.`
            }
          });
          continue;
        }
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product && product.quantity <= 0) {
          await tx.product.update({ where: { id: product.id }, data: { status: ProductStatus.SOLD_OUT } });
        }
      }
    });
  }

  return NextResponse.json({ received: true });
}
