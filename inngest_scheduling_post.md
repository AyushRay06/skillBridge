# Running AI Agents While You Sleep: Background Scheduling with Inngest

Building an AI agent that can autonomously search for jobs, score them, and apply on your behalf is a massive engineering challenge. But perhaps an even bigger challenge is **when and how** that agent runs. 

The Job Autopilot in CareerCrew AI isn't triggered by a user clicking a button. It needs to run on a schedule, entirely in the background, without any human intervention. Here is how I solved the background scheduling problem for AI agents using **Inngest**.

## The Problem with Serverless AI Agents

CareerCrew AI's backend is hosted on Vercel Serverless Functions. Serverless is amazing for scalability and cost, but it has a fundamental constraint: **execution timeouts**. 

A single run of the Autopilot pipeline involves:
1. Fetching user preferences from PostgreSQL.
2. Hitting multiple external job APIs (RapidAPI, Remotive).
3. Making dozens of LLM calls to parse, score, and filter job descriptions.
4. Generating LaTeX resumes and drafting cold emails for qualifying jobs.

This process takes *minutes*. Vercel free tier kills functions after 10 seconds; Pro kills them after 60 seconds (or 300s with config). You simply cannot run a long-lived AI agent directly inside a standard serverless request.

Furthermore, traditional `setInterval` or `node-cron` solutions don't work in a serverless environment because the server spins down when not in use. You need an external trigger.

## Enter Inngest: Event-Driven Background Jobs

To solve the timeout and scheduling problems simultaneously, I integrated **Inngest**. 

Inngest acts as the orchestration layer for the entire backend. Instead of the Vercel API doing the heavy lifting, it just receives an event, and Inngest handles the execution in the background, bypassing standard HTTP timeout limits and providing built-in retries.

### The Polling Mechanism

Instead of dynamically registering a new cron job every time a user creates an autopilot schedule (which is a nightmare to manage), I use a single **Cron Poller** pattern.

I set up an Inngest function that runs every 15 minutes:
```javascript
export const autopilotPoller = inngest.createFunction(
  { id: "autopilot-cron-poller" },
  { cron: "*/15 * * * *" }, // Runs every 15 minutes
  async ({ step }) => {
    // ...
  }
);
```

When this cron triggers, it executes a series of defined `step.run()` blocks:
1. **Load Data**: It queries PostgreSQL for all `JobSchedule` records that are active and due to run based on their individual timezone and frequency settings.
2. **Fan-Out**: For every schedule that is due, it doesn't process them synchronously. Instead, it fires off a new, separate event: `autopilot/run.requested`.

### The Worker Function

The actual AI orchestration is handled by a separate Inngest worker function that listens for that `autopilot/run.requested` event. 

```javascript
export const runAutopilotAgent = inngest.createFunction(
  { 
    id: "run-autopilot-pipeline",
    concurrency: { limit: 2 } // Prevent blowing up API limits
  },
  { event: "autopilot/run.requested" },
  async ({ event, step }) => {
    const { scheduleId, userId } = event.data;
    
    // Step 1: Initialize LangGraph state
    // Step 2: Run the LangGraph Autopilot pipeline
    // Step 3: Update database records with the results
  }
);
```

### Why This Architecture Wins

1. **Surviving Timeouts**: Because Inngest executes the code via durable steps, the execution can take as long as it needs. If an LLM call takes 45 seconds, the function yields and resumes seamlessly.
2. **Concurrency Control**: AI APIs (like Gemini) have rate limits. By setting `concurrency: { limit: 2 }` in Inngest, I guarantee that no matter how many users' schedules trigger at 9:00 AM, the system will only process two agent pipelines at a time, protecting my API quotas.
3. **Automatic Retries**: External job APIs are notorious for throwing 500 errors or timing out. If the `searchJobs` node fails, Inngest catches the error and automatically retries the function with exponential backoff. No extra code required.
4. **Manual Triggers**: Because the worker listens to an event, I could easily add a "Test Run" button to the frontend. Clicking it just fires an `autopilot/run.requested` event directly, reusing the exact same worker logic as the cron job.

## Conclusion

Orchestrating AI agents is only half the battle; the other half is running them reliably. By decoupling the trigger mechanism from the execution logic using Inngest, CareerCrew AI can reliably wake up, spin up multiple LangGraph agents, and apply to jobs for hundreds of users simultaneously, entirely in the background.
