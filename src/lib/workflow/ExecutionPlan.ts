import { FlowNode, FlowNodeMissingInputs } from "@/types/appnode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRepository } from "./tasks/Repository";

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRYPOINT",
  "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: FlowNodeMissingInputs[];
  };
};

export function FlowToExecutionPlan(
  nodes: FlowNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  // find the entry point;

  const entryPoint = nodes.find(
    (node) => TaskRepository[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRYPOINT,
      },
    };
  }

  // Execution Plan Generation
  const planned = new Set<string>();
  const inputWithErrors: FlowNodeMissingInputs[] = [];

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const node of nodes) {
      if (planned.has(node.id)) continue; // node already in the plan

      const invalidInputs = getInvalidInputs(node, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(node, nodes, edges);

        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // if all incoming incomers/edges are planned and there are still invalid inputs
          // this means that this particular node has an invalid input
          // workflow is invalid
          console.error("Invalid Inputs:", node.id, invalidInputs);
          inputWithErrors.push({
            nodeId: node.id,
            inputs: invalidInputs,
          });
        } else continue;
      }

      nextPhase.nodes.push(node);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputWithErrors,
      },
    };
  }

  return { executionPlan };
}

function getInvalidInputs(node: FlowNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRepository[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;

    if (inputValueProvided) continue;

    // check if the value is not provided by the user, we need to check if there is an output linked to the current input;

    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputEdgedByOutput = incomingEdges.find(
      (edge) => edge.targetHandle == input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputEdgedByOutput &&
      planned.has(inputEdgedByOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      continue;
    } else if (!input.required) {
      // if the input is not requred but there is an output linked to it
      // we need to be sure that the output is already planned

      if (!inputEdgedByOutput) continue;
      if (inputEdgedByOutput && planned.has(inputEdgedByOutput.source)) {
        // the output is providing a value to the input: the input is valid
        continue;
      }
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

function getIncomers(node: FlowNode, nodes: FlowNode[], edges: Edge[]) {
  if (!node.id) return [];

  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) incomersIds.add(edge.source);
  });

  return nodes.filter((n) => incomersIds.has(n.id));
}
