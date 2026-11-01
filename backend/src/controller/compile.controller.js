import "dotenv/config";
import prisma from "../lib/prisma.js";
import { compileLatexAndSendPdf } from "../lib/latex.js";

// Compile LaTeX to PDF using LaTeX.online API
export const compileLatexToPdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Fetch the resume from database
    const resume = await prisma.resume.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found" });
    }

    if (!resume.latexCode) {
      return res.status(400).json({ msg: "No LaTeX code available for this resume" });
    }

    console.log("Compiling LaTeX to PDF for resume:", id);

    await compileLatexAndSendPdf(resume.latexCode, `resume_${id}.pdf`, res);
  } catch (error) {
    console.error("Error compiling LaTeX:", error.message);

    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data?.toString?.() || error.response.data);
    }

    res.status(500).json({
      msg: "Failed to compile LaTeX to PDF",
      error: error.message,
    });
  }
};
