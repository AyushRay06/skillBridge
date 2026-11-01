import { StateGraph, START, END } from "@langchain/langgraph";
import { PipelineState } from "./state.js";
import {
  parseJobNode,
  scoreMatchNode,
  tailorResumeNode,
  generateCoverLetterNode,
  draftColdEmailNode,
} from "./nodes.js";

const workflow = new StateGraph(PipelineState)
  .addNode("parseJob", parseJobNode)
  .addNode("scoreMatch", scoreMatchNode)
  .addNode("tailorResume", tailorResumeNode)
  .addNode("generateCoverLetter", generateCoverLetterNode)
  .addNode("draftColdEmail", draftColdEmailNode)
  .addEdge(START, "parseJob")
  .addEdge("parseJob", "scoreMatch")
  .addEdge("scoreMatch", "tailorResume")
  .addEdge("tailorResume", "generateCoverLetter")
  .addEdge("generateCoverLetter", "draftColdEmail")
  .addEdge("draftColdEmail", END);

export const oneClickApplyGraph = workflow.compile();
