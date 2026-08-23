type StripePaymentSnapshot = {
  amountTotal: number | null;
  currency: string | null;
  paymentStatus: string;
  livemode: boolean;
};

export function validateStripePaymentSnapshot(
  snapshot: StripePaymentSnapshot,
  expectedTotalCents: number,
  expectedCurrency: string,
  secretKey: string,
): string | null {
  if (snapshot.paymentStatus !== "paid") return "Stripe session is not paid.";
  if (snapshot.amountTotal !== expectedTotalCents) return "Stripe amount does not match the order.";
  if (snapshot.currency?.toUpperCase() !== expectedCurrency.toUpperCase()) return "Stripe currency does not match the order.";

  const expectedLiveMode = secretKey.startsWith("sk_live_");
  const expectedTestMode = secretKey.startsWith("sk_test_");
  if (!expectedLiveMode && !expectedTestMode) return "Stripe secret key mode is not recognizable.";
  if (snapshot.livemode !== expectedLiveMode) return "Stripe event mode does not match the configured key.";
  return null;
}
