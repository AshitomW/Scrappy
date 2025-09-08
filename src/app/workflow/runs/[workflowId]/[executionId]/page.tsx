import GetWorkflowExecutionWithPhases from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/Topbar/topbar";
import { waitFor } from "@/lib/helpers/waitFor";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

interface Prameters {
  workflowId: string;
  executionId: string;
}

export default async function ExecutionViewerPage({
  params,
}: {
  params: Promise<Prameters>;
}) {
  const { workflowId, executionId } = await params;

  return (
    <div className="flex flex-col  h-screen w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow Execution Details"
        subtitle={`Execution Id: ${executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Not Found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />;
}
