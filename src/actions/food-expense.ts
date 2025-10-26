"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getCurrentDriverFoodExpenses() {
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

    const foodExpenses = await prisma.foodExpense.findMany({
      where: { driverId: driverProfile.id },
      orderBy: {
        date: "desc",
      },
      take: 100,
    });

    // Serializar Decimal para number
    return foodExpenses.map((expense) => ({
      ...expense,
      amount: expense.amount ? Number(expense.amount) : 0,
    }));
  } catch (error) {
    console.error("Erro ao buscar despesas com alimentação:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar despesas com alimentação");
  }
}

export async function createFoodExpense(data: { locale: string; date: Date; amount: number }) {
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

    const foodExpense = await prisma.foodExpense.create({
      data: {
        driverId: driverProfile.id,
        locale: data.locale,
        date: data.date,
        amount: data.amount,
      },
    });

    revalidatePath("/driver/food");
    return foodExpense;
  } catch (error) {
    console.error("Erro ao criar despesa:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function updateFoodExpense(data: { expenseId: string; locale?: string; date?: Date; amount?: number }) {
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
    const expense = await prisma.foodExpense.findUnique({
      where: { id: data.expenseId },
    });

    if (!expense || expense.driverId !== driverProfile.id) {
      throw new Error("Despesa não encontrada");
    }

    const updateData: Record<string, unknown> = {};

    if (data.locale !== undefined) updateData.locale = data.locale;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.amount !== undefined) updateData.amount = data.amount;

    const updatedExpense = await prisma.foodExpense.update({
      where: { id: data.expenseId },
      data: updateData,
    });

    revalidatePath("/driver/food");
    return updatedExpense;
  } catch (error) {
    console.error("Erro ao atualizar despesa:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function deleteFoodExpense(expenseId: string) {
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
    const expense = await prisma.foodExpense.findUnique({
      where: { id: expenseId },
    });

    if (!expense || expense.driverId !== driverProfile.id) {
      throw new Error("Despesa não encontrada");
    }

    await prisma.foodExpense.delete({
      where: { id: expenseId },
    });

    revalidatePath("/driver/food");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar despesa:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getFoodExpenseStats() {
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

    const expenses = await prisma.foodExpense.findMany({
      where: { driverId: driverProfile.id },
    });

    const totalRecords = expenses.length;
    const totalAmount = expenses.reduce((acc, expense) => acc + (expense.amount ? Number(expense.amount) : 0), 0);

    // Buscar registros do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyExpenses = await prisma.foodExpense.findMany({
      where: {
        driverId: driverProfile.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const monthlyAmount = monthlyExpenses.reduce(
      (acc, expense) => acc + (expense.amount ? Number(expense.amount) : 0),
      0,
    );

    // Buscar registros da semana atual
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyExpenses = await prisma.foodExpense.findMany({
      where: {
        driverId: driverProfile.id,
        date: {
          gte: startOfWeek,
        },
      },
    });

    const weeklyAmount = weeklyExpenses.reduce(
      (acc, expense) => acc + (expense.amount ? Number(expense.amount) : 0),
      0,
    );

    return {
      totalRecords,
      totalAmount,
      monthlyAmount,
      monthlyRecords: monthlyExpenses.length,
      weeklyAmount,
      weeklyRecords: weeklyExpenses.length,
      averageAmount: totalRecords > 0 ? totalAmount / totalRecords : 0,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar estatísticas");
  }
}
