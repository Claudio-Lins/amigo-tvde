"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDriverProfiles() {
  try {
    const drivers = await prisma.driverProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        cars: {
          select: {
            id: true,
            brand: true,
            model: true,
            type: true,
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
      orderBy: {
        firstName: "asc",
      },
    });
    return drivers;
  } catch (error) {
    console.error("Erro ao buscar motoristas:", error);
    throw new Error("Erro ao buscar motoristas");
  }
}

export async function getDriverProfileById(id: string) {
  try {
    const driver = await prisma.driverProfile.findUnique({
      where: { id },
      include: {
        user: true,
        cars: true,
      },
    });

    if (!driver) return null;

    // Serializar os dados para evitar problemas com Decimal
    return {
      ...driver,
      cars: driver.cars.map((car) => ({
        ...car,
        rentPrice: car.rentPrice ? Number(car.rentPrice) : null,
      })),
    };
  } catch (error) {
    console.error("Erro ao buscar motorista:", error);
    throw new Error("Erro ao buscar motorista");
  }
}

export async function updateDriverProfile(
  id: string,
  data: Partial<{
    firstName: string;
    lastName: string;
    birthday: Date | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    nationality: string | null;
    photo: string | null;
    bankName: string | null;
    iban: string | null;
    accountNumber: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string | null;
    district: string | null;
  }>,
) {
  try {
    const driver = await prisma.driverProfile.update({
      where: { id },
      data,
    });

    revalidatePath("/manager/drivers");
    return driver;
  } catch (error) {
    console.error("Erro ao atualizar motorista:", error);
    throw new Error("Erro ao atualizar motorista");
  }
}

export async function deleteDriverProfile(id: string) {
  try {
    await prisma.driverProfile.delete({
      where: { id },
    });

    revalidatePath("/manager/drivers");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar motorista:", error);
    throw new Error("Erro ao deletar motorista");
  }
}

export async function getDriverStats() {
  try {
    const [total, withCars, withoutCars] = await Promise.all([
      prisma.driverProfile.count(),
      prisma.driverProfile.count({
        where: {
          cars: {
            some: {},
          },
        },
      }),
      prisma.driverProfile.count({
        where: {
          cars: {
            none: {},
          },
        },
      }),
    ]);

    return {
      total,
      withCars,
      withoutCars,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de motoristas:", error);
    throw new Error("Erro ao buscar estatísticas de motoristas");
  }
}

export async function getUsersWithoutDriverProfile() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "DRIVER",
        driverProfile: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários sem perfil de motorista:", error);
    throw new Error("Erro ao buscar usuários sem perfil de motorista");
  }
}

export async function createDriverProfile(data: {
  userId: string;
  firstName: string;
  lastName: string;
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
    const createData: {
      userId: string;
      firstName: string;
      lastName: string;
      birthday?: Date;
      gender?: "MALE" | "FEMALE" | "OTHER";
      nationality?: string;
      photo?: string;
      bankName?: string;
      iban?: string;
      accountNumber?: string;
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      district?: string;
    } = {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    if (data.birthday) createData.birthday = data.birthday;
    if (data.gender) createData.gender = data.gender;
    if (data.nationality) createData.nationality = data.nationality;
    if (data.photo) createData.photo = data.photo;
    if (data.bankName) createData.bankName = data.bankName;
    if (data.iban) createData.iban = data.iban;
    if (data.accountNumber) createData.accountNumber = data.accountNumber;
    if (data.street) createData.street = data.street;
    if (data.number) createData.number = data.number;
    if (data.complement) createData.complement = data.complement;
    if (data.neighborhood) createData.neighborhood = data.neighborhood;
    if (data.city) createData.city = data.city;
    if (data.district) createData.district = data.district;

    const driverProfile = await prisma.driverProfile.create({
      data: createData,
    });

    revalidatePath("/manager/drivers");
    return driverProfile;
  } catch (error) {
    console.error("Erro ao criar perfil de motorista:", error);
    throw new Error("Erro ao criar perfil de motorista");
  }
}
