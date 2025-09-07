import { FlowNodeMissingInputs } from "@/types/appnode";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

type FlowValidationConextType = {
  invalidInputs: FlowNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<FlowNodeMissingInputs[]>>;
  clearErrors: () => void;
};

export const FlowValidationContext =
  createContext<FlowValidationConextType | null>(null);

export function FlowValidationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [invalidInputs, setInvalidInputs] = useState<FlowNodeMissingInputs[]>(
    []
  );
  const clearErrors = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors,
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}
