# Educational Social Media Posts: AI CareerCrew AI

This document contains 3 distinct social media posts tailored for **LinkedIn** (detailed, storytelling, system-design focused) and **X/Twitter** (punchy, thread format, high engagement). Each post focuses on a specific engineering problem solved in the project, providing direct value and actionable lessons to the reader.

---

## Post 1: Moving Beyond Linear Prompts: Stateful Multi-Agent Orchestration with LangGraph

### Focus
Why single-prompt LLM calls fail for complex multi-step workflows, and how to use LangGraph (DAG) to chain specialized agents with structured inputs/outputs.

---

### 💼 LinkedIn Version

**Title: Stop using giant single prompts for complex LLM workflows. Here is a better way.** 👇

When I started building my **AI CareerCrew AI**, my first impulse was simple:
Write a massive system prompt, paste the user's resume, paste the target job description, and ask the LLM to do everything:
1. Parse the job description.
2. Score the candidate's alignment.
3. Output a tailored LaTeX resume.
4. Write a cover letter.
5. Draft a cold outreach email.

**The result?** A complete mess. Hallucinated LaTeX tags, generic cover letters, skipped instructions, and massive latency.

**The fix:** Stateful Multi-Agent Orchestration using **LangGraph**.

Instead of a single linear execution, I decomposed the application process into a **5-node Directed Acyclic Graph (DAG)**. Each node is a specialized worker with a single responsibility:

1️⃣ `parseJob` (Gemini Flash) — Extracts structured job requirements (keywords, skills, responsibilities) validated via a Zod schema.
2️⃣ `scoreMatch` (Gemini Flash) — Compares candidate skills against job requirements to produce a 0-100 score + detailed gap analysis.
3️⃣ `tailorResume` (Gemini Pro) — Tailors the LaTeX resume by injecting the profile into a pre-defined LaTeX structure.
4️⃣ `generateCoverLetter` (Gemini Pro) — Writes a personalized, highly relevant cover letter based on the match analysis.
5️⃣ `draftColdEmail` (Gemini Flash) — Drafts a quick outreach email for hiring managers.

Here is a look at how clean this wiring is in code using `@langchain/langgraph`:

```javascript
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
```

💡 **Key Engineering Takeaways:**

* **Mix and Match Models:** You don't need expensive models for everything. I used `Gemini 3 Flash` for structured extraction and scoring (fast, cheap), and reserved `Gemini 2.5 Pro` for the complex content generation (LaTeX code, cover letters).
* **State Management:** LangGraph carries a single `PipelineState` object through the graph. Each node updates only its relevant keys, ensuring downstream nodes have clean context.
* **Separation of Concerns:** Decomposing steps makes debugging simple. If the LaTeX generation fails, I know it's a node prompt issue, not a job parsing issue.

How are you structuring complex workflows in your AI apps? Let's discuss in the comments!

#AI #SoftwareEngineering #LangChain #GenerativeAI #WebDevelopment #SystemDesign

---

### 🐦 X (Twitter) Thread Version

**Tweet 1/6**
Stop using massive single prompts for complex AI tasks. It leads to hallucinations, high latency, and messy formatting.

Here is how I used LangGraph to orchestrate a stateful 5-node AI pipeline for my project, AI CareerCrew AI. 🧵👇

**Tweet 2/6**
The problem: Asking an LLM to parse a JD, compute a match score, tailor a LaTeX resume, and write a cover letter in a single prompt is too much cognitive load.

The fix: A Directed Acyclic Graph (DAG) using @LangChainAI’s LangGraph. 

Each step is an isolated node.

**Tweet 3/6**
Here is our graph flow:
1️⃣ `parseJob` (Gemini Flash) ➡️ Structured JD parser
2️⃣ `scoreMatch` (Gemini Flash) ➡️ ATS match scorer
3️⃣ `tailorResume` (Gemini Pro) ➡️ LaTeX resume builder
4️⃣ `generateCoverLetter` (Gemini Pro) ➡️ Letter writer
5️⃣ `draftColdEmail` (Gemini Flash) ➡️ Outreach draft

**Tweet 4/6**
By structuring it as a stateful graph, the output of one node flows seamlessly into the next. 

Here is how the StateGraph is wired up in Node.js:

```js
const workflow = new StateGraph(PipelineState)
  .addNode("parseJob", parseJobNode)
  .addNode("scoreMatch", scoreMatchNode)
  .addNode("tailorResume", tailorResumeNode)
  // ...
  .addEdge(START, "parseJob")
  .addEdge("parseJob", "scoreMatch")
  .addEdge("scoreMatch", "tailorResume")
  // ...
```

**Tweet 5/6**
Why this architecture rules:
1. **Cost & Speed:** Use Gemini Flash (fast/cheap) for JSON extraction + scoring, and Pro for creative text generation.
2. **Predictable Output:** Using Zod schemas with `.withStructuredOutput()` guarantees database-ready JSON.

