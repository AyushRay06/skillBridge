import { StateGraph, START, END } from "@langchain/langgraph";
import { AutopilotState } from "./state.js";
import {
  buildSearchQueryNode,
  searchJobsNode,
  filterAndRankNode,
  batchApplyNode,
  generateReportNode,
} from "./nodes.js";

const workflow = new StateGraph(AutopilotState)
  .addNode("buildSearchQuery", buildSearchQueryNode)
  .addNode("searchJobs", searchJobsNode)
  .addNode("filterAndRank", filterAndRankNode)
  .addNode("batchApply", batchApplyNode)
  .addNode("generateReport", generateReportNode)
  .addEdge(START, "buildSearchQuery")
  .addEdge("buildSearchQuery", "searchJobs")
  .addEdge("searchJobs", "filterAndRank")
  .addEdge("filterAndRank", "batchApply")
  .addEdge("batchApply", "generateReport")
  .addEdge("generateReport", END);

export const autopilotGraph = workflow.compile();
