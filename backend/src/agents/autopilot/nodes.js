import { z } from "zod";
import { flashModel } from "../llm.js";
import { searchAllSources } from "./jobSearch.js";
import { oneClickApplyGraph } from "../oneClickApply/graph.js";
import prisma from "../../lib/prisma.js";

// ─────────────────────────────────────────────
// Zod schema for batch job scoring output
// ─────────────────────────────────────────────

const JobScoreSchema = z.object({
  scores: z.array(
    z.object({
      index: z.number().describe("Index of the job in the provided list (0-based)"),
      score: z.number().min(0).max(100).describe("Match score 0-100"),
      reason: z.string().describe("One-sentence reason for the score"),
    })
  ),
});

// ─────────────────────────────────────────────
// Node 1: buildSearchQuery
// ─────────────────────────────────────────────

/**
 * Converts the user's profile + schedule filters into an array of
 * optimized search query strings.
 */
export async function buildSearchQueryNode(state) {
  try {
    const { userProfile, schedule } = state;
    const { targetRoles = [], locations = [], workType, experienceLevel } = schedule;

    console.log("[buildSearchQueryNode] Generating search queries...");

    // Extract top skills from profile (first category or flat array)
    let topSkills = [];
    try {
      const skills =
        typeof userProfile.skills === "string"
          ? JSON.parse(userProfile.skills)
          : userProfile.skills;

      if (Array.isArray(skills)) {
        // flat string array
        topSkills = skills.slice(0, 5);
      } else if (typeof skills === "object" && skills !== null) {
        // categorized object — flatten values
        topSkills = Object.values(skills).flat().slice(0, 5);
      }
    } catch (e) {
      console.warn("[buildSearchQueryNode] Could not parse skills:", e.message);
    }

    const ModelWithOutput = flashModel.withStructuredOutput(
      z.object({
        queries: z
          .array(z.string())
          .describe("Array of exactly 2-3 highly focused job search query strings"),
      })
    );

    const locationStr =
      workType === "remote"
        ? "remote"
        : locations.length > 0
        ? locations.join(", ")
        : "any location";

    const expStr =
      experienceLevel !== "any" ? `${experienceLevel} level` : "";

    const prompt = `You are a job search expert. Generate exactly 2-3 search query strings optimized for Google Jobs / job boards.

User's target roles: ${targetRoles.join(", ") || "Software Engineer"}
Location preference: ${locationStr}
Experience level: ${expStr || "any"}
Work type: ${workType || "any"}

STRICT RULES — read carefully:
- Queries must follow the pattern: "[Job Title] [location/remote] [level]"
- Examples of GOOD queries: "React developer remote", "Frontend engineer mid level remote", "Software engineer Bangalore"
- Examples of BAD queries (DO NOT do this): "React developer MongoDB Prisma Nextjs" or "Python engineer MongoDB Prisma mid level remote" — these are too technology-specific and return zero results on job boards
- Use ONLY the job title + location + experience level in each query. Do NOT include technology stack names.
- Generate AT MOST 3 queries. Vary the job title wording across queries (e.g. "developer" vs "engineer" vs "programmer").
- Each query must be 3-6 words, no longer.`;

    const result = await ModelWithOutput.invoke([
      { role: "system", content: "Generate optimized job search queries." },
      { role: "user", content: prompt },
    ]);

    const queries = result.queries || [];
    console.log(`[buildSearchQueryNode] Generated ${queries.length} queries:`, queries);

    return { searchQueries: queries };
  } catch (error) {
    console.error("[buildSearchQueryNode] Error:", error);
    return { errors: [error.message], searchQueries: [] };
  }
}

// ─────────────────────────────────────────────
// Node 2: searchJobs
// ─────────────────────────────────────────────

/**
 * Calls JSearch (RapidAPI) and Remotive in parallel for all generated queries.
 * Returns the deduplicated merged job list.
 */
export async function searchJobsNode(state) {
  try {
    const { searchQueries, schedule } = state;

    if (!searchQueries || searchQueries.length === 0) {
      throw new Error("No search queries available.");
    }

    console.log(`[searchJobsNode] Searching ${searchQueries.length} queries (JSearch primary, Remotive fallback)...`);
    console.log(`[searchJobsNode] Queries:`, searchQueries);

    const filters = {
      workType: schedule.workType,
      experienceLevel: schedule.experienceLevel,
      postAge: schedule.postAge,
    };

    // Cap at 8 jobs total — keeps runs fast and scoring cheap
    const rawJobs = await searchAllSources(searchQueries, filters, 8);

    const jsearchCount = rawJobs.filter((j) => j.source === "jsearch").length;
    const remotiveCount = rawJobs.filter((j) => j.source === "remotive").length;
    console.log(`[searchJobsNode] Result: ${rawJobs.length} jobs — ${jsearchCount} from JSearch, ${remotiveCount} from Remotive`);

    return { rawJobs };
  } catch (error) {
    console.error("[searchJobsNode] Error:", error);
    return { errors: [error.message], rawJobs: [] };
  }
}