**Tweet 6/6**
Building multi-agent systems has completely changed how I think about LLM app reliability. 

Check out the full repo here: https://github.com/AyushRay06/Resume-Generator

What framework are you using for multi-agent workflows? Crews, LangGraph, or custom code?

---
---

## Post 2: Handling Long-Running AI Workflows in Serverless Environments

### Focus
How to build an autonomous background worker system (Job Autopilot) that fetches, ranks, and applies to jobs using Inngest + Event-Driven Architecture, avoiding serverless timeout limits.

---

### 💼 LinkedIn Version

**Title: How to bypass serverless timeouts for heavy AI workloads** ⏳

If you deploy your API to serverless environments (like Vercel or AWS Lambda), you know the pain of strict execution limits. On hobby tiers, you often get a hard cutoff at 10–60 seconds.

But what if your app needs to run a background job that:
1. Searches job boards via API.
2. AI-scores 10+ jobs against a user's profile.
3. Tailors a custom LaTeX resume + cover letter for the best matches.
4. Interacts with external compilers.

This entire workflow can easily take 2 to 3 minutes. A standard HTTP route will timeout and fail.

To solve this for **AI CareerCrew AI**, I decoupled the HTTP request lifecycle from the execution pipeline using **Inngest** for serverless background processing.

Here is how the architecture works:

1️⃣ **Immediate Response:** When the user schedules a run, the Express API controller immediately returns a `202 Accepted` status code. The frontend feels instant.
2️⃣ **Event Dispatch:** The controller dispatches a background event: `inngest.send({ name: "autopilot/run.requested", data: { scheduleId } })`.
3️⃣ **Durable Execution:** Inngest picks up the event. Instead of running everything in one block, the function is broken down into **step-level transactions**:

```javascript
export const jobAutopilotFunction = inngest.createFunction(
  { id: "job-autopilot", triggers: [{ event: "autopilot/run.requested" }], retries: 3 },
  async ({ event, step }) => {
    // Step 1: Read database parameters safely
    const data = await step.run("load-data", async () => { ... });

    // Step 2: Invoke the heavy LangGraph workflow
    const result = await step.run("run-autopilot-pipeline", async () => {
      return await autopilotGraph.invoke({ ... });
    });

    // Step 3: Write results back to PostgreSQL
    await step.run("update-schedule-history", async () => { ... });
  }
);
```

💡 **Why this is a game-changer for AI applications:**

* **Step-Level Durability:** If Step 2 fails due to an LLM rate limit, Inngest does *not* restart the entire function. It retries **only** Step 2, keeping the loaded data from Step 1 cached.
* **Smart Throttling:** I configured a throttle of `2 runs per minute` to prevent concurrent API loops from exhausting API tokens (RapidAPI) and Gemini rate limits.
* **Cron Optimization:** Rather than dynamically registering individual cron schedules for every user (which is an infrastructure headache), a single serverless cron checks for due schedules every 15 minutes and fires event triggers.

Serverless doesn't mean you can't run heavy, long-running processes. You just need to switch from a synchronous request-response mindset to an event-driven, step-based execution.

How are you handling background tasks in serverless environments?

#Serverless #Inngest #SystemDesign #Backend #NodeJS #PostgreSQL

---

### 🐦 X (Twitter) Thread Version

**Tweet 1/5**
Vercel serverless functions have a 10s timeout limit on the free tier. 

But my AI Autopilot pipeline takes 2+ minutes to fetch, AI-rank, and build resumes for multiple jobs. 

Here is how I bypassed serverless timeouts using Event-Driven Architecture with @Inngest. 🧵👇

**Tweet 2/5**
The naive approach: Send a POST request and await the entire AI pipeline. 

Result: `504 Gateway Timeout`.

The better approach: 
1. API immediately returns `202 Accepted` to the client.
2. API fires a background event: `autopilot/run.requested`.

**Tweet 3/5**
Inngest picks up this event and runs the code in checkpointed "steps". 

If the LLM rate-limits or fails on step 2, Inngest retries ONLY step 2. You don’t pay to re-run your database queries from step 1!

```js
export const jobAutopilotFunction = inngest.createFunction(
  { id: "job-autopilot", triggers: [{ event: "autopilot/run.requested" }], retries: 3 },
  async ({ event, step }) => {
    const data = await step.run("load-data", ...)
    const result = await step.run("run-autopilot-pipeline", ...)
    await step.run("update-schedule-history", ...)
  }
);
```

**Tweet 4/5**
We also implemented smart throttling:
```json
throttle: {
  limit: 2,
  period: "1m",
}
```
This ensures we never spam the Gemini or RapidAPI endpoints, preventing IP bans and rate-limiting blocks.

**Tweet 5/5**
Lesson learned: Don't write long linear scripts in serverless. Use step-based execution. 

