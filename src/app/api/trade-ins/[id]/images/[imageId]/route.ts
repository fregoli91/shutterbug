import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';
import { isSameOriginRequest } from '@/lib/security';
import { configureTradeInCloudinary } from '@/lib/trade-in-storage';
import { isCustomerEditableTradeIn } from '@/lib/trade-ins';
type Context = { params: Promise<{ id: string; imageId: string }> };

export async function DELETE(request: Request, { params }: Context) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const { id, imageId } = await params;
  const prisma = requirePrisma();
  const image = await prisma.tradeInImage.findFirst({ where: { id: imageId, tradeInId: id, tradeIn: { customerId: customer.id } }, include: { tradeIn: true } });
  if (!image) return NextResponse.json({ error: 'Photo not found.' }, { status: 404 });
  if (!isCustomerEditableTradeIn(image.tradeIn.status)) return NextResponse.json({ error: 'Submitted trade-ins cannot be edited.' }, { status: 409 });
  await configureTradeInCloudinary().uploader.destroy(image.cloudinaryPublicId, { resource_type: 'image', type: 'authenticated', invalidate: true });
  await prisma.tradeInImage.delete({ where: { id: image.id } });
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}