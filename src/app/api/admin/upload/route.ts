import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getAdminSession } from '@/lib/admin-auth';
import { MAX_PRODUCT_IMAGE_BYTES, validateProductImage } from '@/lib/image-upload-security';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';
import { isSameOriginRequest } from '@/lib/security';

export const runtime = 'nodejs';

function hasCloudinaryEnv() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function jsonError(message: string, status: number, retryAfter?: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {})
      }
    }
  );
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return jsonError('Invalid request origin.', 403);

  const session = await getAdminSession();
  if (!session) return jsonError('Unauthorized', 401);

  const rateLimit = consumeRateLimit({
    scope: 'admin-image-upload',
    identifier: await requestClientIdentifier(),
    limit: 30,
    windowMs: 15 * 60 * 1000
  });
  if (!rateLimit.allowed) return jsonError('Too many upload attempts.', 429, rateLimit.retryAfterSeconds);

  if (!hasCloudinaryEnv()) return jsonError('Image storage is not configured.', 503);

  const contentLength = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_PRODUCT_IMAGE_BYTES + 512 * 1024) {
    return jsonError('Upload is too large.', 413);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return jsonError('Image file is required.', 400);
    await validateProductImage(file);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`;
    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'shutterbug-products',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    });

    return NextResponse.json(
      { url: upload.secure_url, publicId: upload.public_id },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    const message = error instanceof Error && error.message.startsWith('Image ') ? error.message : 'Image upload failed.';
    console.error('[admin-image-upload]', error instanceof Error ? error.message : 'Unknown upload error');
    return jsonError(message, message === 'Image upload failed.' ? 502 : 400);
  }
}