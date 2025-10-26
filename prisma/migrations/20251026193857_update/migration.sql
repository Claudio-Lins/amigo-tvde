/*
  Warnings:

  - You are about to drop the column `createdAt` on the `earning` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `earning` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `earning` table. All the data in the column will be lost.
  - You are about to drop the column `referenceId` on the `earning` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `earning` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `earning` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."earning" DROP CONSTRAINT "earning_driverId_fkey";

-- AlterTable
ALTER TABLE "earning" DROP COLUMN "createdAt",
DROP COLUMN "driverId",
DROP COLUMN "paymentType",
DROP COLUMN "referenceId",
DROP COLUMN "source",
DROP COLUMN "updatedAt",
ADD COLUMN     "batchId" TEXT;

-- CreateTable
CREATE TABLE "earning_batch" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "source" "EarningSource" NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "earning_batch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "earning" ADD CONSTRAINT "earning_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "earning_batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
