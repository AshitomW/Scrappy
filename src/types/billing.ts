export enum PackageId {
  Small = "SMALL",
  Medium = "MEDIUM",
  Large = "LARGE",
}

export type CreditsPackage = {
  id: PackageId;
  name: string;
  label: string;
  credits: number;
  price: number;
  priceId: string;
};

export const CreditsPackage: CreditsPackage[] = [
  {
    id: PackageId.Small,
    name: "Small Package",
    label: "1,000 credits",
    credits: 1000,
    price: 2000,
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!,
  },
  {
    id: PackageId.Medium,
    name: "Medium Package",
    label: "5,500 credits",
    credits: 5500,
    price: 11000,
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!,
  },
  {
    id: PackageId.Large,
    name: "Large Package",
    label: "12,000 credits",
    credits: 12000,
    price: 24000,
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!,
  },
];

export const getCreditsPack = (id: PackageId) =>
  CreditsPackage.find((pack) => pack.id === id);
