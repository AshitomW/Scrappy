"use client";
import {
  DollarSign,
  HomeIcon,
  Layers2Icon,
  LucideCircleDollarSign,
  ShieldIcon,
} from "lucide-react";
import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  {
    href: "",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "keys",
    label: "Keys",
    icon: ShieldIcon,
  },
  {
    href: "billing",
    label: "Billing",
    icon: LucideCircleDollarSign,
  },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-1 border-seperate">
      <div className="flex items-center  gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="px-2">Active Credits: </div>
      <div className="flex flex-col p-2">
        {routes.map((route) => {
          return (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                buttonVariants({
                  variant:
                    activeRoute.href === route.href
                      ? "sidebarActiveItem"
                      : "sidebarItem",
                }),
                "mb-2" // add spacing between links
              )}
            >
              <route.icon size={20} />
              {route.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
