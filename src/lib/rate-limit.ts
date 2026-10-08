import { hashedSecurityKey } from "@/lib/security";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;
const PRUNE_INTERVAL = 250;
let operationsSincePrune = 0;

function pruneBuckets(now: number) {
  operationsSincePrune += 1;
  if (operationsSincePrune < PRUNE_INTERVAL && buckets.size < MAX_BUCKETS) return;

  operationsSincePrune = 0;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  while (buckets.size >= MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value as string | undefined;
    if (!oldestKey) break;
    buckets.delete(oldestKey);
  }
}

function takeRateLimitResult(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  pruneBuckets(now);
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
  operationsSincePrune = 0;
}
