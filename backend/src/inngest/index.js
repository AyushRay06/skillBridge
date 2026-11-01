// Export all Inngest functions here.
// The serve handler in index.js imports this array.

import { jobAutopilotFunction, autopilotCronFunction } from "./functions/jobAutopilot.js";

export const inngestFunctions = [jobAutopilotFunction, autopilotCronFunction];
