import { createHash } from "node:crypto";

const LOCAL_IMAGE_PREFIXES = ["/", "data:image/"];

export function cleanInternalRedirect(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const candidate = value.trim();

  if (!candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate, "https://www.shutterbugcamerashop.com");
    return parsed.origin === "https://www.shutterbugcamerashop.com"
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}

export function safePublicUrl(value: unknown, allowedHosts: readonly string[] = []): string | null {
  if (typeof value !== "string" || value.length > 2_048) return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return null;
    if (allowedHosts.length > 0 && !allowedHosts.includes(parsed.hostname.toLowerCase())) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function safeProductImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2_048) return null;
  if (LOCAL_IMAGE_PREFIXES.some((prefix) => value.startsWith(prefix))) return value;
  return safePublicUrl(value, ["res.cloudinary.com"]);
}

export function safeTrackingUrl(value: unknown): string | null {
  return safePublicUrl(value);
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function hashedSecurityKey(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
