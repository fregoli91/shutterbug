'use server';

import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma
} from '@/generated/prisma/client';
import { normalizeCartLines, validateCartLines, type CartLineInput } from '@/lib/cart-validation';
import { getCustomerSession, isValidEmailAddress } from '@/lib/customer-auth';
import { getPublicSiteUrl } from '@/lib/email';
import {
  InventoryReservationError,
  releaseExpiredReservations,
  releaseOrderReservation,
  reserveValidatedItems
} from '@/lib/inventory-reservations';
import { createGuestOrderAccessToken } from '@/lib/order-access';
import { requirePrisma } from '@/lib/prisma';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';
import { safeProductImageUrl } from '@/lib/security';

const MAX_CART_JSON_BYTES = 32 * 1024;
const RESERVATION_MINUTES = 31;
type ReservedOrder = Prisma.OrderGetPayload<{ include: { items: true } }>;

function field(formData: FormData, name: string, maxLength: number) {
  return String(formData.get(name) ?? '').trim().slice(0, maxLength);
}

function orderNumber() {
  return `SB-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

function parseCart(formData: FormData): CartLineInput[] {
  const raw = field(formData, 'cartJson', MAX_CART_JSON_BYTES + 1);
  if (!raw || raw.length > MAX_CART_JSON_BYTES) return [];

  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    const lines = value.map((item) => {
      if (!item || typeof item !== 'object') return {};
      const candidate = item as { id?: unknown; quantity?: unknown };
      return {
        id: typeof candidate.id === 'string' ? candidate.id : '',
        quantity: typeof candidate.quantity === 'number' ? candidate.quantity : Number.NaN
      };
    });
    return normalizeCartLines(lines);
  } catch {
    return [];
  }
}

function checkoutError(code: string): never {
  redirect(`/checkout?error=${encodeURIComponent(code)}`);
}

function stripeImageUrl(image: string) {
  const safeImage = safeProductImageUrl(image);
  return safeImage?.startsWith('https://') ? safeImage : undefined;
}

export async function createPendingOrderAction(formData: FormData) {
  const cartItems = parseCart(formData);
  if (!cartItems.length) checkoutError('empty');

  const rateLimit = consumeRateLimit({
    scope: 'checkout-create',
    identifier: await requestClientIdentifier(),
    limit: 10,
    windowMs: 15 * 60 * 1000
  });
  if (!rateLimit.allowed) checkoutError('rate-limited');

  const name = field(formData, 'name', 120);
  const email = field(formData, 'email', 254).toLowerCase();
  const phone = field(formData, 'phone', 32);
  const line1 = field(formData, 'address', 200);
  const line2 = field(formData, 'address2', 200);
  const city = field(formData, 'city', 120);
  const state = field(formData, 'state', 100);
  const postalCode = field(formData, 'postalCode', 20);
  const country = field(formData, 'country', 2).toUpperCase() || 'US';

  if (!name || !isValidEmailAddress(email) || !line1 || !city || !state || !postalCode || !/^[A-Z]{2}$/.test(country)) {
    checkoutError('missing');
  }
  if (!process.env.STRIPE_SECRET_KEY) checkoutError('stripe');

  const prisma = requirePrisma();
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
  const reservationExpiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000);

  let order: ReservedOrder;
  try {
    order = await prisma.$transaction(
      async (tx) => {
        await releaseExpiredReservations(tx);
        const validation = await validateCartLines(cartItems, { client: tx });
        if (!validation.items.length || validation.hasBlockingIssue) {
          throw new InventoryReservationError('Cart is not purchasable.');
        }

        await reserveValidatedItems(tx, validation.items);
        return tx.order.create({
          data: {
            orderNumber: orderNumber(),
            customerId: customer?.id,
            guestAccessToken: customer ? null : createGuestOrderAccessToken(),
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
            reservationExpiresAt,
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
                message: 'Pending Stripe order created and inventory reserved after server-side validation.'
              }
            }
          },
          include: { items: true }
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (error) {
    if (error instanceof InventoryReservationError || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034')) {
      checkoutError('inventory');
    }
    checkoutError('config');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        client_reference_id: order.id,
        customer_email: email,
        expires_at: Math.floor(reservationExpiresAt.getTime() / 1000),
        line_items: order.items.map((item) => {
          const image = stripeImageUrl(item.imageUrl ?? '');
          return {
            quantity: item.quantity,
            price_data: {
              currency: order.currency.toLowerCase(),
              unit_amount: item.unitPriceCents,
              product_data: {
                name: item.productTitle,
                description: `${item.conditionLabel}${item.productSku ? ` | ${item.productSku}` : ''}`,
                images: image ? [image] : undefined,
                metadata: {
                  productId: item.productId ?? '',
                  slug: item.productSlug,
                  sku: item.productSku
                }
              }
            }
          };
        }),
        success_url: `${getPublicSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}${
          order.guestAccessToken ? `&access=${encodeURIComponent(order.guestAccessToken)}` : ''
        }`,
        cancel_url: `${getPublicSiteUrl()}/checkout/cancel?order_id=${order.id}`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
        payment_intent_data: { metadata: { orderId: order.id, orderNumber: order.orderNumber } }
      },
      { idempotencyKey: `checkout-session-${order.id}` }
    );
  } catch {
    await prisma.$transaction(async (tx) => {
      await releaseOrderReservation(tx, order.id, 'Stripe Checkout session could not be created; reservation released.');
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.CANCELED,
          fulfillmentStatus: FulfillmentStatus.CANCELED,
          cancelledAt: new Date()
        }
      });
    });
    checkoutError('stripe');
  }

  if (!session.url) {
    await prisma.$transaction(async (tx) => {
      await releaseOrderReservation(tx, order.id, 'Stripe Checkout returned no redirect URL; reservation released.');
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.CANCELED,
          fulfillmentStatus: FulfillmentStatus.CANCELED,
          cancelledAt: new Date()
        }
      });
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
      history: { create: { message: 'Stripe Checkout session created.' } }
    }
  });

  redirect(session.url);
}
