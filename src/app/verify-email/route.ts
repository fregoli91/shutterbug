import { NextResponse } from 'next/server';
import { createCustomerSession, verifyCustomerEmailToken } from '@/lib/customer-auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=verify-invalid', request.url));
  }

  const result = await verifyCustomerEmailToken(token);

  if (result.status === 'verified') {
    await createCustomerSession({ id: result.customer.id, email: result.customer.email });
    return NextResponse.redirect(new URL('/account?status=verified', request.url));
  }

  if (result.status === 'expired') {
    const checkEmailUrl = new URL('/signup/check-email', request.url);
    checkEmailUrl.searchParams.set('status', 'expired');
    if (result.email) checkEmailUrl.searchParams.set('email', result.email);
    return NextResponse.redirect(checkEmailUrl);
  }

  return NextResponse.redirect(new URL('/login?error=verify-invalid', request.url));
}
