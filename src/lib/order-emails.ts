import { PaymentStatus, type Prisma } from '@/generated/prisma/client';
import { getPublicSiteUrl, sendTransactionalEmail } from '@/lib/email';
import { formatCents } from '@/lib/money';
import { requirePrisma } from '@/lib/prisma';
import { site } from '@/lib/seo';

type PaidOrder = Prisma.OrderGetPayload<{ include: { items: true } }>;
type PrismaClientLike = ReturnType<typeof requirePrisma>;

const EMAIL_CLAIM_TTL_MS = 15 * 60 * 1000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function adminOrderEmail() {
  return process.env.ADMIN_ORDER_EMAIL || process.env.ADMIN_EMAIL || site.supportEmail;
}

function staleClaimCutoff() {
  return new Date(Date.now() - EMAIL_CLAIM_TTL_MS);
}

function orderUrl(order: PaidOrder) {
  return `${getPublicSiteUrl()}/orders/${order.id}`;
}

function adminOrderUrl(order: PaidOrder) {
  return `${getPublicSiteUrl()}/admin/orders/${order.id}`;
}

function formatAddressLines(address: unknown) {
  if (!address || typeof address !== 'object' || Array.isArray(address)) {
    return ['Shipping address pending'];
  }

  const value = address as Record<string, unknown>;
  const cityLine = [value.city, value.state, value.postal_code].filter(Boolean).join(', ');
  const lines = [value.name, value.phone, value.line1, value.line2, cityLine, value.country]
    .map((line) => String(line ?? '').trim())
    .filter(Boolean);

  return lines.length ? lines : ['Shipping address pending'];
}

function itemRowsText(order: PaidOrder) {
  return order.items
    .map(
      (item) =>
        `${item.quantity} x ${item.productTitle} (${item.productSku || item.productSlug}, ${item.conditionLabel}) - ${formatCents(
          item.totalPriceCents,
          order.currency
        )}`
    )
    .join('\n');
}

function itemRowsHtml(order: PaidOrder) {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid rgba(22,35,29,.12)">
            <div style="font-weight:700">${escapeHtml(item.productTitle)}</div>
            <div style="font-size:13px;color:rgba(22,35,29,.68)">${escapeHtml(
              [item.productSku || item.productSlug, item.conditionLabel].filter(Boolean).join(' | ')
            )}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid rgba(22,35,29,.12);text-align:center">${item.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid rgba(22,35,29,.12);text-align:right">${escapeHtml(
            formatCents(item.totalPriceCents, order.currency)
          )}</td>
        </tr>`
    )
    .join('');
}

function totalsText(order: PaidOrder) {
  return [
    `Subtotal: ${formatCents(order.subtotalCents, order.currency)}`,
    `Shipping: ${formatCents(order.shippingCents, order.currency)}`,
    `Tax: ${formatCents(order.taxCents, order.currency)}`,
    `Total: ${formatCents(order.totalCents, order.currency)}`
  ].join('\n');
}

function totalsHtml(order: PaidOrder) {
  const rows: Array<[string, number]> = [
    ['Subtotal', order.subtotalCents],
    ['Shipping', order.shippingCents],
    ['Tax', order.taxCents],
    ['Total', order.totalCents]
  ];

  return rows
    .map(
      ([label, cents]) => `
        <div style="display:flex;justify-content:space-between;gap:16px;${
          label === 'Total' ? 'font-weight:700;border-top:1px solid rgba(22,35,29,.12);padding-top:10px;margin-top:8px' : ''
        }">
          <span>${label}</span>
          <span>${escapeHtml(formatCents(Number(cents), order.currency))}</span>
        </div>`
    )
    .join('');
}

function shell(content: string) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#16231d;background:#fde9cd;padding:24px">
      <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid rgba(22,35,29,.12);border-radius:8px;padding:24px">
        <p style="font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#2f6f4e">Shutterbug Camera Shop</p>
        ${content}
      </div>
    </div>
  `;
}

