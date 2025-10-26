"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCars() {
  try {
    const cars = await prisma.car.findMany({
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serializar os dados para evitar problemas com Decimal
    return cars.map((car) => ({
      ...car,
      rentPrice: car.rentPrice ? Number(car.rentPrice) : null,
    }));
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
    throw new Error("Erro ao buscar carros");
  }
}

export async function getCarById(id: string) {
  try {
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!car) return null;

    // Serializar os dados para evitar problemas com Decimal
    return {
      ...car,
      rentPrice: car.rentPrice ? Number(car.rentPrice) : null,
    };
  } catch (error) {
    console.error("Erro ao buscar carro:", error);
    throw new Error("Erro ao buscar carro");
  }
}

export async function createCar(data: {
  driverId?: string | null;
  brand: string;
  model: string;
  color?: string | null;
  type: "ELECTRIC" | "DIESEL" | "GPL" | "HYBRID";
  year?: number | null;
  tag?: string | null;
  image?: string | null;
  rentPrice?: number | null;
}) {
  try {
    const createData: {
      driverId?: string;
      brand: string;
      model: string;
      color?: string | null;
      type: "ELECTRIC" | "DIESEL" | "GPL" | "HYBRID";
      year?: number;
      tag?: string;
      image?: string;
      rentPrice?: number;
    } = {
      brand: data.brand,
      model: data.model,
      color: data.color,
      type: data.type,
    };

    if (data.driverId) createData.driverId = data.driverId;
    if (data.year !== null && data.year !== undefined) createData.year = data.year;
    if (data.tag) createData.tag = data.tag;
    if (data.image) createData.image = data.image;
    if (data.rentPrice !== null && data.rentPrice !== undefined) createData.rentPrice = data.rentPrice;

    const car = await prisma.car.create({
      data: createData,
    });

    revalidatePath("/manager/cars");
    return car;
  } catch (error) {
    console.error("Erro ao criar carro:", error);
    throw new Error("Erro ao criar carro");
  }
}

export async function updateCar(
  id: string,
  data: Partial<{
    driverId: string | null;
    brand: string;
    model: string;
    color?: string | null;
    type: "ELECTRIC" | "DIESEL" | "GPL" | "HYBRID";
    year: number | null;
    tag: string | null;
    image: string | null;
    rentPrice: number | string | null;
  }>,
) {
  try {
    const updateData: {
      driverId?: string | null;
      brand?: string;
      model?: string;
      color?: string | null;
      type?: "ELECTRIC" | "DIESEL" | "GPL" | "HYBRID";
      year?: number | null;
      tag?: string | null;
      image?: string | null;
      rentPrice?: number | null;
    } = {};

    // Copy all fields except rentPrice and driverId (they need special handling)
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.tag !== undefined) updateData.tag = data.tag;
    if (data.image !== undefined) updateData.image = data.image;

    // Handle rentPrice conversion
    if (data.rentPrice !== undefined) {
      updateData.rentPrice = data.rentPrice ? parseFloat(String(data.rentPrice)) : null;
    }

    // Handle driverId - allow null to unassign driver
    if (data.driverId !== undefined) {
      updateData.driverId = data.driverId;
    }

    const car = await prisma.car.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/manager/cars");
    return car;
  } catch (error) {
    console.error("Erro ao atualizar carro:", error);
    throw new Error("Erro ao atualizar carro");
  }
}

export async function deleteCar(id: string) {
  try {
    await prisma.car.delete({
      where: { id },
    });

    revalidatePath("/manager/cars");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar carro:", error);
    throw new Error("Erro ao deletar carro");
  }
}

export async function getCarsByDriver(driverId: string) {
  try {
    const cars = await prisma.car.findMany({
      where: { driverId },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serializar os dados para evitar problemas com Decimal
    return cars.map((car) => ({
      ...car,
      rentPrice: car.rentPrice ? Number(car.rentPrice) : null,
    }));
  } catch (error) {
    console.error("Erro ao buscar carros do motorista:", error);
    throw new Error("Erro ao buscar carros do motorista");
  }
}

export async function getCarsStats() {
  try {
    const [total, electric, diesel, gpl, hybrid] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { type: "ELECTRIC" } }),
      prisma.car.count({ where: { type: "DIESEL" } }),
      prisma.car.count({ where: { type: "GPL" } }),
      prisma.car.count({ where: { type: "HYBRID" } }),
    ]);

    return {
      total,
      electric,
      diesel,
      gpl,
      hybrid,
      combustion: diesel + gpl,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de carros:", error);
    throw new Error("Erro ao buscar estatísticas de carros");
  }
}
