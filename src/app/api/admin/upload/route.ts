import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

function hasCloudinaryEnv() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasCloudinaryEnv()) {
    return NextResponse.json({ error: 'Cloudinary environment variables are not configured.' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Image must be 8MB or smaller.' }, { status: 400 });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`;
  const upload = await cloudinary.uploader.upload(dataUri, {
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'shutterbug-products',
    resource_type: 'image'
  });

  return NextResponse.json({ url: upload.secure_url, publicId: upload.public_id });
}
