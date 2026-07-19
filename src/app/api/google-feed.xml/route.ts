import { NextResponse } from 'next/server';

export function GET(request: Request) {
  return NextResponse.redirect(new URL('/google-merchant-feed.xml', request.url), 308);
}
