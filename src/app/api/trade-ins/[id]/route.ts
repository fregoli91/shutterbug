import { NextResponse } from 'next/server';
import { TradeInStatus } from '@/generated/prisma/client';
import { getCustomerSession } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';
import { notifyTradeInSubmitted } from '@/lib/trade-in-emails';
import { isSameOriginRequest } from '@/lib/security';
import { isCustomerEditableTradeIn, normalizeTradeInInput, tradeInSubmissionErrors } from '@/lib/trade-ins';
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const { id } = await params;
  const prisma = requirePrisma();
  const existing = await prisma.tradeInSubmission.findFirst({ where: { id, customerId: customer.id }, include: { _count: { select: { images: true } } } });
  if (!existing) return NextResponse.json({ error: 'Trade-in not found.' }, { status: 404 });
  if (!isCustomerEditableTradeIn(existing.status)) return NextResponse.json({ error: 'Submitted trade-ins cannot be edited.' }, { status: 409 });

  const body = await request.json().catch(() => ({}));
  const input = normalizeTradeInInput(body);
  const submitting = body && typeof body === 'object' && (body as Record<string, unknown>).submit === true;
  const errors = submitting ? tradeInSubmissionErrors(input, existing._count.images) : [];
  if (submitting && (body as Record<string, unknown>).ownershipConfirmed !== true) errors.push('Confirm that you own or are authorized to sell this gear.');
  if (errors.length) return NextResponse.json({ error: errors[0], errors }, { status: 400 });

  const tradeIn = await prisma.tradeInSubmission.update({
    where: { id },
    data: {
      ...input,
      ...(submitting ? {
        status: TradeInStatus.SUBMITTED,
        submittedAt: new Date(),
        history: { create: { status: TradeInStatus.SUBMITTED, actor: 'CUSTOMER', message: 'Trade-in submitted for review.' } }
      } : {})
    },
    include: { images: { orderBy: { sortOrder: 'asc' } } }
  });
  if (submitting) await notifyTradeInSubmitted(tradeIn.id);
  return NextResponse.json({ tradeIn }, { headers: { 'Cache-Control': 'no-store' } });
}