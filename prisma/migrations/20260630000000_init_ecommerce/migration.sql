CREATE TYPE "ProductStatus" AS ENUM ('IN_STOCK', 'SOLD_OUT', 'COMING_SOON', 'DRAFT');
CREATE TYPE "ProductCondition" AS ENUM ('MINT', 'EXCELLENT', 'GOOD', 'FAIR', 'FOR_PARTS');
CREATE TYPE "CameraType" AS ENUM ('VINTAGE_DIGITAL', 'FILM_CAMERA', 'ACCESSORY', 'PARTS_REPAIR');
CREATE TYPE "CameraFormat" AS ENUM ('DIGITAL', 'FILM', 'ACCESSORY');
CREATE TYPE "ProductImageRole" AS ENUM ('HERO', 'GALLERY');
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL', 'MANUAL');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED');
CREATE TYPE "FulfillmentStatus" AS ENUM ('UNFULFILLED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED');

CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "sku" TEXT,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "categorySlug" TEXT NOT NULL,
  "categorySlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "cameraType" "CameraType" NOT NULL DEFAULT 'VINTAGE_DIGITAL',
  "format" "CameraFormat" NOT NULL DEFAULT 'DIGITAL',
  "condition" "ProductCondition" NOT NULL DEFAULT 'GOOD',
  "conditionSummary" TEXT NOT NULL DEFAULT '',
  "priceCents" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
  "description" TEXT NOT NULL DEFAULT '',
  "shortDescription" TEXT NOT NULL DEFAULT '',
  "seoTitle" TEXT,
  "seoDescription" TEXT NOT NULL DEFAULT '',
  "includesBattery" BOOLEAN NOT NULL DEFAULT false,
  "includesCharger" BOOLEAN NOT NULL DEFAULT false,
  "actualPhotos" BOOLEAN NOT NULL DEFAULT false,
  "partsRepair" BOOLEAN NOT NULL DEFAULT false,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "badges" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "included" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "tested" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "goodFor" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "cosmeticNotes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "functionalNotes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "flaws" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "notes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "shippingNote" TEXT NOT NULL DEFAULT '',
  "returnsNote" TEXT NOT NULL DEFAULT '',
  "checkoutUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductImage" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "alt" TEXT NOT NULL DEFAULT '',
  "role" "ProductImageRole" NOT NULL DEFAULT 'GALLERY',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "publicId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "orderNumber" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerName" TEXT,
  "shippingAddress" JSONB,
  "billingAddress" JSONB,
  "provider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
  "providerReference" TEXT,
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "fulfillmentStatus" "FulfillmentStatus" NOT NULL DEFAULT 'UNFULFILLED',
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "subtotalCents" INTEGER NOT NULL,
  "shippingCents" INTEGER NOT NULL DEFAULT 0,
  "taxCents" INTEGER NOT NULL DEFAULT 0,
  "totalCents" INTEGER NOT NULL,
  "trackingNumber" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT,
  "productSlug" TEXT NOT NULL,
  "productTitle" TEXT NOT NULL,
  "conditionLabel" TEXT NOT NULL,
  "imageUrl" TEXT,
  "quantity" INTEGER NOT NULL,
  "unitPriceCents" INTEGER NOT NULL,
  "totalPriceCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderStatusEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderStatusEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_brand_idx" ON "Product"("brand");
CREATE INDEX "Product_categorySlug_idx" ON "Product"("categorySlug");
CREATE INDEX "Product_featured_idx" ON "Product"("featured");
CREATE INDEX "ProductImage_productId_role_sortOrder_idx" ON "ProductImage"("productId", "role", "sortOrder");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Order_providerReference_key" ON "Order"("providerReference");
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");
CREATE INDEX "Order_fulfillmentStatus_idx" ON "Order"("fulfillmentStatus");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX "OrderStatusEvent_orderId_createdAt_idx" ON "OrderStatusEvent"("orderId", "createdAt");

ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OrderStatusEvent" ADD CONSTRAINT "OrderStatusEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
