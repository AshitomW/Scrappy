"use client";
import { ParameterProps } from "@/types/appnode";
import React, { useId } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type OptionType = {
  label: string;
  value: string;
};

export default function SelectParameter({
  parameter,
  updateNodeParameterValue,
  value,
}: ParameterProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {parameter.name}
        {parameter.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParameterValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {parameter.options.map((option: OptionType) => {
              return (
                <SelectItem key={option.value} value={option.label}>
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
