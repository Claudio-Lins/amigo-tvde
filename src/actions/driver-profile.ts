"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getCurrentDriverProfile() {
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
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
          },
        },
        cars: {
          select: {
            id: true,
            brand: true,
            model: true,
            type: true,
            year: true,
            tag: true,
            image: true,
          },
        },
        _count: {
          select: {
            cars: true,
            mileage: true,
            foodExpenses: true,
            energyLogs: true,
          },
        },
      },
    });

    return driverProfile;
  } catch (error) {
    console.error("Erro ao buscar perfil do motorista:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao buscar perfil do motorista");
  }
}

export async function updateCurrentDriverProfile(data: {
  firstName?: string;
  lastName?: string;
  birthday?: Date | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  nationality?: string | null;
  photo?: string | null;
  bankName?: string | null;
  iban?: string | null;
  accountNumber?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  district?: string | null;
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

    const updateData: {
      firstName?: string;
      lastName?: string;
      birthday?: Date | null;
      gender?: "MALE" | "FEMALE" | "OTHER" | null;
      nationality?: string | null;
      photo?: string | null;
      bankName?: string | null;
      iban?: string | null;
      accountNumber?: string | null;
      street?: string | null;
      number?: string | null;
      complement?: string | null;
      neighborhood?: string | null;
      city?: string | null;
      district?: string | null;
    } = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.birthday !== undefined) updateData.birthday = data.birthday;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.nationality !== undefined) updateData.nationality = data.nationality;
    if (data.photo !== undefined) updateData.photo = data.photo;
    if (data.bankName !== undefined) updateData.bankName = data.bankName;
    if (data.iban !== undefined) updateData.iban = data.iban;
    if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber;
    if (data.street !== undefined) updateData.street = data.street;
    if (data.number !== undefined) updateData.number = data.number;
    if (data.complement !== undefined) updateData.complement = data.complement;
    if (data.neighborhood !== undefined) updateData.neighborhood = data.neighborhood;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.district !== undefined) updateData.district = data.district;

    const updatedProfile = await prisma.driverProfile.update({
      where: { id: driverProfile.id },
      data: updateData,
    });

    revalidatePath("/driver/driver-profile");
    return updatedProfile;
  } catch (error) {
    console.error("Erro ao atualizar perfil do motorista:", JSON.stringify(error, null, 2));
    throw new Error("Erro ao atualizar perfil do motorista");
  }
}