export function buildCustomerPaidOrderEmail(order: PaidOrder) {
  const displayName = order.customerName?.trim() || 'there';
  const address = formatAddressLines(order.shippingAddress);
  const text = `Hi ${displayName},

Thank you for your Shutterbug order. Stripe has confirmed your payment.

Order: ${order.orderNumber}
Order status: ${order.status}
Payment status: ${order.paymentStatus}

Items:
${itemRowsText(order)}

${totalsText(order)}

Shipping to:
${address.join('\n')}

View your order:
${orderUrl(order)}

Questions? Contact ${site.supportEmail}.`;

  const html = shell(`
    <h1 style="font-family:Georgia,serif;margin:12px 0 8px">Your Shutterbug order is confirmed</h1>
    <p>Hi ${escapeHtml(displayName)}, thank you for your order. Stripe has confirmed your payment.</p>
    <div style="background:#fde9cd;border-radius:8px;padding:16px;margin:20px 0">
      <div><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</div>
      <div><strong>Order status:</strong> ${escapeHtml(order.status)}</div>
      <div><strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <thead>
        <tr>
          <th align="left" style="font-size:12px;text-transform:uppercase;color:#2f6f4e">Item</th>
          <th align="center" style="font-size:12px;text-transform:uppercase;color:#2f6f4e">Qty</th>
          <th align="right" style="font-size:12px;text-transform:uppercase;color:#2f6f4e">Total</th>
        </tr>
      </thead>
      <tbody>${itemRowsHtml(order)}</tbody>
    </table>
    <div style="margin:20px 0">${totalsHtml(order)}</div>
    <div style="background:#f6d8ad;border-radius:8px;padding:16px;margin:20px 0">
      <strong>Shipping to</strong>
      ${address.map((line) => `<div>${escapeHtml(line)}</div>`).join('')}
    </div>
    <p style="margin:24px 0">
      <a href="${orderUrl(order)}" style="display:inline-block;background:#24543a;color:white;text-decoration:none;border-radius:999px;padding:12px 20px;font-weight:700">View order</a>
    </p>
    <p style="font-size:14px;color:rgba(22,35,29,.72)">Questions? Reply to this email or contact ${escapeHtml(
      site.supportEmail
    )}.</p>
  `);

  return {
    to: order.customerEmail,
    subject: `Shutterbug order ${order.orderNumber} confirmed`,
    html,
    text
  };
}

export function buildAdminPaidOrderEmail(order: PaidOrder) {
  const address = formatAddressLines(order.shippingAddress);
  const text = `New paid Shutterbug order

Order: ${order.orderNumber}
Order ID: ${order.id}
Order status: ${order.status}
Payment status: ${order.paymentStatus}
Provider: ${order.provider}
Stripe session: ${order.stripeCheckoutSessionId || 'Not recorded'}
Stripe payment intent: ${order.stripePaymentIntentId || 'Not recorded'}

Customer:
${order.customerName || 'Name pending'}
${order.customerEmail}
${order.customerPhone || ''}

Shipping address:
${address.join('\n')}

Items:
${itemRowsText(order)}

${totalsText(order)}

Admin order:
${adminOrderUrl(order)}`;

  const html = shell(`
    <h1 style="font-family:Georgia,serif;margin:12px 0 8px">New paid order</h1>
    <div style="background:#fde9cd;border-radius:8px;padding:16px;margin:20px 0">
      <div><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</div>
      <div><strong>Order ID:</strong> ${escapeHtml(order.id)}</div>
      <div><strong>Order status:</strong> ${escapeHtml(order.status)}</div>
      <div><strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}</div>
      <div><strong>Provider:</strong> ${escapeHtml(order.provider)}</div>
      <div><strong>Stripe session:</strong> ${escapeHtml(order.stripeCheckoutSessionId || 'Not recorded')}</div>
      <div><strong>Stripe payment intent:</strong> ${escapeHtml(order.stripePaymentIntentId || 'Not recorded')}</div>
    </div>
    <div style="background:#f6d8ad;border-radius:8px;padding:16px;margin:20px 0">
      <strong>Customer</strong>
      <div>${escapeHtml(order.customerName || 'Name pending')}</div>
      <div>${escapeHtml(order.customerEmail)}</div>
      ${order.customerPhone ? `<div>${escapeHtml(order.customerPhone)}</div>` : ''}
    </div>
    <div style="background:#f6d8ad;border-radius:8px;padding:16px;margin:20px 0">
      <strong>Shipping address</strong>
      ${address.map((line) => `<div>${escapeHtml(line)}</div>`).join('')}
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <thead>
        <tr>
          <th align="left" style="font-size:12px;text-transform:uppercase;color:#2f6f4e">Item</th>
          <th align="center" style="font-size:12px;text-transform:uppercase;color:#2f6f4e">Qty</th>
          <th align="right" style="font-size:12px;text-transform:uppercase;color:#2f6f4e">Total</th>
        </tr>
      </thead>
      <tbody>${itemRowsHtml(order)}</tbody>
    </table>
    <div style="margin:20px 0">${totalsHtml(order)}</div>
    <p style="margin:24px 0">
      <a href="${adminOrderUrl(order)}" style="display:inline-block;background:#24543a;color:white;text-decoration:none;border-radius:999px;padding:12px 20px;font-weight:700">Open admin order</a>
    </p>
  `);

  return {
    to: adminOrderEmail(),
    subject: `New paid Shutterbug order ${order.orderNumber}`,
    html,
    text
  };
}

