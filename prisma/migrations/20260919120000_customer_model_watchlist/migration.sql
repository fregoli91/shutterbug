CREATE TABLE "CustomerModelWatch" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "categorySlug" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CustomerModelWatch_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomerModelWatch_customerId_key_key" ON "CustomerModelWatch"("customerId", "key");
CREATE INDEX "CustomerModelWatch_customerId_createdAt_idx" ON "CustomerModelWatch"("customerId", "createdAt");
CREATE INDEX "CustomerModelWatch_key_idx" ON "CustomerModelWatch"("key");

ALTER TABLE "CustomerModelWatch"
ADD CONSTRAINT "CustomerModelWatch_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;