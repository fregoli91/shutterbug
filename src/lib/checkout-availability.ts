type CheckoutEnvironment = Readonly<Record<string, string | undefined>>;

export function isCheckoutAvailable(environment: CheckoutEnvironment = process.env) {
  return (
    environment.CHECKOUT_ENABLED?.trim().toLowerCase() === 'true' &&
    Boolean(environment.STRIPE_SECRET_KEY?.trim()) &&
    Boolean(environment.STRIPE_WEBHOOK_SECRET?.trim())
  );
}
