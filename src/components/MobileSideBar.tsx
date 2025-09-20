"use client";

import { routes } from "@/consants/constant";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserAvailableCreditsBadge } from "./UserAvailableCreditsBadge";

export default function MobileSideBar() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-center">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-2 px-4 py-1"
            side="left"
          >
            <Logo />
            <UserAvailableCreditsBadge />
            <div className="flex flex-col gap-1">
              {""}
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
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