async function claimCustomerEmail(prisma: PrismaClientLike, orderId: string) {
  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      paymentStatus: PaymentStatus.PAID,
      customerEmailSentAt: null,
      OR: [{ customerEmailSendingAt: null }, { customerEmailSendingAt: { lt: staleClaimCutoff() } }]
    },
    data: { customerEmailSendingAt: new Date() }
  });

  return result.count > 0;
}

async function claimAdminEmail(prisma: PrismaClientLike, orderId: string) {
  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      paymentStatus: PaymentStatus.PAID,
      adminEmailSentAt: null,
      OR: [{ adminEmailSendingAt: null }, { adminEmailSendingAt: { lt: staleClaimCutoff() } }]
    },
    data: { adminEmailSendingAt: new Date() }
  });

  return result.count > 0;
}

export async function sendPaidOrderEmails(orderId: string) {
  const prisma = requirePrisma();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order || order.paymentStatus !== PaymentStatus.PAID) return;

  if (!order.customerEmailSentAt && (await claimCustomerEmail(prisma, order.id))) {
    try {
      const email = buildCustomerPaidOrderEmail(order);
      const result = await sendTransactionalEmail(email);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          customerEmailSendingAt: null,
          customerEmailSentAt: new Date(),
          history: {
            create: {
              message: `Customer paid order email sent via ${result.provider}.`
            }
          }
        }
      });
    } catch (error) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          customerEmailSendingAt: null,
          history: {
            create: {
              message: `Customer paid order email failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          }
        }
      });
    }
  }

  const latestOrder = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (
    !latestOrder ||
    latestOrder.paymentStatus !== PaymentStatus.PAID ||
    latestOrder.adminEmailSentAt ||
    !(await claimAdminEmail(prisma, latestOrder.id))
  ) {
    return;
  }

  try {
    const email = buildAdminPaidOrderEmail(latestOrder);
    const result = await sendTransactionalEmail(email);
    await prisma.order.update({
      where: { id: latestOrder.id },
      data: {
        adminEmailSendingAt: null,
        adminEmailSentAt: new Date(),
        history: {
          create: {
            message: `Admin paid order email sent via ${result.provider}.`
          }
        }
      }
    });
  } catch (error) {
    await prisma.order.update({
      where: { id: latestOrder.id },
      data: {
        adminEmailSendingAt: null,
        history: {
          create: {
            message: `Admin paid order email failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }
      }
    });
  }
}
