import { NextResponse } from 'next/server';
import { clearCustomerSession } from '@/lib/customer-auth';

export async function POST(request: Request) {
  await clearCustomerSession();
  return NextResponse.redirect(new URL('/login?status=logged-out', request.url), { status: 303 });
}
