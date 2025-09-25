"use server";

import { getAppUrl } from "@/lib/helpers/appurl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackageId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function PurchaseCredits(packId: PackageId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Forbidden: Unauthenticated");
  }

  const selectedPackage = getCreditsPack(packId);
  if (!selectedPackage) throw new Error("Invalid Package");

  const priceId = selectedPackage.priceId;

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),
    metadata: {
      userId,
      packId,
    },
    line_items: [
      {
        quantity: 1,
        price: priceId,
      },
    ],
  });

  if (!stripeSession.url) throw new Error("Cannot Create Stripe Session");

  redirect(stripeSession.url);
}
