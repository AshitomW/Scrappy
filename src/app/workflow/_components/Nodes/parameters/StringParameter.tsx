"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParameterProps } from "@/types/appnode";

import React, { useEffect, useId, useState } from "react";

export default function StringParameter({
  parameter,
  value,
  updateNodeParameterValue,
}: ParameterProps) {
  const id = useId(); // generate random id
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(
    function () {
      setInternalValue(value || "");
    },
    [value]
  );

  return (
    <div className="space-y-1 p-2 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {parameter.name}
        {parameter.required && <span className="text-red-400">(Required)</span>}
      </Label>
      <Input
        id={id}
        value={internalValue}
        placeholder="Enter the value here"
        onChange={(e) => setInternalValue(e.target.value)}
        className="bg-white  text-xs placeholder:text-[12px]"
        onBlur={(e) => updateNodeParameterValue(e.target.value)}
      />
      {parameter.helperText && (
        <p className="text-muted-foreground">{parameter.helperText}</p>
      )}
    </div>
  );
}
