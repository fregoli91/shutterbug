import { randomBytes, timingSafeEqual } from 'node:crypto';

type CustomerOrderLink = {
  id: string;
  customerId: string | null;
  guestAccessToken: string | null;
};

export function createGuestOrderAccessToken() {
  return randomBytes(32).toString('base64url');
}

export function guestOrderAccessMatches(expected: string | null | undefined, provided: string | null | undefined) {
  if (!expected || !provided) return false;

  const left = Buffer.from(expected);
  const right = Buffer.from(provided);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function customerOrderPath(order: CustomerOrderLink) {
  if (order.customerId) return `/account/orders/${order.id}`;
  if (order.guestAccessToken) return `/orders/${order.id}?access=${encodeURIComponent(order.guestAccessToken)}`;
  return '/contact';
}