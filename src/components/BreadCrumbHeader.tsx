"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import MobileSideBar from "./MobileSideBar";

export default function BreadCrumbHeader() {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname?.split("/");
  return (
    <div className="flex items-center flex-start">
      <MobileSideBar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => {
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize" href={path}>
                    {path === "" ? "home" : path}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
