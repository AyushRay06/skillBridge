# How I Orchestrated Multiple AI Agents to Automate the Job Search Pipeline

Finding a job is a full-time job in itself. Between finding the right roles, tailoring resumes, writing cover letters, and applying, the process is incredibly tedious. With **CareerCrew AI**, I set out to completely automate this pipeline using a multi-agent AI architecture. 

Here is a deep dive into how I orchestrated multiple AI agents to build the "Job Autopilot"—a system that searches, filters, and applies to jobs for you while you sleep.

---

## The Vision: A Fully Autonomous Job Hunter

The goal was simple: 
> A user sets their preferences once. The system wakes up on a schedule, scours the web for matching jobs, filters them by fit, generates tailored resumes and cover letters for each one, and prepares the applications. 

To achieve this, a single LLM prompt wasn't going to cut it. I needed a robust, stateful pipeline where multiple specialized agents could handle discrete tasks, pass data to one another, and recover from failures.

## The Architecture: LangGraph + Inngest

I built the core agentic logic using **LangGraph**, representing the pipelines as Directed Acyclic Graphs (DAGs). This allowed me to break the massive task into smaller, highly specialized "nodes."

To run these long-lived agent graphs reliably on a serverless infrastructure (Vercel), I used **Inngest** for orchestration. Inngest handles the cron scheduling (waking the agents up), queuing, and automatic retries if an external API fails.

### The Autopilot Graph

The top-level orchestrator is the **Autopilot Graph**, a 5-node pipeline that handles the broad discovery phase:

1. **`buildSearchQuery` Agent**: Takes the user's master profile and their schedule filters (e.g., "Remote React roles") and uses an LLM to generate highly optimized search queries to maximize API hits.
2. **`searchJobs` Node**: Takes those queries and hits external job aggregator APIs (JSearch via RapidAPI for LinkedIn/Indeed/Google Jobs, and Remotive for remote roles) in parallel, deduplicating the results.
3. **`filterAndRank` Agent**: This is where the magic starts. An LLM agent acts as an automated recruiter. It reads every discovered job description and scores it (0-100) against the user's master profile, filtering out low-match jobs and ranking the best ones.
4. **`batchApply` Orchestrator**: For every job that passes the threshold, this node triggers a *second*, nested agent graph (the One-Click Apply Graph).
5. **`generateReport` Agent**: Finally, an agent summarizes the entire run into a human-readable report ("Found 23 jobs, qualified for 5, tailored resumes prepared for 3") which is emailed to the user.

### The Nested "One-Click Apply" Graph

When the `batchApply` node finds a winner, it hands off execution to the **One-Click Apply Graph**. This is a specialized pipeline dedicated solely to crafting the perfect application for a *single* job:

1. **`parseJob` Agent**: Extracts the core requirements, tech stack, and responsibilities from the raw job description.
2. **`scoreMatch` Agent**: Analyzes the gap between the job requirements and the user's profile.
3. **`tailorResume` Agent**: Uses the gap analysis to rewrite and reorganize the user's experience points, outputting highly-optimized LaTeX code that perfectly targets the role.
4. **`generateCoverLetter` Agent**: Drafts a personalized cover letter.
5. **`draftColdEmail` Agent**: Prepares an outreach email to the hiring manager.

## Model Routing: Balancing Speed, Cost, and Quality

One of the biggest challenges in orchestrating multiple agents is cost and latency. If I used a massive, expensive model for every step, the system would be too slow and costly to run at scale.

I solved this by routing tasks to different models based on their complexity:
* **Google Gemini Flash Lite**: Used for the high-volume, structural tasks like parsing job descriptions, generating search queries, and doing the initial fast-pass scoring. It's incredibly fast and cost-effective.
* **Fine-Tuned Mistral 7B / Pro Models**: Reserved exclusively for the heavy-lifting creative tasks, specifically writing the tailored LaTeX resumes and drafting the cover letters, where quality and formatting precision are paramount.

## Overcoming Challenges

* **State Management**: LangGraph's `StateGraph` was crucial here. It allowed me to define a strict TypeScript interface for the state moving between agents. If the `parseJob` agent failed to extract the tech stack, the state could reflect that, and subsequent agents could adapt.
* **Serverless Timeouts**: Scraping jobs and running dozens of LLM calls takes minutes, easily exceeding Vercel's serverless function timeouts. By wrapping the pipeline in **Inngest**, the work is processed asynchronously in the background.

## The Result

By breaking down a monolithic "apply to jobs" prompt into a network of specialized agents, the system achieves remarkable accuracy. The `filterAndRank` agent weeds out the noise, and the nested `tailorResume` agent ensures that every application looks like it was written by a human who spent hours studying the job description.

Orchestrating multiple AI agents isn't just about throwing more LLMs at a problem; it's about treating them like microservices in a pipeline—each with a single responsibility, clear inputs, and strict outputs.
