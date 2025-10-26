-- CreateEnum
CREATE TYPE "EarningSource" AS ENUM ('UBER', 'BOLT', 'TOUR', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'BANK_TRANSFER', 'MBWAY', 'OTHER');

-- CreateTable
CREATE TABLE "earning" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "source" "EarningSource" NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "earning_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "earning" ADD CONSTRAINT "earning_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
