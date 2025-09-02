"use client";
import { ParameterProps } from "@/types/appnode";
import React from "react";

export default function BrowserInstanceParameter({
  parameter,
  updateNodeParameterValue,
}: ParameterProps) {
  return <p className="text-xs">{parameter.name}</p>;
}
