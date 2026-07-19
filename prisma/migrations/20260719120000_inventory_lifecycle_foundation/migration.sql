CREATE TYPE "ProductStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'SOLD_OUT', 'ARCHIVED');

ALTER TABLE "Product" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Product"
  ALTER COLUMN "status" TYPE "ProductStatus_new"
  USING (
    CASE "status"::text
      WHEN 'IN_STOCK' THEN 'ACTIVE'
      WHEN 'SOLD_OUT' THEN 'SOLD_OUT'
      WHEN 'COMING_SOON' THEN 'ARCHIVED'
      WHEN 'DRAFT' THEN 'DRAFT'
      ELSE 'DRAFT'
    END
  )::"ProductStatus_new";

ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "ProductStatus_old";

ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

CREATE TYPE "ProductCondition_new" AS ENUM ('NEW', 'OPEN_BOX', 'USED_EXCELLENT', 'USED_GOOD', 'USED_FAIR', 'FOR_PARTS');

ALTER TABLE "Product" ALTER COLUMN "condition" DROP DEFAULT;

ALTER TABLE "Product"
  ALTER COLUMN "condition" TYPE "ProductCondition_new"
  USING (
    CASE "condition"::text
      WHEN 'NEW' THEN 'NEW'
      WHEN 'OPEN_BOX' THEN 'OPEN_BOX'
      WHEN 'MINT' THEN 'USED_EXCELLENT'
      WHEN 'EXCELLENT' THEN 'USED_EXCELLENT'
      WHEN 'VERY_GOOD' THEN 'USED_EXCELLENT'
      WHEN 'GOOD' THEN 'USED_GOOD'
      WHEN 'FAIR' THEN 'USED_FAIR'
      WHEN 'HEAVILY_USED' THEN 'USED_FAIR'
      WHEN 'UNTESTED' THEN 'USED_FAIR'
      WHEN 'REFURBISHED' THEN 'USED_EXCELLENT'
      WHEN 'FOR_PARTS' THEN 'FOR_PARTS'
      ELSE 'USED_GOOD'
    END
  )::"ProductCondition_new";

ALTER TYPE "ProductCondition" RENAME TO "ProductCondition_old";
ALTER TYPE "ProductCondition_new" RENAME TO "ProductCondition";
DROP TYPE "ProductCondition_old";

ALTER TABLE "Product" ALTER COLUMN "condition" SET DEFAULT 'USED_GOOD';

ALTER TABLE "Product"
  ADD COLUMN "testedStatus" TEXT NOT NULL DEFAULT 'Tested',
  ADD COLUMN "conditionNotes" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "forPartsOrRepair" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "doesNotInclude" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "mainImageUrl" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "imageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "Product"
SET
  "testedStatus" = COALESCE(NULLIF("functionalStatus", ''), 'Tested'),
  "conditionNotes" = COALESCE(NULLIF("conditionSummary", ''), ''),
  "forPartsOrRepair" = "partsRepair",
  "mainImageUrl" = COALESCE(
    (
      SELECT "url"
      FROM "ProductImage"
      WHERE "ProductImage"."productId" = "Product"."id"
      ORDER BY
        CASE WHEN "ProductImage"."role" = 'HERO' THEN 0 ELSE 1 END,
        "sortOrder" ASC
      LIMIT 1
    ),
    ''
  ),
  "imageUrls" = COALESCE(
    (
      SELECT ARRAY_AGG("url" ORDER BY "sortOrder" ASC)
      FROM "ProductImage"
      WHERE "ProductImage"."productId" = "Product"."id"
        AND "ProductImage"."role" <> 'HERO'
    ),
    ARRAY[]::TEXT[]
  );
