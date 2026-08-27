import { NextResponse } from 'next/server';
import { validateCartLines, type CartLineInput } from '@/lib/cart-validation';
import { consumeRateLimit } from '@/lib/rate-limit';
import { isSameOriginRequest } from '@/lib/security';

type CartValidationRequest = { items?: CartLineInput[] };

const MAX_BODY_BYTES = 64 * 1024;
const MAX_CART_LINES = 50;

function clientIdentifier(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown-client';
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Bag payload is too large.' }, { status: 413 });
  }

  const rateLimit = consumeRateLimit({
    scope: 'cart-validation',
    identifier: clientIdentifier(request),
    limit: 60,
    windowMs: 60 * 1000
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many bag requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
    );
  }

  let body: CartValidationRequest;
  try {
    body = (await request.json()) as CartValidationRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid bag payload.' }, { status: 400 });
  }

  if (!body || !Array.isArray(body.items) || body.items.length > MAX_CART_LINES) {
    return NextResponse.json({ error: 'Invalid bag payload.' }, { status: 400 });
  }

  try {
    const validation = await validateCartLines(body.items, { requireDatabase: true });
    return NextResponse.json(validation, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch {
    console.error('Bag validation failed.');
    return NextResponse.json({ error: 'Bag validation is temporarily unavailable.' }, { status: 503 });
  }
}
