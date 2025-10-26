"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getCurrentDriverMileages() {
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

    const mileages = await prisma.mileage.findMany({
      where: { driverId: driverProfile.id },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return mileages;
  } catch (error) {
    console.error("Erro ao buscar quilometragens:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar quilometragens");
  }
}

export async function getActiveMileage() {
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

    // Buscar turno ativo (com km inicial mas sem km final)
    const activeMileage = await prisma.mileage.findFirst({
      where: {
        driverId: driverProfile.id,
        kmInitialDaily: { not: null },
        kmFinalDaily: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return activeMileage;
  } catch (error) {
    console.error("Erro ao buscar turno ativo:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar turno ativo");
  }
}

export async function startMileage(data: { kmInitialDaily: number; kmInitialWeekly?: number | null }) {
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

    // Verificar se já existe turno ativo
    const activeMileage = await prisma.mileage.findFirst({
      where: {
        driverId: driverProfile.id,
        kmInitialDaily: { not: null },
        kmFinalDaily: null,
      },
    });

    if (activeMileage) {
      throw new Error("Já existe um turno ativo. Finalize-o antes de iniciar um novo.");
    }

    const mileage = await prisma.mileage.create({
      data: {
        driverId: driverProfile.id,
        kmInitialDaily: data.kmInitialDaily,
        kmInitialWeekly: data.kmInitialWeekly,
      },
    });

    revalidatePath("/driver/mileage");
    return mileage;
  } catch (error) {
    console.error("Erro ao iniciar turno:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function finishMileage(data: { mileageId: string; kmFinalDaily: number; kmFinalWeekly?: number | null }) {
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
    const mileage = await prisma.mileage.findUnique({
      where: { id: data.mileageId },
    });

    if (!mileage || mileage.driverId !== driverProfile.id) {
      throw new Error("Registro de quilometragem não encontrado");
    }

    // Validar que km final é maior que km inicial
    if (mileage.kmInitialDaily && data.kmFinalDaily <= mileage.kmInitialDaily) {
      throw new Error("Quilometragem final deve ser maior que a inicial");
    }

    const updatedMileage = await prisma.mileage.update({
      where: { id: data.mileageId },
      data: {
        kmFinalDaily: data.kmFinalDaily,
        kmFinalWeekly: data.kmFinalWeekly,
      },
    });

    revalidatePath("/driver/mileage");
    return updatedMileage;
  } catch (error) {
    console.error("Erro ao finalizar turno:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getMileageStats() {
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

    const mileages = await prisma.mileage.findMany({
      where: {
        driverId: driverProfile.id,
        kmFinalDaily: { not: null },
      },
    });

    const totalRecords = mileages.length;
    let totalKm = 0;
    let averageKm = 0;

    if (totalRecords > 0) {
      totalKm = mileages.reduce((acc, m) => {
        if (m.kmInitialDaily && m.kmFinalDaily) {
          return acc + (m.kmFinalDaily - m.kmInitialDaily);
        }
        return acc;
      }, 0);

      averageKm = Math.round(totalKm / totalRecords);
    }

    // Buscar registros do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyMileages = await prisma.mileage.findMany({
      where: {
        driverId: driverProfile.id,
        kmFinalDaily: { not: null },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const monthlyKm = monthlyMileages.reduce((acc, m) => {
      if (m.kmInitialDaily && m.kmFinalDaily) {
        return acc + (m.kmFinalDaily - m.kmInitialDaily);
      }
      return acc;
    }, 0);

    return {
      totalRecords,
      totalKm,
      averageKm,
      monthlyKm,
      monthlyRecords: monthlyMileages.length,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar estatísticas");
  }
}
