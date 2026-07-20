'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  type Prisma
} from '@/generated/prisma/client';
import { validateCartLines, type CartLineInput } from '@/lib/cart-validation';
import { getCustomerSession } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim();
}

function orderNumber() {
  return `SB-${Date.now().toString(36).toUpperCase()}`;
}

function parseCart(formData: FormData): CartLineInput[] {
  const raw = field(formData, 'cartJson');
  if (!raw) return [];

  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
      const candidate = item as { id?: unknown; quantity?: unknown };
      return {
        id: String(candidate.id ?? ''),
        quantity: Number(candidate.quantity ?? 1)
      };
    });
  } catch {
    return [];
  }
}

function checkoutError(code: string): never {
  redirect(`/checkout?error=${encodeURIComponent(code)}`);
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function stripeImageUrl(image: string) {
  return image.startsWith('https://') ? image : undefined;
}

export async function createPendingOrderAction(formData: FormData) {
  const cartItems = parseCart(formData);
  if (!cartItems.length) checkoutError('empty');

  const name = field(formData, 'name');
  const email = field(formData, 'email').toLowerCase();
  const phone = field(formData, 'phone');
  const line1 = field(formData, 'address');
  const line2 = field(formData, 'address2');
  const city = field(formData, 'city');
  const state = field(formData, 'state');
  const postalCode = field(formData, 'postalCode');
  const country = field(formData, 'country') || 'US';

  if (!name || !email || !line1 || !city || !state || !postalCode || !country) {
    checkoutError('missing');
  }

  let prisma: ReturnType<typeof requirePrisma>;
  let validation: Awaited<ReturnType<typeof validateCartLines>>;
  try {
    prisma = requirePrisma();
    validation = await validateCartLines(cartItems, { requireDatabase: true });
  } catch {
    checkoutError('config');
  }
  if (!validation.items.length) checkoutError('empty');
  if (validation.hasBlockingIssue) checkoutError('inventory');
  if (!process.env.STRIPE_SECRET_KEY) checkoutError('stripe');

  const customer = await getCustomerSession();
  const shippingAddress: Prisma.InputJsonObject = {
    name,
    phone,
    line1,
    line2,
    city,
    state,
    postal_code: postalCode,
    country
  };

  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber(),
      customerId: customer?.id,
      customerEmail: email,
      customerName: name,
      customerPhone: phone || null,
      provider: PaymentProvider.STRIPE,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      shippingAddress,
      billingAddress: shippingAddress,
      subtotalCents: validation.subtotalCents,
      totalCents: validation.subtotalCents,
      items: {
        create: validation.items.map((item) => ({
          productId: item.id,
          productSlug: item.slug,
          productSku: item.sku,
          productTitle: item.title,
          conditionLabel: item.condition,
          imageUrl: item.image,
          quantity: item.validatedQuantity,
          unitPriceCents: item.unitPriceCents,
          totalPriceCents: item.lineTotalCents
        }))
      },
      history: {
        create: {
          message: 'Pending Stripe order created after server-side cart validation.'
        }
      }
    }
  });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: order.id,
      customer_email: email,
      line_items: validation.items.map((item) => {
        const image = stripeImageUrl(item.image);
        return {
          quantity: item.validatedQuantity,
          price_data: {
            currency: 'usd',
            unit_amount: item.unitPriceCents,
            product_data: {
              name: item.title,
              description: `${item.condition}${item.sku ? ` | ${item.sku}` : ''}`,
              images: image ? [image] : undefined,
              metadata: {
                productId: item.id,
                slug: item.slug,
                sku: item.sku
              }
            }
          }
        };
      }),
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      }
    });
  } catch {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        history: { create: { message: 'Stripe Checkout session could not be created.' } }
      }
    });
    checkoutError('stripe');
  }

  if (!session.url) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        history: { create: { message: 'Stripe Checkout session did not return a redirect URL.' } }
      }
    });
    checkoutError('stripe');
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      providerReference: session.id,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      history: { create: { message: `Stripe Checkout session created: ${session.id}` } }
    }
  });

  redirect(session.url);
}
