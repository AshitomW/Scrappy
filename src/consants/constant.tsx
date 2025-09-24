import {
  HomeIcon,
  Layers2Icon,
  LucideCircleDollarSign,
  ShieldIcon,
} from "lucide-react";

export const routes = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "/credentials",
    label: "Credentials",
    icon: ShieldIcon,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: LucideCircleDollarSign,
  },
];
