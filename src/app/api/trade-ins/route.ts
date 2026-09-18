import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';
import { isSameOriginRequest } from '@/lib/security';
import { createTradeInReference, normalizeTradeInInput } from '@/lib/trade-ins';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const limit = consumeRateLimit({ scope: 'trade-in-create', identifier: `${customer.id}:${await requestClientIdentifier()}`, limit: 12, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) return NextResponse.json({ error: 'Too many draft requests.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } });

  const input = normalizeTradeInInput(await request.json().catch(() => ({})));
  const prisma = requirePrisma();
  const tradeIn = await prisma.tradeInSubmission.create({
    data: {
      ...input,
      reference: createTradeInReference(),
      customerId: customer.id,
      history: { create: { status: 'DRAFT', actor: 'CUSTOMER', message: 'Trade-in draft started.' } }
    },
    include: { images: { orderBy: { sortOrder: 'asc' } } }
  });
  return NextResponse.json({ tradeIn }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}