import { NextResponse } from 'next/server';
import { clearCustomerSession } from '@/lib/customer-auth';
import { isSameOriginRequest } from '@/lib/security';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  await clearCustomerSession();
  return NextResponse.redirect(new URL('/login?status=logged-out', request.url), { status: 303 });
}
