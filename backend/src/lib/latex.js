import axios from "axios";

/**
 * Compile LaTeX code to PDF using the LaTeX.online API and send it as an HTTP response.
 *
 * @param {string} latexCode  - Raw LaTeX source to compile
 * @param {string} filename   - Filename for the Content-Disposition header (e.g. "resume_abc123.pdf")
 * @param {import("express").Response} res - Express response object
 */
export async function compileLatexAndSendPdf(latexCode, filename, res) {
  const response = await axios.post(
    "https://latex.ytotech.com/builds/sync",
    {
      compiler: "pdflatex",
      resources: [
        {
          main: true,
          content: latexCode,
        },
      ],
    },
    {
      responseType: "arraybuffer",
      headers: { "Content-Type": "application/json" },
      timeout: 60000, // 60-second timeout for compilation
    }
  );

  // Validate that the response is actually a PDF
  const pdfBuffer = Buffer.from(response.data);
  const pdfSignature = pdfBuffer.slice(0, 4).toString();

  if (pdfSignature !== "%PDF") {
    const errorMessage = pdfBuffer.toString("utf8");
    console.error("LaTeX compilation error:", errorMessage);
    return res.status(400).json({
      msg: "LaTeX compilation failed",
      error: errorMessage.substring(0, 500),
    });
  }

  // Send the PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", pdfBuffer.length);
  res.send(pdfBuffer);
}
