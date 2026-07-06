ALTER TABLE "Customer" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

CREATE TABLE "CustomerEmailVerificationToken" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerEmailVerificationToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomerEmailVerificationToken_tokenHash_key" ON "CustomerEmailVerificationToken"("tokenHash");
CREATE INDEX "CustomerEmailVerificationToken_customerId_idx" ON "CustomerEmailVerificationToken"("customerId");
CREATE INDEX "CustomerEmailVerificationToken_expiresAt_idx" ON "CustomerEmailVerificationToken"("expiresAt");

ALTER TABLE "CustomerEmailVerificationToken" ADD CONSTRAINT "CustomerEmailVerificationToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
