import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { MAX_PRODUCT_IMAGE_BYTES, validateProductImage } from '@/lib/image-upload-security';
import { requirePrisma } from '@/lib/prisma';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';
import { isSameOriginRequest } from '@/lib/security';
import { configureTradeInCloudinary, hasTradeInImageStorage } from '@/lib/trade-in-storage';
import { isCustomerEditableTradeIn } from '@/lib/trade-ins';
type Context = { params: Promise<{ id: string }> };
export const runtime = 'nodejs';

export async function POST(request: Request, { params }: Context) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  if (!hasTradeInImageStorage()) return NextResponse.json({ error: 'Private image storage is not configured.' }, { status: 503 });
  const rate = consumeRateLimit({ scope: 'trade-in-photo', identifier: `${customer.id}:${await requestClientIdentifier()}`, limit: 40, windowMs: 60 * 60 * 1000 });
  if (!rate.allowed) return NextResponse.json({ error: 'Too many upload attempts.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } });
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_PRODUCT_IMAGE_BYTES + 512 * 1024) return NextResponse.json({ error: 'Upload is too large.' }, { status: 413 });

  const { id } = await params;
  const prisma = requirePrisma();
  const tradeIn = await prisma.tradeInSubmission.findFirst({ where: { id, customerId: customer.id }, include: { _count: { select: { images: true } } } });
  if (!tradeIn) return NextResponse.json({ error: 'Trade-in not found.' }, { status: 404 });
  if (!isCustomerEditableTradeIn(tradeIn.status)) return NextResponse.json({ error: 'Submitted trade-ins cannot be edited.' }, { status: 409 });
  if (tradeIn._count.images >= 10) return NextResponse.json({ error: 'You can upload up to 10 photos.' }, { status: 400 });

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    await validateProductImage(file);
    const bytes = Buffer.from(await file.arrayBuffer());
    const upload = await configureTradeInCloudinary().uploader.upload(`data:${file.type};base64,${bytes.toString('base64')}`, {
      folder: process.env.CLOUDINARY_TRADE_IN_FOLDER || 'shutterbug-trade-ins',
      resource_type: 'image',
      type: 'authenticated',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    });
    const image = await prisma.tradeInImage.create({
      data: {
        tradeInId: id, cloudinaryPublicId: upload.public_id, cloudinaryVersion: upload.version,
        format: upload.format, mimeType: file.type, bytes: file.size, width: upload.width,
        height: upload.height, sortOrder: tradeIn._count.images
      }
    });
    return NextResponse.json({ image: { ...image, url: `/api/trade-ins/images/${image.id}` } }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error && (error.message.startsWith('Image ') || error.message.startsWith('Unsupported')) ? error.message : 'Image upload failed.';
    console.error('[trade-in-photo]', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: message }, { status: message === 'Image upload failed.' ? 502 : 400 });
  }
}
export async function PATCH(request: Request, { params }: Context) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const { id } = await params;
  const prisma = requirePrisma();
  const tradeIn = await prisma.tradeInSubmission.findFirst({
    where: { id, customerId: customer.id },
    include: { images: { select: { id: true } } }
  });
  if (!tradeIn) return NextResponse.json({ error: 'Trade-in not found.' }, { status: 404 });
  if (!isCustomerEditableTradeIn(tradeIn.status)) return NextResponse.json({ error: 'Submitted trade-ins cannot be edited.' }, { status: 409 });
  const body = await request.json().catch(() => ({}));
  const imageIds = body && typeof body === 'object' && Array.isArray((body as Record<string, unknown>).imageIds)
    ? (body as { imageIds: unknown[] }).imageIds.filter((value): value is string => typeof value === 'string')
    : [];
  const owned = new Set(tradeIn.images.map((image) => image.id));
  if (imageIds.length !== owned.size || imageIds.some((imageId) => !owned.has(imageId)) || new Set(imageIds).size !== imageIds.length) {
    return NextResponse.json({ error: 'Invalid photo order.' }, { status: 400 });
  }
  await prisma.$transaction(imageIds.map((imageId, sortOrder) => prisma.tradeInImage.update({ where: { id: imageId }, data: { sortOrder } })));
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}