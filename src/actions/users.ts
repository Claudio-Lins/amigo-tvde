"use server";

import type { User, UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers(skip?: number, take?: number) {
  const users = await prisma.user.findMany({
    skip,
    take,
  });
  return users;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

export async function createUser(user: User) {
  const newUser = await prisma.user.create({
    data: user,
  });
  return newUser;
}

export async function updateUser(id: string, user: User) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: user,
  });
  return updatedUser;
}

export async function updateUserRole(id: string, role: UserRole) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: role as UserRole },
  });
  revalidatePath("/admin/users");
  return updatedUser;
}
