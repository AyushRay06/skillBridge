import prisma from "../lib/prisma.js";
import { inngest } from "../inngest/client.js";
import { autopilotGraph } from "../agents/autopilot/graph.js";

// ─────────────────────────────────────────────
// CREATE a new schedule
// ─────────────────────────────────────────────
export const createSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      cronExpression,
      timezone,
      targetRoles,
      locations,
      workType,
      experienceLevel,
      salaryMin,
      salaryMax,
      postAge,
      minMatchScore,
      maxApplications,
    } = req.body;

    // Validate required fields
    if (!cronExpression) {
      return res.status(400).json({ msg: "cronExpression is required." });
    }
    if (!targetRoles || !Array.isArray(targetRoles) || targetRoles.length === 0) {
      return res.status(400).json({ msg: "targetRoles must be a non-empty array." });
    }
    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ msg: "locations must be a non-empty array." });
    }

    // Ensure user has a profile before creating a schedule
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(400).json({
        msg: "Please complete your Master Profile before creating an autopilot schedule.",
        noProfile: true,
      });
    }

    const schedule = await prisma.jobSchedule.create({
      data: {
        userId,
        name: name || "My Job Search",
        cronExpression,
        timezone: timezone || "Asia/Kolkata",
        targetRoles,
        locations,
        workType: workType || "any",
        experienceLevel: experienceLevel || "any",
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        postAge: postAge || "24h",
        minMatchScore: minMatchScore ? parseInt(minMatchScore) : 60,
        maxApplications: maxApplications ? parseInt(maxApplications) : 5,
        isActive: true,
      },
    });

    return res.status(201).json({
      msg: "Schedule created successfully.",
      schedule,
    });
  } catch (error) {
    console.error("Error in createSchedule:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// GET all schedules for the user
// ─────────────────────────────────────────────
export const getSchedules = async (req, res) => {
  try {
    const userId = req.user.id;

    const schedules = await prisma.jobSchedule.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { discoveredJobs: true } },
      },
    });

    return res.status(200).json({ schedules, count: schedules.length });
  } catch (error) {
    console.error("Error in getSchedules:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// GET a single schedule + its recent discovered jobs
// ─────────────────────────────────────────────
export const getSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const schedule = await prisma.jobSchedule.findFirst({
      where: { id, userId },
      include: {
        discoveredJobs: {
          orderBy: { createdAt: "desc" },
          take: 50, // Most recent 50 discovered jobs
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            salary: true,
            url: true,
            source: true,
            matchScore: true,
            matchReason: true,
            status: true,
            postedAt: true,
            createdAt: true,
            applicationId: true,
          },
        },
      },
    });

    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    return res.status(200).json({ schedule });
  } catch (error) {
    console.error("Error in getSchedule:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// UPDATE schedule filters / config
// ─────────────────────────────────────────────
export const updateSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.jobSchedule.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    const {
      name,
      cronExpression,
      timezone,
      targetRoles,
      locations,
      workType,
      experienceLevel,
      salaryMin,
      salaryMax,
      postAge,
      minMatchScore,
      maxApplications,
    } = req.body;

    const updated = await prisma.jobSchedule.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(cronExpression !== undefined && { cronExpression }),
        ...(timezone !== undefined && { timezone }),
        ...(targetRoles !== undefined && { targetRoles }),
        ...(locations !== undefined && { locations }),
        ...(workType !== undefined && { workType }),
        ...(experienceLevel !== undefined && { experienceLevel }),
        ...(salaryMin !== undefined && { salaryMin: parseInt(salaryMin) }),
        ...(salaryMax !== undefined && { salaryMax: parseInt(salaryMax) }),
        ...(postAge !== undefined && { postAge }),
        ...(minMatchScore !== undefined && { minMatchScore: parseInt(minMatchScore) }),
        ...(maxApplications !== undefined && { maxApplications: parseInt(maxApplications) }),
      },
    });

    return res.status(200).json({ msg: "Schedule updated.", schedule: updated });
  } catch (error) {
    console.error("Error in updateSchedule:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// TOGGLE active / inactive
// ─────────────────────────────────────────────
export const toggleSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.jobSchedule.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    const updated = await prisma.jobSchedule.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return res.status(200).json({
      msg: `Schedule ${updated.isActive ? "activated" : "paused"}.`,
      schedule: updated,
    });
  } catch (error) {
    console.error("Error in toggleSchedule:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// DELETE a schedule
// ─────────────────────────────────────────────
export const deleteSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.jobSchedule.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    await prisma.jobSchedule.delete({ where: { id } });

    return res.status(200).json({ msg: "Schedule deleted successfully." });
  } catch (error) {
    console.error("Error in deleteSchedule:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// MANUALLY TRIGGER a schedule run
// ─────────────────────────────────────────────
export const triggerRun = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const schedule = await prisma.jobSchedule.findFirst({ where: { id, userId } });
    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    // Check user has a profile
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(400).json({
        msg: "Please complete your Master Profile before running the autopilot.",
        noProfile: true,
      });
    }

    // Send the Inngest event — the jobAutopilotFunction handles the rest
    await inngest.send({
      name: "autopilot/run.requested",
      data: { scheduleId: id, userId },
    });

    return res.status(202).json({
      msg: "Autopilot run triggered. Check the Inngest dashboard for progress, or refresh your Applications page in a few minutes.",
      scheduleId: id,
    });
  } catch (error) {
    console.error("Error in triggerRun:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// DIRECTLY RUN the autopilot pipeline (bypasses Inngest)
// This lets users test immediately or run on-demand.
// ─────────────────────────────────────────────
export const triggerRunDirect = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const schedule = await prisma.jobSchedule.findFirst({ where: { id, userId } });
    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    // Check user has a profile
    const userProfile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!userProfile) {
      return res.status(400).json({
        msg: "Please complete your Master Profile before running the autopilot.",
        noProfile: true,
      });
    }

    // Respond immediately with 202 — pipeline runs async in background
    res.status(202).json({
      msg: "Autopilot pipeline started! Running directly in-process (no scheduler needed). Refresh your dashboard in a few minutes to see results.",
      scheduleId: id,
      mode: "direct",
    });

    // Run the pipeline in background (fire-and-forget)
    (async () => {
      const startTime = Date.now();
      console.log(`[triggerRunDirect] Starting direct run for schedule ${id}...`);

      try {
        const output = await autopilotGraph.invoke({
          scheduleId: id,
          userId,
          schedule,
          userProfile,
        });

        const totalFound = output.rawJobs?.length || 0;
        const totalApplied =
          output.applicationResults?.filter((r) => r.status === "completed").length || 0;
        const hasErrors = (output.errors || []).length > 0;

        const runStatus =
          totalApplied > 0
            ? "success"
            : totalFound === 0
            ? "no_matches"
            : hasErrors
            ? "failed"
            : "partial";

        await prisma.jobSchedule.update({
          where: { id },
          data: {
            lastRunAt: new Date(),
            lastRunStatus: runStatus,
            totalRuns: { increment: 1 },
            totalApplied: { increment: totalApplied },
          },
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(
          `[triggerRunDirect] Completed in ${elapsed}s — Found: ${totalFound}, Applied: ${totalApplied}, Status: ${runStatus}`
        );
        if (output.report) {
          console.log(`[triggerRunDirect] Report:\n${output.report}`);
        }
      } catch (pipelineError) {
        console.error("[triggerRunDirect] Pipeline failed:", pipelineError);
        await prisma.jobSchedule
          .update({
            where: { id },
            data: {
              lastRunAt: new Date(),
              lastRunStatus: "failed",
              totalRuns: { increment: 1 },
            },
          })
          .catch(() => {});
      }
    })();
  } catch (error) {
    console.error("Error in triggerRunDirect:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// GET all discovered jobs for the user (across all schedules)
// ─────────────────────────────────────────────
export const getDiscoveredJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scheduleId, status, page = 1, limit = 20 } = req.query;

    const where = {
      schedule: { userId },
      ...(scheduleId && { scheduleId }),
      ...(status && { status }),
    };

    const [jobs, total] = await Promise.all([
      prisma.discoveredJob.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          salary: true,
          url: true,
          source: true,
          description: true,
          matchScore: true,
          matchReason: true,
          status: true,
          postedAt: true,
          createdAt: true,
          applicationId: true,
          scheduleId: true,
          schedule: { select: { name: true } },
        },
      }),
      prisma.discoveredJob.count({ where }),
    ]);

    return res.status(200).json({
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error in getDiscoveredJobs:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ─────────────────────────────────────────────
// DELETE a discovered job
// ─────────────────────────────────────────────
export const deleteDiscoveredJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // First check if it exists and belongs to the user
    const job = await prisma.discoveredJob.findFirst({
      where: {
        id,
        schedule: { userId },
      },
    });

    if (!job) {
      return res.status(404).json({ msg: "Job not found or unauthorized." });
    }

    await prisma.discoveredJob.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "Job deleted successfully." });
  } catch (error) {
    console.error("Error in deleteDiscoveredJob:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};
