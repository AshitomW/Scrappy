import { FlowNode } from "@/types/appnode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRepository } from "./tasks/Repository";
import next from "next";

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
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
    throw new Error("Not a valid entry point!------TODO-----");
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  // Execution Plan Generation
  const planned = new Set<string>();
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
          throw new Error("Handle Error----Todo");
        } else continue;
      }

      nextPhase.nodes.push(node);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
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
