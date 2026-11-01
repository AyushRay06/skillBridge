import { Annotation } from "@langchain/langgraph";

export const PipelineState = Annotation.Root({
  // --- Inputs ---
  jobDescription: Annotation({
    reducer: (_, b) => b,
    default: () => "",
  }),
  userProfile: Annotation({
    reducer: (_, b) => b,
    default: () => ({}),
  }),
  latexTemplate: Annotation({
    reducer: (_, b) => b,
    default: () => "",
  }),

  // --- Node Outputs ---
  parsedJob: Annotation({
    reducer: (_, b) => b,
    default: () => null,
  }),
  matchResult: Annotation({
    reducer: (_, b) => b,
    default: () => null,
  }),
  tailoredResume: Annotation({
    reducer: (_, b) => b,
    default: () => "",
  }),
  coverLetter: Annotation({
    reducer: (_, b) => b,
    default: () => "",
  }),
  coldEmail: Annotation({
    reducer: (_, b) => b,
    default: () => null,
  }),

  // --- Meta ---
  errors: Annotation({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
});
