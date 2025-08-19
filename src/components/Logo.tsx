import { cn } from "@/lib/utils";
import React from "react";

interface LogoProps {
  fontSize?: string;
  iconSize?: number;
}

export default function Logo({
  fontSize = "text-3xl",
  iconSize = 20,
}: LogoProps) {
  return (
    <div className={cn("text-3xl font-extrabold font-inter", fontSize)}>
      <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
        Scrappy
      </span>
    </div>
  );
}
