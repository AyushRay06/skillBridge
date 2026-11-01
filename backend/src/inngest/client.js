import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "careerforge-ai",
  // In production, Inngest reads INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY
  // from env automatically. No need to set them here.
});
