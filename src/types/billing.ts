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
};

export const CreditsPackage: CreditsPackage[] = [
  {
    id: PackageId.Small,
    name: "Small Package",
    label: "1,000 credits",
    credits: 1000,
    price: 2000,
  },
  {
    id: PackageId.Medium,
    name: "Medium Package",
    label: "5,500 credits",
    credits: 5500,
    price: 11000,
  },
  {
    id: PackageId.Large,
    name: "Large Package",
    label: "12,000 credits",
    credits: 12000,
    price: 24000,
  },
];

export const getCreditsPack = (id: PackageId) =>
  CreditsPackage.find((pack) => pack.id === id);
