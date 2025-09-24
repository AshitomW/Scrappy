"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) throw new Error("Invalid Form Data");

  const { userId } = await auth();
  if (!userId) throw new Error("Forbidden: 401, Unauthenticated");

  const encryptedValue = symmetricEncrypt(data.value);
  const result = await prisma.credentials.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("Failed To Create Credentials");
  }

  revalidatePath("/credentials");
}
