
import prisma from "../lib/prisma.js";
import { oneClickApplyGraph } from "../agents/oneClickApply/graph.js";
import { compileLatexAndSendPdf } from "../lib/latex.js";

// ====================== Run One-Click Apply Pipeline ======================
export const runOneClickApply = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ msg: "Job description is required." });
    }

    // 1. Validate that the user has a profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(400).json({
        msg: "Please complete your Master Profile before using the One-Click Apply pipeline.",
        noProfile: true,
      });
    }

    // 2. Create the Application record in "processing" status
    const application = await prisma.application.create({
      data: {
        userId,
        jobDescription,
        status: "processing",
      },
    });

    // Send early response to prevent HTTP timeouts
    res.status(201).json({
      msg: "One-Click Apply pipeline started successfully.",
      applicationId: application.id,
      application,
    });

    // 3. Trigger the LangGraph pipeline in the background
    (async () => {
      console.log(`[Pipeline] Starting background LangGraph pipeline for application: ${application.id}`);
      try {
        const inputs = {
          jobDescription,
          userProfile: profile,
        };

        const results = await oneClickApplyGraph.invoke(inputs);

        // Check if there are errors from the nodes
        if (results.errors && results.errors.length > 0) {
          console.error(`[Pipeline] Node errors occurred in application ${application.id}:`, results.errors);
          await prisma.application.update({
            where: { id: application.id },
            data: {
              status: "failed",
            },
          });
          return;
        }

        // Map graph output to database schema fields
        const parsedJob = results.parsedJob || null;
        const matchResult = results.matchResult || null;
        const matchScore = matchResult ? matchResult.score : null;
        const matchAnalysis = matchResult
          ? {
              strengths: matchResult.strengths || [],
              gaps: matchResult.gaps || [],
              suggestions: matchResult.suggestions || [],
            }
          : null;

        const tailoredResume = results.tailoredResume || null;
        const coverLetter = results.coverLetter || null;
        const coldEmail = results.coldEmail || null;

        // 4. Update the Application record with outputs and status "completed"
        await prisma.application.update({
          where: { id: application.id },
          data: {
            status: "completed",
            parsedJob,
            matchScore,
            matchAnalysis,
            tailoredResume,
            coverLetter,
            coldEmail,
          },
        });
        console.log(`[Pipeline] Background pipeline completed successfully for application: ${application.id}`);
      } catch (pipelineError) {
        console.error(`[Pipeline] Error in background execution for application ${application.id}:`, pipelineError);
        await prisma.application.update({
          where: { id: application.id },
          data: {
            status: "failed",
          },
        });
      }
    })();

  } catch (error) {
    console.error("Error in runOneClickApply controller:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ====================== Get Specific Application ======================
export const getApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return res.status(404).json({ msg: "Application record not found." });
    }

    return res.status(200).json({ application });
  } catch (error) {
    console.error("Error in getApplication:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ====================== Get All Applications ======================
export const getAllApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        matchScore: true,
        createdAt: true,
        updatedAt: true,
        // Exclude large text fields for list view performance
        parsedJob: true,
      },
    });

    return res.status(200).json({
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("Error in getAllApplications:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ====================== Delete Application ======================
export const deleteApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return res.status(404).json({ msg: "Application not found or unauthorized." });
    }

    await prisma.application.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "Application record deleted successfully." });
  } catch (error) {
    console.error("Error in deleteApplication:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ====================== Compile Tailored Resume LaTeX to PDF ======================
export const compileApplicationResumeToPdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return res.status(404).json({ msg: "Application not found." });
    }

    if (!application.tailoredResume) {
      return res.status(400).json({ msg: "No tailored LaTeX resume found for this application." });
    }

    console.log("Compiling LaTeX to PDF for application resume:", id);

    await compileLatexAndSendPdf(application.tailoredResume, `tailored_resume_${id}.pdf`, res);
  } catch (error) {
    console.error("Error compiling LaTeX for application:", error.message);
    return res.status(500).json({
      msg: "Failed to compile LaTeX to PDF",
      error: error.message,
    });
  }
};
