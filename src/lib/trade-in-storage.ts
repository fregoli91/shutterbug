import { v2 as cloudinary } from 'cloudinary';
export function hasTradeInImageStorage() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
export function configureTradeInCloudinary() {
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
  return cloudinary;
}
export function signedTradeInImageUrl(publicId: string, version: number, format: string) {
  return configureTradeInCloudinary().url(publicId, {
    type: 'authenticated', secure: true, sign_url: true, version, format,
    transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
  });
}