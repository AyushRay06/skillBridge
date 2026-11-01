import { inngest } from "../client.js";
import { autopilotGraph } from "../../agents/autopilot/graph.js";
import prisma from "../../lib/prisma.js";

/**
 * Job Autopilot Inngest Function
 *
 * Triggered by: "autopilot/run.requested" event
 * (sent by the API controller when user creates/toggles/manually runs a schedule)
 *
 * Steps are independently retried if they fail — Inngest checkpoints each step.
 *
 * NOTE: Newer Inngest versions use a single config object with triggers inside it.
 */
export const jobAutopilotFunction = inngest.createFunction(
  {
    id: "job-autopilot",
    name: "Job Autopilot",
    retries: 3,
    throttle: {
      limit: 2,
      period: "1m",
    },
    triggers: [{ event: "autopilot/run.requested" }],
  },
  async ({ event, step }) => {
    const { scheduleId, userId } = event.data;

    // ─── Step 1: Load schedule + user profile from DB ─────────────────────
    const { schedule, userProfile } = await step.run("load-data", async () => {
      const schedule = await prisma.jobSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) throw new Error(`Schedule ${scheduleId} not found.`);
      if (!schedule.isActive) throw new Error(`Schedule ${scheduleId} is inactive.`);

      const userProfile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (!userProfile) throw new Error(`No user profile found for user ${userId}.`);

      return { schedule, userProfile };
    });

    // ─── Step 2: Run the LangGraph autopilot pipeline ─────────────────────
    const result = await step.run("run-autopilot-pipeline", async () => {
      const output = await autopilotGraph.invoke({
        scheduleId,
        userId,
        schedule,
        userProfile,
      });

      return {
        report: output.report,
        totalFound: output.rawJobs?.length || 0,
        totalApplied:
          output.applicationResults?.filter((r) => r.status === "completed").length || 0,
        errors: output.errors || [],
      };
    });

    // ─── Step 3: Update schedule run history in DB ────────────────────────
    await step.run("update-schedule-history", async () => {
      const status =
        result.totalApplied > 0
          ? "success"
          : result.totalFound === 0
          ? "no_matches"
          : result.errors.length > 0
          ? "failed"
          : "partial";

      await prisma.jobSchedule.update({
        where: { id: scheduleId },
        data: {
          lastRunAt: new Date(),
          lastRunStatus: status,
          totalRuns: { increment: 1 },
          totalApplied: { increment: result.totalApplied },
        },
      });

      return { status };
    });

    return {
      success: true,
      scheduleId,
      report: result.report,
      totalFound: result.totalFound,
      totalApplied: result.totalApplied,
    };
  }
);

/**
 * Cron-triggered poller — checks all active schedules every 15 minutes
 * and fires the "autopilot/run.requested" event for ones that are due.
 *
 * This avoids needing per-user dynamic cron registrations.
 * Accuracy: ±15 minutes of the user's configured cron hour.
 */
export const autopilotCronFunction = inngest.createFunction(
  {
    id: "autopilot-cron-poll",
    name: "Autopilot Schedule Poller",
    retries: 1,
    triggers: [{ cron: "*/15 * * * *" }],
  },
  async ({ step }) => {
    // Find all active schedules
    const activeSchedules = await step.run("find-due-schedules", async () => {
      return await prisma.jobSchedule.findMany({
        where: { isActive: true },
        select: {
          id: true,
          userId: true,
          cronExpression: true,
          timezone: true,
          lastRunAt: true,
        },
      });
    });

    if (activeSchedules.length === 0) {
      return { triggered: 0 };
    }

    const triggered = await step.run("trigger-due-schedules", async () => {
      const now = new Date();
      let triggeredCount = 0;

      for (const schedule of activeSchedules) {
        // Simple daily check: if last ran > 23 hours ago (or never), and cron matches current hour
        const lastRun = schedule.lastRunAt ? new Date(schedule.lastRunAt) : null;
        const hoursSinceLastRun = lastRun
          ? (now - lastRun) / (1000 * 60 * 60)
          : Infinity;

        // Parse hour from cron: "minute hour day month weekday"
        const cronParts = schedule.cronExpression.split(" ");
        const cronHour = parseInt(cronParts[1], 10);
        const currentHour = now.getUTCHours();

        const isWithinWindow = Math.abs(currentHour - cronHour) <= 0;
        const notRunRecently = hoursSinceLastRun >= 23;

        if (isWithinWindow && notRunRecently) {
          await inngest.send({
            name: "autopilot/run.requested",
            data: { scheduleId: schedule.id, userId: schedule.userId },
          });
          triggeredCount++;
        }
      }

      return triggeredCount;
    });

    return { triggered };
  }
);
