-- Secure guest order access and record the moment Stripe confirms payment.
ALTER TABLE "Order"
ADD COLUMN "guestAccessToken" TEXT,
ADD COLUMN "paidAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Order_guestAccessToken_key" ON "Order"("guestAccessToken");