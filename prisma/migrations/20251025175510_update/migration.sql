/*
  Warnings:

  - The `gender` column on the `driver_profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `totalCost` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `kWhCharged` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `pricePerKWh` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `liters` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `pricePerLiter` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `batteryBefore` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `batteryAfter` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `fuelBefore` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `fuelAfter` on the `energy_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "driver_profile" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "energy_log" ALTER COLUMN "totalCost" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "kWhCharged" SET DATA TYPE INTEGER,
ALTER COLUMN "pricePerKWh" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "liters" SET DATA TYPE INTEGER,
ALTER COLUMN "pricePerLiter" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "batteryBefore" SET DATA TYPE INTEGER,
ALTER COLUMN "batteryAfter" SET DATA TYPE INTEGER,
ALTER COLUMN "fuelBefore" SET DATA TYPE INTEGER,
ALTER COLUMN "fuelAfter" SET DATA TYPE INTEGER;
