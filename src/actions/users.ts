"use server";

import { prisma } from "@/lib/prisma";

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
