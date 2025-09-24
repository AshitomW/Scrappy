"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DeleteCredential(credentialId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Forbidden: 401, Unauthenticated");

  await prisma.credentials.delete({
    where: {
      userId,
      id: credentialId,
    },
  });

  revalidatePath("/credentials");
}