Read the full background worker configuration here: https://github.com/AyushRay06/Resume-Generator

#buildinpublic #solopreneur #nodejs #serverless

---
---

## Post 3: Escaping the LaTeX Syntax Hell with LLMs: Clean Compiles, Every Time

### Focus
Why generating raw LaTeX from an LLM is extremely brittle, and how to combine system prompt engineering with programmatic regex post-processing to guarantee 99%+ compile success rates.

---

### 💼 LinkedIn Version

**Title: How I stopped LLMs from breaking my LaTeX compilation** 📄🛠️

LLMs are incredible at writing code, but they are notoriously bad at writing strictly structured markup like LaTeX. 

If you are building an AI app that compiles document outputs, a single missing backslash or an unescaped special character (like `%`, `&`, `#`) will completely break the compiler, leaving your users with a blank screen or a cryptic error trace.

For my **AI CareerCrew AI**, I needed the AI to generate raw LaTeX resumes that compile reliably into PDFs via a headless compilation API. Here is the engineering approach I used to reach a **99%+ compilation success rate**.

---

### Phase 1: Structuring the System Prompt
Don't let the LLM invent the document preamble, packages, or custom formatting commands from scratch. Instead, provide a strict structure:
1. **Load Template First:** I read a pre-formatted LaTeX template (`resume.tex`) and inject it directly into the prompt.
2. **Define Boundaries:** I tell the LLM to only replace bracketed placeholders (like `[EXPERIENCE CONTENT]`) and preserve custom commands like `\resumeItem` and `\resumeSubheading` exactly as written.
3. **Inject Escaping Rules:** I explicitly define LaTeX character escapes in the system prompt instructions:
   * Percent (`%`): Must be written as `\%` (Critical for things like "increased efficiency by 30%")
   * Ampersand (`&`): Must be written as `\&` (e.g. "R&D" ➡️ "R\&D")
   * Hash (`#`): Must be written as `\#` (e.g. "C#" ➡️ "C\#")
   * Underscore (`_`): Must be written as `\_`

---

### Phase 2: Programmatic Post-Processing
Despite clear instructions, LLMs still occasionally output bare percentages (like `15%`) because of their token prediction training. A bare `%` in LaTeX acts as a comment, meaning the rest of that line is deleted, leading to compilation failures.

To fix this, I added a Node.js post-processing layer using a **negative lookbehind regex** to catch and escape any raw percentage sign not already escaped:

```javascript
// Clean markdown tags that models wrap around responses
latexCode = latexCode.replace(/^```latex\s*/i, "").replace(/\s*```$/, "");

// Regex: Replace % only if it is NOT preceded by a backslash \
latexCode = latexCode.replace(/(?<!\\)%/g, "\\%");
```

💡 **Key Takeaway:**
When generating strict syntax (LaTeX, HTML, SVG, or YAML) with LLMs, **never rely 100% on prompt engineering**. Always implement a deterministic programmatic parser as a final validation step to clean up and validate the output before it hits the compiler.

How do you handle LLM output sanitization in your pipeline?

#AI Engineering #LLM #Regex #WebDevelopment #SoftwareArchitecture #JavaScript #LaTeX

---

### 🐦 X (Twitter) Thread Version

**Tweet 1/5**
Generating LaTeX from LLMs is incredibly brittle. A single raw `%` or `&` will break the compiler and cause PDF rendering to fail.

Here is the dual-layer strategy I used to guarantee a 99%+ LaTeX compile success rate. 🧵👇

**Tweet 2/5**
First layer: Strict templating. 
Don't ask the LLM to write the whole LaTeX file from scratch. 
Inject a pre-formatted template with markers (like `[EXPERIENCE CONTENT]`) into the prompt. Force the LLM to ONLY fill in the blanks.

**Tweet 3/5**
Second layer: Special character rules in the prompt.
Tell the model:
- Ampersands: `R&D` ➡️ `R\&D`
- Hashes: `C#` ➡️ `C\#`
- Underscores: `user_id` ➡️ `user\_id`
- Percentages: `30%` ➡️ `30\%` (Failure to escape `%` comments out the rest of the line!)

**Tweet 4/5**
Third layer: Regex post-processing.
Even with strict prompts, LLMs will still leak bare `%` signs. 
We clean it up programmatically in Node.js using a negative lookbehind regex:

```js
// Replace % ONLY if it is not preceded by a backslash \
latexCode = latexCode.replace(/(?<!\\)%/g, "\\%");
```

**Tweet 5/5**
Takeaway: Prompt engineering is never 100% reliable for strict syntaxes. Always build a programmatic parser/validator around your LLM outputs to clean up edge cases.

Full prompt implementation: https://github.com/AyushRay06/Resume-Generator/blob/main/backend/src/agents/oneClickApply/nodes.js

#webdev #typescript #ai #latex
