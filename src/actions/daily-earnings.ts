"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { EarningSource } from "@/zod-schema/earning-schema";
import { endOfDay, format, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getDailyEarnings() {
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

    // Buscar ganhos que não estão associados a nenhum lote (ganhos avulsos)
    const earnings = await prisma.earning.findMany({
      where: {
        batch: {
          driverId: driverProfile.id,
        },
      },
      include: {
        batch: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 100,
    });

    // Também buscar ganhos sem batch
    const unbatchedEarnings = await prisma.earning.findMany({
      where: {
        batchId: null,
      },
      include: {
        batch: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 100,
    });

    // Combinar e serializar
    const allEarnings = [...earnings, ...unbatchedEarnings];

    return allEarnings.map((earning) => ({
      ...earning,
      amount: earning.amount ? Number(earning.amount) : 0,
      batch: earning.batch
        ? {
            ...earning.batch,
            totalAmount: earning.batch.totalAmount ? Number(earning.batch.totalAmount) : 0,
          }
        : null,
    }));
  } catch (error) {
    console.error("Erro ao buscar ganhos diários:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar ganhos diários");
  }
}

export async function createDailyEarning(data: {
  date: Date;
  source: EarningSource;
  description?: string;
  amount: number;
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

    // Criar um batch para o ganho diário (representa o dia todo de trabalho)
    const dayStart = startOfDay(data.date);
    const dayEnd = endOfDay(data.date);

    const batch = await prisma.earningBatch.create({
      data: {
        driverId: driverProfile.id,
        source: data.source,
        weekStart: dayStart,
        weekEnd: dayEnd,
        totalAmount: data.amount,
        paymentDate: data.date,
        paymentType: "BANK_TRANSFER", // Padrão para ganhos diários
        referenceId: `DAILY-${format(data.date, "yyyy-MM-dd")}`,
        earnings: {
          create: {
            date: data.date,
            description: data.description || `Ganhos ${data.source} do dia`,
            amount: data.amount,
          },
        },
      },
      include: {
        earnings: true,
      },
    });

    revalidatePath("/driver/earnings");
    return batch;
  } catch (error) {
    console.error("Erro ao criar ganho diário:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function updateDailyEarning(data: {
  earningId: string;
  date?: Date;
  source?: EarningSource;
  description?: string;
  amount?: number;
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

    // Verificar se o ganho existe e pertence ao motorista (através do batch ou é unbatched)
    const earning = await prisma.earning.findUnique({
      where: { id: data.earningId },
      include: { batch: true },
    });

    if (!earning) {
      throw new Error("Ganho não encontrado");
    }

    // Se tem batch, verificar se pertence ao motorista
    if (earning.batch && earning.batch.driverId !== driverProfile.id) {
      throw new Error("Ganho não encontrado");
    }

    const updateEarningData: Record<string, unknown> = {};

    if (data.date !== undefined) updateEarningData.date = data.date;
    if (data.description !== undefined) updateEarningData.description = data.description;
    if (data.amount !== undefined) updateEarningData.amount = data.amount;

    // Atualizar o earning
    const updatedEarning = await prisma.earning.update({
      where: { id: data.earningId },
      data: updateEarningData,
    });

    // Se tem batch e precisa atualizar source ou amount, atualizar o batch também
    if (earning.batchId) {
      const updateBatchData: Record<string, unknown> = {};

      if (data.source !== undefined) updateBatchData.source = data.source;
      if (data.amount !== undefined) updateBatchData.totalAmount = data.amount;
      if (data.date !== undefined) {
        updateBatchData.weekStart = startOfDay(data.date);
        updateBatchData.weekEnd = endOfDay(data.date);
        updateBatchData.paymentDate = data.date;
        updateBatchData.referenceId = `DAILY-${format(data.date, "yyyy-MM-dd")}`;
      }

      await prisma.earningBatch.update({
        where: { id: earning.batchId },
        data: updateBatchData,
      });
    }

    revalidatePath("/driver/earnings");
    return updatedEarning;
  } catch (error) {
    console.error("Erro ao atualizar ganho diário:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function deleteDailyEarning(earningId: string) {
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

    // Verificar se o ganho existe e pertence ao motorista
    const earning = await prisma.earning.findUnique({
      where: { id: earningId },
      include: { batch: true },
    });

    if (!earning) {
      throw new Error("Ganho não encontrado");
    }

    // Se tem batch, verificar se pertence ao motorista
    if (earning.batch && earning.batch.driverId !== driverProfile.id) {
      throw new Error("Ganho não encontrado");
    }

    await prisma.earning.delete({
      where: { id: earningId },
    });

    revalidatePath("/driver/earnings");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar ganho diário:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getDailyEarningsStats() {
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

    // Buscar todos os ganhos do motorista (com e sem batch)
    const batchedEarnings = await prisma.earning.findMany({
      where: {
        batch: {
          driverId: driverProfile.id,
        },
      },
    });

    const unbatchedEarnings = await prisma.earning.findMany({
      where: {
        batchId: null,
      },
    });

    const allEarnings = [...batchedEarnings, ...unbatchedEarnings];

    const totalEarnings = allEarnings.length;
    const totalAmount = allEarnings.reduce((acc, earning) => acc + (earning.amount ? Number(earning.amount) : 0), 0);

    // Estatísticas do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyEarnings = allEarnings.filter((e) => {
      const date = new Date(e.date);
      return date >= startOfMonth && date <= endOfMonth;
    });

    const monthlyAmount = monthlyEarnings.reduce(
      (acc, earning) => acc + (earning.amount ? Number(earning.amount) : 0),
      0,
    );

    // Estatísticas da semana atual
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyEarnings = allEarnings.filter((e) => {
      const date = new Date(e.date);
      return date >= startOfWeek;
    });

    const weeklyAmount = weeklyEarnings.reduce(
      (acc, earning) => acc + (earning.amount ? Number(earning.amount) : 0),
      0,
    );

    // Ganhos de hoje
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const todayEarnings = allEarnings.filter((e) => {
      const date = new Date(e.date);
      return date >= startOfDay && date <= endOfDay;
    });

    const todayAmount = todayEarnings.reduce((acc, earning) => acc + (earning.amount ? Number(earning.amount) : 0), 0);

    return {
      totalEarnings,
      totalAmount,
      monthlyAmount,
      monthlyEarnings: monthlyEarnings.length,
      weeklyAmount,
      weeklyEarnings: weeklyEarnings.length,
      todayAmount,
      todayEarnings: todayEarnings.length,
      averagePerEarning: totalEarnings > 0 ? totalAmount / totalEarnings : 0,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar estatísticas");
  }
}
