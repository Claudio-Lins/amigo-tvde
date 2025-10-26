-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('ELECTRIC', 'DIESEL', 'GPL', 'HYBRID');

-- CreateEnum
CREATE TYPE "EnergyType" AS ENUM ('ELECTRIC', 'DIESEL', 'GPL', 'HYBRID');

-- CreateTable
CREATE TABLE "car" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" "CarType" NOT NULL,
    "year" INTEGER,
    "tag" TEXT,
    "image" TEXT,
    "rentPrice" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mileage" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "kmInitialDaily" INTEGER,
    "kmFinalDaily" INTEGER,
    "kmInitialWeekly" INTEGER,
    "kmFinalWeekly" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mileage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_expense" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "energy_log" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "carId" TEXT,
    "locale" TEXT NOT NULL,
    "energyType" "EnergyType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "kWhCharged" DOUBLE PRECISION,
    "pricePerKWh" DOUBLE PRECISION,
    "chargingTime" INTEGER,
    "liters" DOUBLE PRECISION,
    "pricePerLiter" DOUBLE PRECISION,
    "batteryBefore" DOUBLE PRECISION,
    "batteryAfter" DOUBLE PRECISION,
    "fuelBefore" DOUBLE PRECISION,
    "fuelAfter" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "energy_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mileage" ADD CONSTRAINT "mileage_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_expense" ADD CONSTRAINT "food_expense_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_log" ADD CONSTRAINT "energy_log_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_log" ADD CONSTRAINT "energy_log_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
