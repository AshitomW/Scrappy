"use client";

import { Workflows } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import React from "react";
import FlowEditor from "./FlowEditor";
import Topbar from "./Topbar/topbar";
import TaskMenu from "@/app/(dashboard)/workflows/_components/TaskMenu";
import {
  FlowValidationContext,
  FlowValidationContextProvider,
} from "@/components/context/FlowValidationContext";

interface Props {
  workflow: Workflows;
}
export default function Editor({ workflow }: Props) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow Editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}
