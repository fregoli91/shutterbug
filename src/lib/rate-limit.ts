import { hashedSecurityKey } from "@/lib/security";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function takeRateLimitResult(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const safeKey = hashedSecurityKey(key);
  const current = buckets.get(safeKey);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(safeKey, { count: 1, resetAt });
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  if (current.count >= limit) return { allowed: false, retryAfterSeconds };

  current.count += 1;
  return { allowed: true, retryAfterSeconds };
}

export function takeRateLimit(key: string, limit: number, windowMs: number): boolean {
  return takeRateLimitResult(key, limit, windowMs).allowed;
}

export function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowMs
}: {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}): { allowed: boolean; retryAfterSeconds: number } {
  return takeRateLimitResult(`${scope}:${identifier}`, limit, windowMs);
}

export function clearRateLimitsForTests(): void {
  buckets.clear();
}
