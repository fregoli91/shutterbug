ALTER TABLE "Order"
  ADD COLUMN "stripeCheckoutSessionId" TEXT,
  ADD COLUMN "stripePaymentIntentId" TEXT;

UPDATE "Order"
SET "stripeCheckoutSessionId" = "providerReference"
WHERE "provider" = 'STRIPE' AND "providerReference" IS NOT NULL;

CREATE UNIQUE INDEX "Order_stripeCheckoutSessionId_key" ON "Order"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");
