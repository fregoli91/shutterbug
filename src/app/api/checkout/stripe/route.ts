import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderStatus, PaymentProvider, PaymentStatus, ProductStatus } from '@/generated/prisma/client';
import { getCustomerSession } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

type CartRequest = {
  items?: { id?: string; slug?: string; quantity?: number }[];
};

function orderNumber() {
  return `SB-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  let body: CartRequest;
  try {
    body = (await request.json()) as CartRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid checkout payload.' }, { status: 400 });
  }

  const requestedItems = (body.items ?? [])
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      quantity: Math.max(1, Number(item.quantity || 1))
    }))
    .filter((item) => item.id || item.slug);

  if (!requestedItems.length) return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 500 });
  }

  const prisma = requirePrisma();
  const products = await prisma.product.findMany({
    where: {
      OR: requestedItems.flatMap((item) => [
        item.id ? { id: item.id } : undefined,
        item.slug ? { slug: item.slug } : undefined
      ]).filter(Boolean) as { id?: string; slug?: string }[]
    },
    include: { images: true }
  });

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItems = [];

  for (const requested of requestedItems) {
    const product = products.find((candidate) => candidate.id === requested.id || candidate.slug === requested.slug);
    if (!product) return NextResponse.json({ error: 'A cart item is no longer available.' }, { status: 409 });
    if (product.status !== ProductStatus.ACTIVE || product.quantity < requested.quantity) {
      return NextResponse.json({ error: `${product.title} is not available in that quantity.` }, { status: 409 });
    }

    const image = product.images.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url;
    lineItems.push({
      quantity: requested.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: product.priceCents,
        product_data: {
          name: product.title,
          description: product.conditionSummary || product.shortDescription,
          images: image ? [image] : undefined,
          metadata: { productId: product.id, slug: product.slug }
        }
      }
    });
    orderItems.push({
      productId: product.id,
      productSlug: product.slug,
      productSku: product.sku ?? '',
      productTitle: product.title,
      conditionLabel: product.condition,
      imageUrl: image,
      quantity: requested.quantity,
      unitPriceCents: product.priceCents,
      totalPriceCents: product.priceCents * requested.quantity
    });
  }

  const subtotalCents = orderItems.reduce((sum, item) => sum + item.totalPriceCents, 0);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const customer = await getCustomerSession();

  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber(),
      customerId: customer?.id,
      customerEmail: customer?.email ?? 'pending@stripe.checkout',
      customerName: customer?.name,
      provider: PaymentProvider.STRIPE,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      subtotalCents,
      totalCents: subtotalCents,
      items: { create: orderItems },
      history: { create: { message: 'Stripe Checkout session requested.' } }
    }
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    client_reference_id: order.id,
    customer_email: customer?.email,
    line_items: lineItems,
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    shipping_address_collection: { allowed_countries: ['US'] },
    metadata: { orderId: order.id },
    payment_intent_data: {
      metadata: { orderId: order.id }
    }
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      providerReference: session.id,
      history: { create: { message: `Stripe Checkout session created: ${session.id}` } }
    }
  });

  return NextResponse.json({ url: session.url });
}