// ─────────────────────────────────────────────
// Node 3: filterAndRank
// ─────────────────────────────────────────────

/**
 * AI-scores each discovered job against the user's profile.
 * Filters out below-threshold jobs, caps at maxApplications.
 * Saves all discovered jobs to DB with their scores & status.
 */
export async function filterAndRankNode(state) {
  try {
    const { rawJobs, userProfile, schedule, scheduleId } = state;

    if (!rawJobs || rawJobs.length === 0) {
      console.log("[filterAndRankNode] No jobs to score.");
      return { qualifiedJobs: [] };
    }

    console.log(`[filterAndRankNode] Scoring ${rawJobs.length} jobs against user profile...`);

    const { minMatchScore = 60, maxApplications = 5 } = schedule;

    // Build a concise user summary for the prompt
    const userSummary = JSON.stringify({
      skills: userProfile.skills,
      experienceTitles: Array.isArray(userProfile.experience)
        ? userProfile.experience.map((e) => e.title || e)
        : [],
      targetRoles: schedule.targetRoles,
    });

    // Score in batches of 10 to stay within token limits
    const BATCH_SIZE = 10;
    const allScores = [];

    for (let i = 0; i < rawJobs.length; i += BATCH_SIZE) {
      const batch = rawJobs.slice(i, i + BATCH_SIZE);

      const jobList = batch
        .map(
          (job, idx) =>
            `[${idx}] Title: ${job.title} | Company: ${job.company} | Location: ${job.location}\nDescription (first 300 chars): ${job.description.slice(0, 300)}`
        )
        .join("\n\n");

      const ModelWithOutput = flashModel.withStructuredOutput(JobScoreSchema);

      const result = await ModelWithOutput.invoke([
        {
          role: "system",
          content: `You are an ATS matching engine. Score each job listing 0-100 based on how well it matches the candidate's profile. 100 = perfect match, 0 = completely irrelevant. Be quick and objective.`,
        },
        {
          role: "user",
          content: `Candidate Profile Summary:\n${userSummary}\n\nJobs to score:\n${jobList}`,
        },
      ]);

      // Re-map batch-relative indices to global indices
      for (const s of result.scores) {
        allScores.push({ ...s, globalIndex: i + s.index });
      }
    }

    // Save ALL discovered jobs to DB (regardless of score, for transparency)
    const savedJobs = [];
    for (let i = 0; i < rawJobs.length; i++) {
      const job = rawJobs[i];
      const scoreEntry = allScores.find((s) => s.globalIndex === i);
      const score = scoreEntry?.score ?? 0;
      const reason = scoreEntry?.reason ?? "";

      const status =
        score >= minMatchScore ? "qualified" : "below_threshold";

      const saved = await prisma.discoveredJob.create({
        data: {
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          url: job.url,
          source: job.source,
          postedAt: job.postedAt,
          description: job.description.slice(0, 20000), // Prisma text limit safety
          matchScore: score,
          matchReason: reason,
          status,
          scheduleId,
        },
      });

      if (status === "qualified") {
        savedJobs.push({ ...job, matchScore: score, dbId: saved.id });
      }
    }

    // Sort qualified jobs by score DESC, cap at maxApplications
    const qualifiedJobs = savedJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxApplications);

    console.log(
      `[filterAndRankNode] ${savedJobs.length} qualified (score ≥ ${minMatchScore}), processing top ${qualifiedJobs.length}.`
    );

    return { qualifiedJobs };
  } catch (error) {
    console.error("[filterAndRankNode] Error:", error);
    return { errors: [error.message], qualifiedJobs: [] };
  }
}

// ─────────────────────────────────────────────
// Node 4: batchApply
// ─────────────────────────────────────────────

/**
 * Runs the existing oneClickApplyGraph for each qualified job.
 * Saves an Application record and links it to the DiscoveredJob.
 * Adds a 5-second delay between runs to avoid LLM rate limits.
 */
