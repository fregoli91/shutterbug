import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getCustomerSession } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';
import { signedTradeInImageUrl } from '@/lib/trade-in-storage';
type Context = { params: Promise<{ imageId: string }> };

export async function GET(_request: Request, { params }: Context) {
  const [customer, admin, { imageId }] = await Promise.all([getCustomerSession(), getAdminSession(), params]);
  if (!customer && !admin) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const image = await requirePrisma().tradeInImage.findFirst({
    where: { id: imageId, ...(admin ? {} : { tradeIn: { customerId: customer!.id } }) }
  });
  if (!image) return NextResponse.json({ error: 'Photo not found.' }, { status: 404 });
  const response = NextResponse.redirect(signedTradeInImageUrl(image.cloudinaryPublicId, image.cloudinaryVersion, image.format));
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}