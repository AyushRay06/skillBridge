import { Annotation } from "@langchain/langgraph";

export const AutopilotState = Annotation.Root({
  // ── Inputs ────────────────────────────────────────────────────────────────
  scheduleId: Annotation({ reducer: (_, b) => b, default: () => "" }),
  userId: Annotation({ reducer: (_, b) => b, default: () => "" }),

  // The full JobSchedule record from DB (filters, config)
  schedule: Annotation({ reducer: (_, b) => b, default: () => ({}) }),

  // The user's master UserProfile from DB
  userProfile: Annotation({ reducer: (_, b) => b, default: () => ({}) }),

  // ── Node Outputs ──────────────────────────────────────────────────────────

  // Array of generated search query strings
  searchQueries: Annotation({ reducer: (_, b) => b, default: () => [] }),

  // Raw jobs from JSearch + Remotive (before scoring)
  rawJobs: Annotation({ reducer: (_, b) => b, default: () => [] }),

  // Jobs that passed the match score threshold, capped at maxApplications
  qualifiedJobs: Annotation({ reducer: (_, b) => b, default: () => [] }),

  // Results from the oneClickApply pipeline runs — array of applicationIds
  applicationResults: Annotation({ reducer: (_, b) => b, default: () => [] }),

  // Human-readable summary of the entire run
  report: Annotation({ reducer: (_, b) => b, default: () => "" }),

  // ── Meta ──────────────────────────────────────────────────────────────────
  errors: Annotation({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
});
