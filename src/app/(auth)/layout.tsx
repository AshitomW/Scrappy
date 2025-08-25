import Logo from "@/components/Logo";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <Logo />
      {children}
    </div>
  );
}
