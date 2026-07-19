import { NextResponse } from 'next/server';
import { validateCartLines, type CartLineInput } from '@/lib/cart-validation';

type CartValidationRequest = {
  items?: CartLineInput[];
};

export async function POST(request: Request) {
  let body: CartValidationRequest;

  try {
    body = (await request.json()) as CartValidationRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid cart payload.' }, { status: 400 });
  }

  const validation = await validateCartLines(body.items ?? []);
  return NextResponse.json(validation);
}
