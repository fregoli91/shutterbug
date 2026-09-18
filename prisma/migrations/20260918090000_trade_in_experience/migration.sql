CREATE TYPE "TradeInStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'OFFER_SENT', 'OFFER_ACCEPTED', 'OFFER_DECLINED', 'SHIPPING_ARRANGED', 'RECEIVED', 'INSPECTING', 'REVISED_OFFER_SENT', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TradeInItemType" AS ENUM ('DIGITAL_CAMERA', 'FILM_CAMERA', 'LENS', 'ACCESSORY', 'COLLECTION', 'OTHER');
CREATE TYPE "TradeInCondition" AS ENUM ('LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FOR_PARTS', 'UNKNOWN');
CREATE TYPE "TradeInPayoutMethod" AS ENUM ('CASH', 'STORE_CREDIT');
CREATE TYPE "TradeInOfferKind" AS ENUM ('INITIAL', 'REVISED');
CREATE TYPE "TradeInOfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'SUPERSEDED');
CREATE TYPE "TradeInHistoryActor" AS ENUM ('CUSTOMER', 'ADMIN', 'SYSTEM');
CREATE TABLE "TradeInSubmission" (
  "id" TEXT NOT NULL, "reference" TEXT NOT NULL, "customerId" TEXT NOT NULL,
  "status" "TradeInStatus" NOT NULL DEFAULT 'DRAFT', "itemType" "TradeInItemType",
  "brand" TEXT NOT NULL DEFAULT '', "model" TEXT NOT NULL DEFAULT '', "modelUnknown" BOOLEAN NOT NULL DEFAULT false,
  "quantity" INTEGER NOT NULL DEFAULT 1, "condition" "TradeInCondition", "powersOn" BOOLEAN,
  "functionalNotes" TEXT NOT NULL DEFAULT '', "cosmeticNotes" TEXT NOT NULL DEFAULT '',
  "includedItems" TEXT[] DEFAULT ARRAY[]::TEXT[], "additionalNotes" TEXT NOT NULL DEFAULT '',
  "payoutPreference" "TradeInPayoutMethod", "phone" TEXT NOT NULL DEFAULT '',
  "localHandoffRequested" BOOLEAN NOT NULL DEFAULT false, "shippingInstructions" TEXT NOT NULL DEFAULT '',
  "inboundCarrier" TEXT NOT NULL DEFAULT '', "inboundTracking" TEXT NOT NULL DEFAULT '',
  "adminNotes" TEXT NOT NULL DEFAULT '', "finalPayoutCents" INTEGER, "submittedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "TradeInSubmission_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "TradeInImage" (
  "id" TEXT NOT NULL, "tradeInId" TEXT NOT NULL, "cloudinaryPublicId" TEXT NOT NULL,
  "cloudinaryVersion" INTEGER NOT NULL, "format" TEXT NOT NULL, "mimeType" TEXT NOT NULL,
  "bytes" INTEGER NOT NULL, "width" INTEGER, "height" INTEGER, "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "TradeInImage_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "TradeInOffer" (
  "id" TEXT NOT NULL, "tradeInId" TEXT NOT NULL, "kind" "TradeInOfferKind" NOT NULL DEFAULT 'INITIAL',
  "status" "TradeInOfferStatus" NOT NULL DEFAULT 'PENDING', "cashCents" INTEGER NOT NULL,
  "storeCreditCents" INTEGER NOT NULL, "note" TEXT NOT NULL DEFAULT '', "expiresAt" TIMESTAMP(3),
  "respondedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "TradeInOffer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "TradeInStatusEvent" (
  "id" TEXT NOT NULL, "tradeInId" TEXT NOT NULL, "actor" "TradeInHistoryActor" NOT NULL DEFAULT 'SYSTEM',
  "status" "TradeInStatus" NOT NULL, "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "TradeInStatusEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TradeInSubmission_reference_key" ON "TradeInSubmission"("reference");
CREATE INDEX "TradeInSubmission_customerId_createdAt_idx" ON "TradeInSubmission"("customerId", "createdAt");
CREATE INDEX "TradeInSubmission_status_updatedAt_idx" ON "TradeInSubmission"("status", "updatedAt");
CREATE INDEX "TradeInSubmission_reference_idx" ON "TradeInSubmission"("reference");
CREATE INDEX "TradeInImage_tradeInId_sortOrder_idx" ON "TradeInImage"("tradeInId", "sortOrder");
CREATE INDEX "TradeInOffer_tradeInId_createdAt_idx" ON "TradeInOffer"("tradeInId", "createdAt");
CREATE INDEX "TradeInOffer_status_expiresAt_idx" ON "TradeInOffer"("status", "expiresAt");
CREATE INDEX "TradeInStatusEvent_tradeInId_createdAt_idx" ON "TradeInStatusEvent"("tradeInId", "createdAt");
ALTER TABLE "TradeInSubmission" ADD CONSTRAINT "TradeInSubmission_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeInImage" ADD CONSTRAINT "TradeInImage_tradeInId_fkey" FOREIGN KEY ("tradeInId") REFERENCES "TradeInSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeInOffer" ADD CONSTRAINT "TradeInOffer_tradeInId_fkey" FOREIGN KEY ("tradeInId") REFERENCES "TradeInSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeInStatusEvent" ADD CONSTRAINT "TradeInStatusEvent_tradeInId_fkey" FOREIGN KEY ("tradeInId") REFERENCES "TradeInSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;