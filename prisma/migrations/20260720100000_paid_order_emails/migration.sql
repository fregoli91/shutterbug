ALTER TABLE "Order"
  ADD COLUMN "customerEmailSendingAt" TIMESTAMP(3),
  ADD COLUMN "customerEmailSentAt" TIMESTAMP(3),
  ADD COLUMN "adminEmailSendingAt" TIMESTAMP(3),
  ADD COLUMN "adminEmailSentAt" TIMESTAMP(3);
