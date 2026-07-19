CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED'
);

ALTER TABLE "Order"
  ADD COLUMN "customerPhone" TEXT,
  ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT';

UPDATE "Order"
SET "status" = CASE
  WHEN "paymentStatus" = 'REFUNDED' THEN 'REFUNDED'::"OrderStatus"
  WHEN "paymentStatus" = 'CANCELED' OR "fulfillmentStatus" = 'CANCELED' THEN 'CANCELLED'::"OrderStatus"
  WHEN "paymentStatus" = 'FAILED' THEN 'CANCELLED'::"OrderStatus"
  WHEN "fulfillmentStatus" = 'DELIVERED' THEN 'DELIVERED'::"OrderStatus"
  WHEN "fulfillmentStatus" = 'SHIPPED' THEN 'SHIPPED'::"OrderStatus"
  WHEN "fulfillmentStatus" = 'PROCESSING' THEN 'PROCESSING'::"OrderStatus"
  WHEN "paymentStatus" = 'PAID' THEN 'PAID'::"OrderStatus"
  ELSE 'PENDING_PAYMENT'::"OrderStatus"
END;

ALTER TABLE "OrderItem"
  ADD COLUMN "productSku" TEXT NOT NULL DEFAULT '';

CREATE INDEX "Order_status_idx" ON "Order"("status");
