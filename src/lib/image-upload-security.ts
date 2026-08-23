export const MAX_PRODUCT_IMAGE_BYTES = 8 * 1024 * 1024;

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function isAllowedImageType(type: string): boolean {
  return allowedTypes.has(type.toLowerCase());
}

export function hasAllowedImageSignature(bytes: Uint8Array, type: string): boolean {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") {
    return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => bytes[i] === v);
  }
  if (type === "image/webp") {
    return bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export async function validateProductImage(file: File): Promise<void> {
  if (!isAllowedImageType(file.type)) throw new Error("Unsupported image type.");
  if (file.size <= 0 || file.size > MAX_PRODUCT_IMAGE_BYTES) throw new Error("Image must be no larger than 8 MB.");

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!hasAllowedImageSignature(bytes, file.type)) throw new Error("Image content does not match its declared type.");
}
