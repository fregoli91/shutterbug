import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { guestOrderAccessMatches } from '@/lib/order-access';
import { toOrderConfirmation } from '@/lib/order-confirmation';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id')?.trim();
  const access = url.searchParams.get('access')?.trim();
  if (!sessionId) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const [customer, order] = await Promise.all([
    getCustomerSession(),
    prisma.order.findFirst({
      where: { OR: [{ stripeCheckoutSessionId: sessionId }, { providerReference: sessionId }] },
      include: { items: true }
    })
  ]);

  const isOwner = Boolean(customer && order?.customerId === customer.id);
  const hasGuestAccess = Boolean(order && guestOrderAccessMatches(order.guestAccessToken, access));
  if (!order || (!isOwner && !hasGuestAccess)) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json(toOrderConfirmation(order), {
    headers: { 'Cache-Control': 'private, no-store, max-age=0' }
  });
}
