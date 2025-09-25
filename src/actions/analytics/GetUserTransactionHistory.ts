"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetUserTransactionHistory() {
  const { userId } = await auth();
  if (!userId) throw new Error("Forbidden: unauthenticated");

  return prisma.userPurchase.findMany({
    where: { userId },
    orderBy: {
      date: "desc",
    },
  });
}
