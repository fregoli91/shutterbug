import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json(
    { error: 'Use the /checkout form so shipping details and server-side cart validation are included.' },
    { status: 410 }
  );
}
