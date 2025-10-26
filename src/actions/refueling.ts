"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getCurrentDriverRefuelings() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        cars: {
          select: {
            id: true,
            brand: true,
            model: true,
            type: true,
          },
        },
      },
    });

    if (!driverProfile) {
      throw new Error("Perfil de motorista não encontrado");
    }

    const refuelings = await prisma.energyLog.findMany({
      where: { driverId: driverProfile.id },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            type: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 50,
    });

    // Serializar Decimal para number
    return refuelings.map((refueling) => ({
      ...refueling,
      totalCost: refueling.totalCost ? Number(refueling.totalCost) : 0,
      pricePerKWh: refueling.pricePerKWh ? Number(refueling.pricePerKWh) : null,
      pricePerLiter: refueling.pricePerLiter ? Number(refueling.pricePerLiter) : null,
    }));
  } catch (error) {
    console.error("Erro ao buscar abastecimentos:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar abastecimentos");
  }
}

export async function createRefueling(data: {
  carId: string;
  locale: string;
  energyType: "ELECTRIC" | "DIESEL" | "GPL" | "HYBRID";
  timestamp: Date;
  totalCost: number;
  paymentMethod?: string | null;
  kWhCharged?: number | null;
  pricePerKWh?: number | null;
  chargingTime?: number | null;
  liters?: number | null;
  pricePerLiter?: number | null;
  batteryBefore?: number | null;
  batteryAfter?: number | null;
  fuelBefore?: number | null;
  fuelAfter?: number | null;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!driverProfile) {
      throw new Error("Perfil de motorista não encontrado");
    }

    const refueling = await prisma.energyLog.create({
      data: {
        driverId: driverProfile.id,
        carId: data.carId,
        locale: data.locale,
        energyType: data.energyType,
        timestamp: data.timestamp,
        totalCost: data.totalCost,
        paymentMethod: data.paymentMethod,
        kWhCharged: data.kWhCharged,
        pricePerKWh: data.pricePerKWh,
        chargingTime: data.chargingTime,
        liters: data.liters,
        pricePerLiter: data.pricePerLiter,
        batteryBefore: data.batteryBefore,
        batteryAfter: data.batteryAfter,
        fuelBefore: data.fuelBefore,
        fuelAfter: data.fuelAfter,
      },
    });

    revalidatePath("/driver/refueling");
    return refueling;
  } catch (error) {
    console.error("Erro ao criar abastecimento:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function updateRefueling(data: {
  refuelingId: string;
  carId?: string;
  locale?: string;
  energyType?: "ELECTRIC" | "DIESEL" | "GPL" | "HYBRID";
  timestamp?: Date;
  totalCost?: number;
  paymentMethod?: string | null;
  kWhCharged?: number | null;
  pricePerKWh?: number | null;
  chargingTime?: number | null;
  liters?: number | null;
  pricePerLiter?: number | null;
  batteryBefore?: number | null;
  batteryAfter?: number | null;
  fuelBefore?: number | null;
  fuelAfter?: number | null;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!driverProfile) {
      throw new Error("Perfil de motorista não encontrado");
    }

    // Verificar se o registro pertence ao motorista
    const refueling = await prisma.energyLog.findUnique({
      where: { id: data.refuelingId },
    });

    if (!refueling || refueling.driverId !== driverProfile.id) {
      throw new Error("Registro de abastecimento não encontrado");
    }

    const updateData: Record<string, unknown> = {};

    if (data.carId !== undefined) updateData.carId = data.carId;
    if (data.locale !== undefined) updateData.locale = data.locale;
    if (data.energyType !== undefined) updateData.energyType = data.energyType;
    if (data.timestamp !== undefined) updateData.timestamp = data.timestamp;
    if (data.totalCost !== undefined) updateData.totalCost = data.totalCost;
    if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
    if (data.kWhCharged !== undefined) updateData.kWhCharged = data.kWhCharged;
    if (data.pricePerKWh !== undefined) updateData.pricePerKWh = data.pricePerKWh;
    if (data.chargingTime !== undefined) updateData.chargingTime = data.chargingTime;
    if (data.liters !== undefined) updateData.liters = data.liters;
    if (data.pricePerLiter !== undefined) updateData.pricePerLiter = data.pricePerLiter;
    if (data.batteryBefore !== undefined) updateData.batteryBefore = data.batteryBefore;
    if (data.batteryAfter !== undefined) updateData.batteryAfter = data.batteryAfter;
    if (data.fuelBefore !== undefined) updateData.fuelBefore = data.fuelBefore;
    if (data.fuelAfter !== undefined) updateData.fuelAfter = data.fuelAfter;

    const updatedRefueling = await prisma.energyLog.update({
      where: { id: data.refuelingId },
      data: updateData,
    });

    revalidatePath("/driver/refueling");
    return updatedRefueling;
  } catch (error) {
    console.error("Erro ao atualizar abastecimento:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function deleteRefueling(refuelingId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!driverProfile) {
      throw new Error("Perfil de motorista não encontrado");
    }

    // Verificar se o registro pertence ao motorista
    const refueling = await prisma.energyLog.findUnique({
      where: { id: refuelingId },
    });

    if (!refueling || refueling.driverId !== driverProfile.id) {
      throw new Error("Registro de abastecimento não encontrado");
    }

    await prisma.energyLog.delete({
      where: { id: refuelingId },
    });

    revalidatePath("/driver/refueling");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar abastecimento:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getRefuelingStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!driverProfile) {
      throw new Error("Perfil de motorista não encontrado");
    }

    const refuelings = await prisma.energyLog.findMany({
      where: { driverId: driverProfile.id },
    });

    const totalRecords = refuelings.length;
    let totalCost = 0;
    let totalLiters = 0;
    let totalKWh = 0;

    refuelings.forEach((r) => {
      totalCost += r.totalCost ? Number(r.totalCost) : 0;
      totalLiters += r.liters || 0;
      totalKWh += r.kWhCharged || 0;
    });

    // Buscar registros do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyRefuelings = await prisma.energyLog.findMany({
      where: {
        driverId: driverProfile.id,
        timestamp: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const monthlyCost = monthlyRefuelings.reduce((acc, r) => acc + (r.totalCost ? Number(r.totalCost) : 0), 0);

    // Contar por tipo
    const byType = {
      electric: refuelings.filter((r) => r.energyType === "ELECTRIC").length,
      diesel: refuelings.filter((r) => r.energyType === "DIESEL").length,
      gpl: refuelings.filter((r) => r.energyType === "GPL").length,
      hybrid: refuelings.filter((r) => r.energyType === "HYBRID").length,
    };

    return {
      totalRecords,
      totalCost,
      totalLiters,
      totalKWh,
      monthlyCost,
      monthlyRecords: monthlyRefuelings.length,
      byType,
      averageCost: totalRecords > 0 ? totalCost / totalRecords : 0,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar estatísticas");
  }
}

export async function getDriverCars() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        cars: {
          select: {
            id: true,
            brand: true,
            model: true,
            type: true,
            tag: true,
          },
        },
      },
    });

    if (!driverProfile) {
      throw new Error("Perfil de motorista não encontrado");
    }

    return driverProfile.cars;
  } catch (error) {
    console.error("Erro ao buscar carros:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar carros");
  }
}