export async function batchApplyNode(state) {
  try {
    const { qualifiedJobs, userProfile, userId } = state;

    if (!qualifiedJobs || qualifiedJobs.length === 0) {
      console.log("[batchApplyNode] No qualified jobs to apply for.");
      return { applicationResults: [] };
    }

    console.log(`[batchApplyNode] Running oneClickApply pipeline for ${qualifiedJobs.length} jobs...`);

    const applicationResults = [];

    for (let i = 0; i < qualifiedJobs.length; i++) {
      const job = qualifiedJobs[i];
      console.log(`[batchApplyNode] [${i + 1}/${qualifiedJobs.length}] Processing: ${job.title} @ ${job.company}`);

      try {
        // Run the existing oneClickApply LangGraph pipeline
        const pipelineResult = await oneClickApplyGraph.invoke({
          jobDescription: job.description,
          userProfile,
        });

        const hasErrors = pipelineResult.errors && pipelineResult.errors.length > 0;

        // Save Application record
        const application = await prisma.application.create({
          data: {
            userId,
            jobDescription: job.description,
            status: hasErrors ? "failed" : "completed",
            parsedJob: pipelineResult.parsedJob || null,
            matchScore: pipelineResult.matchResult?.score || job.matchScore,
            matchAnalysis: pipelineResult.matchResult
              ? {
                  strengths: pipelineResult.matchResult.strengths || [],
                  gaps: pipelineResult.matchResult.gaps || [],
                  suggestions: pipelineResult.matchResult.suggestions || [],
                }
              : null,
            tailoredResume: pipelineResult.tailoredResume || null,
            coverLetter: pipelineResult.coverLetter || null,
            coldEmail: pipelineResult.coldEmail || null,
          },
        });

        // Link the DiscoveredJob → Application
        await prisma.discoveredJob.update({
          where: { id: job.dbId },
          data: {
            status: hasErrors ? "failed" : "applied",
            applicationId: application.id,
          },
        });

        applicationResults.push({
          jobTitle: job.title,
          company: job.company,
          applicationId: application.id,
          status: hasErrors ? "failed" : "completed",
        });
      } catch (pipelineError) {
        console.error(`[batchApplyNode] Pipeline failed for ${job.title} @ ${job.company}:`, pipelineError.message);

        // Update DiscoveredJob status to failed
        await prisma.discoveredJob
          .update({ where: { id: job.dbId }, data: { status: "failed" } })
          .catch(() => {});

        applicationResults.push({
          jobTitle: job.title,
          company: job.company,
          applicationId: null,
          status: "failed",
          error: pipelineError.message,
        });
      }

      // Throttle: 5 second delay between pipeline runs (LLM rate limit safety)
      if (i < qualifiedJobs.length - 1) {
        await new Promise((r) => setTimeout(r, 5000));
      }
    }

    console.log(`[batchApplyNode] Done. ${applicationResults.filter((r) => r.status === "completed").length}/${qualifiedJobs.length} applications succeeded.`);
    return { applicationResults };
  } catch (error) {
    console.error("[batchApplyNode] Error:", error);
    return { errors: [error.message], applicationResults: [] };
  }
}

// ─────────────────────────────────────────────
// Node 5: generateReport
// ─────────────────────────────────────────────

/**
 * Generates a clean, human-readable summary of the entire autopilot run.
 */
export async function generateReportNode(state) {
  try {
    const { rawJobs, qualifiedJobs, applicationResults, schedule } = state;

    const totalFound = rawJobs?.length || 0;
    const totalQualified = qualifiedJobs?.length || 0;
    const totalApplied = applicationResults?.filter((r) => r.status === "completed").length || 0;
    const totalFailed = applicationResults?.filter((r) => r.status === "failed").length || 0;

    const topMatches = (qualifiedJobs || [])
      .slice(0, 5)
      .map((j, i) => `${i + 1}. ${j.title} @ ${j.company} — Score: ${j.matchScore}/100`)
      .join("\n");

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const report = `📊 Job Autopilot Report — ${date}
Schedule: ${schedule.name || "My Job Search"}

🔍 Jobs discovered: ${totalFound}
✅ Qualified (score ≥ ${schedule.minMatchScore || 60}): ${totalQualified}
📄 Applications prepared: ${totalApplied}${totalFailed > 0 ? `\n⚠️  Failed: ${totalFailed}` : ""}

${topMatches ? `🏆 Top Matches:\n${topMatches}` : "No qualifying matches this run."}

Your tailored resumes, cover letters, and cold emails are ready in your Applications dashboard.`;

    console.log("[generateReportNode] Report generated.");
    return { report };
  } catch (error) {
    console.error("[generateReportNode] Error:", error);
    return { errors: [error.message], report: "Report generation failed." };
  }
}
