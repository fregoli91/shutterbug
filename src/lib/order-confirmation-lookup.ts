const MAX_SESSION_ID_LENGTH = 255;

type AccessibleOrder = {
  id: string;
  customerId: string | null;
  guestAccessToken: string | null;
};

type LookupOptions<TOrder extends AccessibleOrder> = {
  sessionId: string | null | undefined;
  access: string | null | undefined;
  getCustomer: () => Promise<{ id: string } | null>;
  findOrder: (sessionId: string) => Promise<TOrder | null>;
  matchesGuestAccess: (
    expected: string | null | undefined,
    provided: string | null | undefined
  ) => boolean;
};

export type OrderConfirmationLookupResult<TOrder extends AccessibleOrder> =
  | { kind: 'found'; order: TOrder }
  | { kind: 'not-found' }
  | { kind: 'unavailable' };

export function normalizeOrderConfirmationSessionId(value: string | null | undefined) {
  const normalized = value?.trim();
  if (!normalized || normalized.length > MAX_SESSION_ID_LENGTH) return null;
  return normalized;
}

export async function lookupOrderConfirmation<TOrder extends AccessibleOrder>({
  sessionId,
  access,
  getCustomer,
  findOrder,
  matchesGuestAccess
}: LookupOptions<TOrder>): Promise<OrderConfirmationLookupResult<TOrder>> {
  const normalizedSessionId = normalizeOrderConfirmationSessionId(sessionId);
  if (!normalizedSessionId) return { kind: 'not-found' };

  try {
    const [customer, order] = await Promise.all([
      getCustomer(),
      findOrder(normalizedSessionId)
    ]);

    const isOwner = Boolean(customer && order?.customerId === customer.id);
    const hasGuestAccess = Boolean(order && matchesGuestAccess(order.guestAccessToken, access));
    if (!order || (!isOwner && !hasGuestAccess)) return { kind: 'not-found' };
    return { kind: 'found', order };
  } catch {
    return { kind: 'unavailable' };
  }
}
