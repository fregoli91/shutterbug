ALTER TABLE "Product"
  ADD COLUMN "reservedQuantity" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Order"
  ADD COLUMN "reservationExpiresAt" TIMESTAMP(3),
  ADD COLUMN "inventoryReleasedAt" TIMESTAMP(3),
  ADD COLUMN "stripeRefundId" TEXT;

CREATE UNIQUE INDEX "Order_stripeRefundId_key" ON "Order"("stripeRefundId");

CREATE TABLE "StripeWebhookEvent" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "orderId" TEXT,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StripeWebhookEvent_orderId_idx" ON "StripeWebhookEvent"("orderId");

ALTER TABLE "StripeWebhookEvent"
  ADD CONSTRAINT "StripeWebhookEvent_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_priceCents_nonnegative"
  CHECK ("priceCents" >= 0),
  ADD CONSTRAINT "Product_quantity_nonnegative"
  CHECK ("quantity" >= 0),
  ADD CONSTRAINT "Product_reservedQuantity_nonnegative"
  CHECK ("reservedQuantity" >= 0),
  ADD CONSTRAINT "Product_reservedQuantity_within_stock"
  CHECK ("reservedQuantity" <= "quantity");

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_subtotalCents_nonnegative"
  CHECK ("subtotalCents" >= 0),
  ADD CONSTRAINT "Order_shippingCents_nonnegative"
  CHECK ("shippingCents" >= 0),
  ADD CONSTRAINT "Order_taxCents_nonnegative"
  CHECK ("taxCents" >= 0),
  ADD CONSTRAINT "Order_totalCents_nonnegative"
  CHECK ("totalCents" >= 0),
  ADD CONSTRAINT "Order_totalCents_matches_components"
  CHECK ("totalCents" = "subtotalCents" + "shippingCents" + "taxCents");

ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_quantity_positive"
  CHECK ("quantity" > 0),
  ADD CONSTRAINT "OrderItem_unitPriceCents_nonnegative"
  CHECK ("unitPriceCents" >= 0),
  ADD CONSTRAINT "OrderItem_totalPriceCents_nonnegative"
  CHECK ("totalPriceCents" >= 0),
  ADD CONSTRAINT "OrderItem_totalPriceCents_matches"
  CHECK ("totalPriceCents" = "unitPriceCents" * "quantity");
