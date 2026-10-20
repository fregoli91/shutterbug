import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { lookupOrderConfirmation } from '@/lib/order-confirmation-lookup';
import { orderConfirmationSelect, toOrderConfirmation } from '@/lib/order-confirmation';
import { guestOrderAccessMatches } from '@/lib/order-access';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const access = url.searchParams.get('access')?.trim();
  const prisma = getPrisma();
  const result = await lookupOrderConfirmation({
    sessionId,
    access,
    getCustomer: getCustomerSession,
    matchesGuestAccess: guestOrderAccessMatches,
    findOrder: async (normalizedSessionId) => {
      if (!prisma) throw new Error('Order confirmation storage unavailable.');
      return prisma.order.findFirst({
        where: {
          OR: [
            { stripeCheckoutSessionId: normalizedSessionId },
            { providerReference: normalizedSessionId }
          ]
        },
        select: orderConfirmationSelect
      });
    }
  });

  if (result.kind === 'not-found') {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  if (result.kind === 'unavailable') {
    console.error('Order confirmation lookup unavailable.');
    return NextResponse.json(
      { error: 'Order confirmation is temporarily unavailable.' },
      {
        status: 503,
        headers: { 'Cache-Control': 'private, no-store, max-age=0' }
      }
    );
  }

  return NextResponse.json(toOrderConfirmation(result.order), {
    headers: { 'Cache-Control': 'private, no-store, max-age=0' }
  });
}
