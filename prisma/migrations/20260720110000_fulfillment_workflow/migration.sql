ALTER TABLE "Order"
  ADD COLUMN "carrier" TEXT,
  ADD COLUMN "trackingUrl" TEXT,
  ADD COLUMN "adminNotes" TEXT,
  ADD COLUMN "processingAt" TIMESTAMP(3),
  ADD COLUMN "shippedAt" TIMESTAMP(3),
  ADD COLUMN "deliveredAt" TIMESTAMP(3),
  ADD COLUMN "cancelledAt" TIMESTAMP(3),
  ADD COLUMN "refundedAt" TIMESTAMP(3),
  ADD COLUMN "shippingEmailSendingAt" TIMESTAMP(3),
  ADD COLUMN "shippingEmailSentAt" TIMESTAMP(3);
