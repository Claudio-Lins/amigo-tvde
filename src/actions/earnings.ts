"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { EarningSource, PaymentType } from "@/zod-schema/earning-schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getCurrentDriverEarningBatches() {
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

    const batches = await prisma.earningBatch.findMany({
      where: { driverId: driverProfile.id },
      include: {
        earnings: true,
      },
      orderBy: {
        weekStart: "desc",
      },
      take: 100,
    });

    // Serializar Decimal para number
    return batches.map((batch) => ({
      ...batch,
      totalAmount: batch.totalAmount ? Number(batch.totalAmount) : 0,
      earnings: batch.earnings.map((earning) => ({
        ...earning,
        amount: earning.amount ? Number(earning.amount) : 0,
      })),
    }));
  } catch (error) {
    console.error("Erro ao buscar lotes de ganhos:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar lotes de ganhos");
  }
}

export async function createEarningBatch(data: {
  source: EarningSource;
  weekStart: Date;
  weekEnd: Date;
  totalAmount: number;
  paymentDate: Date;
  paymentType: PaymentType;
  referenceId?: string;
  earnings?: Array<{
    date: Date;
    description?: string;
    amount: number;
  }>;
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

    const batch = await prisma.earningBatch.create({
      data: {
        driverId: driverProfile.id,
        source: data.source,
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
        totalAmount: data.totalAmount,
        paymentDate: data.paymentDate,
        paymentType: data.paymentType,
        referenceId: data.referenceId,
        earnings: data.earnings
          ? {
              create: data.earnings.map((earning) => ({
                date: earning.date,
                description: earning.description,
                amount: earning.amount,
              })),
            }
          : undefined,
      },
      include: {
        earnings: true,
      },
    });

    revalidatePath("/driver/earnings");
    return batch;
  } catch (error) {
    console.error("Erro ao criar lote de ganhos:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function updateEarningBatch(data: {
  batchId: string;
  source?: EarningSource;
  weekStart?: Date;
  weekEnd?: Date;
  totalAmount?: number;
  paymentDate?: Date;
  paymentType?: PaymentType;
  referenceId?: string;
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

    // Verificar se o lote pertence ao motorista
    const batch = await prisma.earningBatch.findUnique({
      where: { id: data.batchId },
    });

    if (!batch || batch.driverId !== driverProfile.id) {
      throw new Error("Lote de ganhos não encontrado");
    }

    const updateData: Record<string, unknown> = {};

    if (data.source !== undefined) updateData.source = data.source;
    if (data.weekStart !== undefined) updateData.weekStart = data.weekStart;
    if (data.weekEnd !== undefined) updateData.weekEnd = data.weekEnd;
    if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount;
    if (data.paymentDate !== undefined) updateData.paymentDate = data.paymentDate;
    if (data.paymentType !== undefined) updateData.paymentType = data.paymentType;
    if (data.referenceId !== undefined) updateData.referenceId = data.referenceId;

    const updatedBatch = await prisma.earningBatch.update({
      where: { id: data.batchId },
      data: updateData,
      include: {
        earnings: true,
      },
    });

    revalidatePath("/driver/earnings");
    return updatedBatch;
  } catch (error) {
    console.error("Erro ao atualizar lote de ganhos:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function deleteEarningBatch(batchId: string) {
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

    // Verificar se o lote pertence ao motorista
    const batch = await prisma.earningBatch.findUnique({
      where: { id: batchId },
    });

    if (!batch || batch.driverId !== driverProfile.id) {
      throw new Error("Lote de ganhos não encontrado");
    }

    await prisma.earningBatch.delete({
      where: { id: batchId },
    });

    revalidatePath("/driver/earnings");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar lote de ganhos:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getEarningsStats() {
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

    const batches = await prisma.earningBatch.findMany({
      where: { driverId: driverProfile.id },
    });

    const totalBatches = batches.length;
    const totalAmount = batches.reduce((acc, batch) => acc + (batch.totalAmount ? Number(batch.totalAmount) : 0), 0);

    // Buscar ganhos do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyBatches = await prisma.earningBatch.findMany({
      where: {
        driverId: driverProfile.id,
        paymentDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const monthlyAmount = monthlyBatches.reduce(
      (acc, batch) => acc + (batch.totalAmount ? Number(batch.totalAmount) : 0),
      0,
    );

    // Ganhos por fonte
    const earningsBySource = batches.reduce(
      (acc, batch) => {
        const source = batch.source;
        const amount = batch.totalAmount ? Number(batch.totalAmount) : 0;
        acc[source] = (acc[source] || 0) + amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalBatches,
      totalAmount,
      monthlyAmount,
      monthlyBatches: monthlyBatches.length,
      averagePerBatch: totalBatches > 0 ? totalAmount / totalBatches : 0,
      earningsBySource,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar estatísticas");
  }
}
