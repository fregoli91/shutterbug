CREATE TABLE "CustomerProductLike" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerProductLike_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomerProductLike_customerId_productId_key" ON "CustomerProductLike"("customerId", "productId");
CREATE INDEX "CustomerProductLike_customerId_createdAt_idx" ON "CustomerProductLike"("customerId", "createdAt");
CREATE INDEX "CustomerProductLike_productId_idx" ON "CustomerProductLike"("productId");

ALTER TABLE "CustomerProductLike" ADD CONSTRAINT "CustomerProductLike_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerProductLike" ADD CONSTRAINT "CustomerProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
