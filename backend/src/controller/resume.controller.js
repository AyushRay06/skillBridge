
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import prisma from "../lib/prisma.js";
import { parseJsonField } from "../lib/helpers.js";

const ai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelayMs = 2000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.log(`Rate limited. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// Use template literal with proper escaping
const LATEX_TEMPLATE = String.raw`\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}
\usepackage{fontawesome}
\usepackage{graphicx}
\pagestyle{fancy}
\fancyhf{} 
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.75in}
\addtolength{\evensidemargin}{-0.75in}
\addtolength{\textwidth}{1.3in}
\addtolength{\topmargin}{-0.8in}
\addtolength{\textheight}{1.2in}
\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0.02in}

\titleformat{\section}{
  \vspace{-12pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-6pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-5pt}}
  }
}
\newcommand{\resumeSubheading}[4]{
  \vspace{-4pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{\footnotesize #1} & \footnotesize #2 \\
      \textit{\scriptsize #3} & \textit{\scriptsize #4}  \\
    \end{tabular*}\vspace{-5.4pt}
}
\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\scriptsize #1} & \textit{\scriptsize #2} \\
    \end{tabular*}\vspace{-6pt}
}
\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \scriptsize #1 & \scriptsize #2  \\
    \end{tabular*}\vspace{-6pt}
}
\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-3pt}}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-4pt}}

\begin{document}
\begin{center}
    \textbf{\Huge \scshape [FULL NAME]} \\ \vspace{1pt}
    \small [PHONE] $|$ \href{mailto:[EMAIL]}{ \underline{[EMAIL]}} $|$ 
    \href{[PORTFOLIO URL]}{ \underline{[PORTFOLIO TEXT]}} $|$
    \href{[GITHUB URL]}{\underline{[GITHUB TEXT]}} $|$
    \href{[LINKEDIN URL]}{ \underline{[LINKEDIN TEXT]}} 
\end{center}

\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small
    \item \textbf{Languages:} [LANGUAGE SKILLS]
    \item \textbf{Frontend:} [FRONTEND SKILLS]
    \item \textbf{Backend:} [BACKEND SKILLS]
    \item \textbf{Tools:} [TOOLS SKILLS]
    \item \textbf{Database:} [DATABASE SKILLS]
 \end{itemize}

\section{Experience}
  \resumeSubHeadingListStart
[EXPERIENCE CONTENT]
  \resumeSubHeadingListEnd

\section{Projects}
    \resumeSubHeadingListStart
[PROJECTS CONTENT]
    \resumeSubHeadingListEnd

\section{Achievements and Volunteering Contributions}
[ACHIEVEMENTS CONTENT]

\section{Education}
  \resumeSubHeadingListStart
       \resumeSubheading
  {[DEGREE]}{[DATE]}
  {[UNIVERSITY]}{[LOCATION]}
  \resumeSubHeadingListEnd

\end{document}`;

// File Reader
function loadLatexTemplate() {
  // For Vercel/production, use inline template
  if (process.env.NODE_ENV === "production") {
    return LATEX_TEMPLATE;
  }

  // For local dev, try to read from file, fallback to inline
  try {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      "resume.tex"
    );

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, "utf8");
    } else {
      return LATEX_TEMPLATE;
    }
  } catch (error) {
    console.error("Error loading LaTeX template:", error.message);
    return LATEX_TEMPLATE;
  }
}

// Helper function to format arrays for the prompt
function formatArrayForPrompt(data, title) {
  // Handle empty or missing data
  if (!data || data.length === 0) return `${title}: Not provided\n`;

  // Handle string data (might be JSON strings)
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return `${title}: ${data}\n`;
    }
  }

  // Start building the result with the title
  let result = `${title}:\n`;

  // Process each item in the array
  data.forEach((item, index) => {
    result += `  ${index + 1}. `;

    if (typeof item === "object") {
      // Handle object items (like experience, projects, education)
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          result += `${key}: ${value.join(", ")}\n     `;
        } else {
          result += `${key}: ${value}\n     `;
        }
      });
    } else {
      // Handle simple values (like skills)
      result += `${item}\n`;
    }
  });

  return result + "\n";
}

// ======================Create Resume==========================
export const createResume = async (req, res) => {
  try {
    const {
      title,
      fullName,
      phone,
      email,
      github,
      linkedin,
      portfolio,
      skills,
      experience,
      projects,
      education,
      achievements,
      jobDescription,
    } = req.body;

    const userId = req.user.id;

    if (!fullName || !userId) {
      return res
        .status(400)
        .json({ msg: "Required Fields: fullName and userId" });
    }

    const resumeInfo = await prisma.resume.create({
      data: {
        title: title || "",
        fullName,
        phone: phone || "",
        email: email || "",
        github: github || "",
        linkedin: linkedin || "",
        portfolio: portfolio || "",
        skills: JSON.stringify(skills || []),
        experience: JSON.stringify(experience || []),
        projects: JSON.stringify(projects || []),
        education: JSON.stringify(education || []),
        achievements: JSON.stringify(achievements || []), // NEW FIELD
        jobDescription: jobDescription || "",
        userId: userId, // Connect to the user
      },
    });
    // Parse the JSON strings back to objects for the AI prompt
    const skillsData = parseJsonField(skills);
    const experienceData = parseJsonField(experience);
    const projectsData = parseJsonField(projects);
    const educationData = parseJsonField(education);
    const achievementsData = parseJsonField(achievements);

    const userDetailsString = `
  Personal Information:
  - Name: ${fullName}
  - Phone: ${phone}
  - Email: ${email}
  - Portfolio: ${portfolio}
  - GitHub: ${github}
  - LinkedIn: ${linkedin}

  ${formatArrayForPrompt(skillsData, "TECHNICAL SKILLS")}

  ${formatArrayForPrompt(experienceData, "EXPERIENCE")}
  Note: Each experience entry includes: title, company, location, and duration.

  ${formatArrayForPrompt(projectsData, "PROJECTS")}
  Note: Each project entry includes: name, technologies, and description.

  ${formatArrayForPrompt(educationData, "EDUCATION")}

  ${formatArrayForPrompt(achievementsData, "ACHIEVEMENTS & CERTIFICATIONS")}
  Note: Each achievement entry includes: title, description, and date. This section is OPTIONAL - only include if data is provided.
  `;

    const systemPrompt = `You are an ATS Resume Generator. Your task is to create resumes using ONLY the exact LaTeX template provided below. You must replace the placeholder content with user information, you can rephrase the user information to make it more professional and ATS friendly. If the content provided by the user is short try to elaborate it by using job description and overall user information, you can exaggerate a little to make the resume look impressive but at the same time ATS friendly against the job description provided. BUT, DON'T CHANGE THE LATEX FORMATTING ie the LaTeX template provided.
    
      CRITICAL RULES:
      1. You MUST output ONLY the complete LaTeX code without any explanations, comments, or additional text
      2. You MUST use the EXACT LaTeX template provided below - no modifications to packages, commands, formatting, or structure
      3. You MUST preserve all custom commands (\\resumeItem, \\resumeSubheading, etc.) exactly as provided
      4. You MUST maintain the same section order and formatting style
      5. You MUST only replace content between the placeholder markers while keeping all LaTeX code intact
      6. You MUST tailor bullet points, skill ordering, and emphasis to match the SPECIFIC job description provided — each job should produce a DIFFERENT resume


  LATEX TEMPLATE:
  ${loadLatexTemplate()}
  

  PROCESSING INSTRUCTIONS:
    CRITICAL LATEX FORMATTING RULES: The output must be valid LaTeX code. Follow these rules precisely:

    PERCENTAGE SYMBOL ESCAPING (MOST CRITICAL):
    - EVERY SINGLE percentage symbol (%) MUST be escaped as \\% in LaTeX
    - This is MANDATORY for all percentage values in numbers like 25%, 30%, 40%, 95%, etc.
    - Example: "30% increase" MUST be written as "30\\% increase"
    - Example: "95% code coverage" MUST be written as "95\\% code coverage"
    - Example: "40% reduction" MUST be written as "40\\% reduction"
    - NEVER write a bare % symbol - it will cause LaTeX compilation errors
    - Double-check ALL numbers followed by percentage symbols and add backslash before %

    Math Mode: Place all mathematical symbols, variables, and formulas inside $...$.
    - Example: "the value of x_i" must become "the value of $x_i$".
 
    Escape Special Characters:
    - Percentage (%): ALWAYS use \\%. (e.g., "30%" -> "30\\%") - THIS IS THE MOST IMPORTANT RULE
    - Ampersand (&): Always use \\&. (e.g., "R&D" -> "R\\&D")
    - Hash/Pound (#): Always use \\#. (e.g., "C#" -> "C\\#")
    - Underscore (_): Outside of math mode, use \\_. (e.g., "variable_name" -> "variable\\_name")
    - Dollar Sign ($): Outside of math mode, use \\$. (e.g., "Cost $100" -> "Cost \\$100")

    1. Replace all placeholder content (text in [BRACKETS]) with user-specific information
    2. For experience, use the exact command structure: \\resumeSubheading{Job Title}{Duration}{Company}{Location}
    3. For projects, use the exact command structure: \\resumeProjectHeading{Project Name}{Technologies}
    4. \\resumeItemListStart and \\resumeItemListEnd for bullet points
    5. Each \\resumeItem should start with a strong action verb and include quantifiable metrics
    6. Maintain the exact same formatting, spacing, and command usage as the template
    7. **ACHIEVEMENTS SECTION** - This section is OPTIONAL and dynamic:
        \\section{[DYNAMIC SECTION NAME]}
        [ACHIEVEMENTS CONTENT]
        
        IMPORTANT INSTRUCTIONS FOR ACHIEVEMENTS:
          - **ONLY create this section if achievements content is provided by the user**
          - **If no achievements are provided, COMPLETELY REMOVE this entire section from the output**
          - Do not create empty achievement sections
          - Name the section based on the type of content provided
          - Use \\resumeItemListStart and \\resumeItemListEnd for achievement items
          - Format each achievement as: \\resumeItem{Achievement Title - Description (Date)}
        
        NAMING EXAMPLES:
        
        Example 1 - Achievements Only:
        If content contains: "Won 1st place at XYZ Hackathon 2024" or "Received Dean's List Award"
        Then use: \\section{Achievements}
        
        Example 2 - Certifications Only:
        If content contains: "AWS Certified Solutions Architect" or "Google Cloud Professional Certificate"
        Then use: \\section{Certifications}
        
          Example 3 - Volunteering Only:
        If content contains: "Volunteered at local food bank" or "Community organizer for tech workshops"
        Then use: \\section{Volunteering}
        
        Example 4 - Multiple Types (Combination):
        If content contains BOTH achievements and certifications:
        Then use: \\section{Achievements and Certifications}
        
        If content contains achievements, certifications, AND volunteering:
        Then use: \\section{Achievements, Certifications, and Volunteering}       
        
        If content contains volunteering and certifications:
        Then use: \\section{Certifications and Volunteering}
        
        GENERAL RULE:
        - Single type → Use that specific name
        - Multiple types → Combine names with "and" or commas
        - Always match the section name to what's actually in the content
        - **If NO content provided → DELETE the entire achievements section**
        
    8. Do not add, remove, or modify any LaTeX packages, commands, or formatting
    9. Output ONLY the complete LaTeX code with replaced content
    10. VERIFY that all percentage symbols are escaped before outputting

    `;

    // Build user prompt that includes BOTH the candidate profile AND the job description.
    // This ensures the LLM sees differentiated input for each job and produces a uniquely tailored resume.
    const userPrompt = `=== CANDIDATE PROFILE ===
${userDetailsString}

=== TARGET JOB DESCRIPTION ===
${jobDescription || "No specific job description provided. Generate a general-purpose professional resume."}

IMPORTANT: Tailor the resume specifically to this job description. Reorder skills to prioritize what this job needs. Rewrite experience bullet points to emphasize relevant accomplishments. Use keywords from the job description naturally throughout the resume.`;

    const response = await retryWithBackoff(async () => {
      return ai.chat.completions.create({
        model: "gemini-3-flash-preview",

        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });
    });

    let latexCode = response.choices[0].message.content;

    // Remove markdown code block syntax if present
    // This removes ```latex at the start and ``` at the end
    latexCode = latexCode.replace(/^```latex\s*/i, "").replace(/\s*```$/, "");
    // Also handle cases where it might just be ```
    latexCode = latexCode.replace(/^```\s*/, "").replace(/\s*```$/, "");

    // Post-processing: Ensure all percentage symbols are escaped
    // This regex finds % that are not already escaped (not preceded by \)
    latexCode = latexCode.replace(/(?<!\\)%/g, "\\%");

    const updatedResume = await prisma.resume.update({
      where: {
        id: resumeInfo.id,
      },
      data: {
        latexCode: latexCode,
      },
    });

    res.status(200).json({
      msg: "Resume created successfully.",
      latexCode,
      resumeId: updatedResume.id,
    });

  } catch (error) {
    console.error("Error in createResume:", error.message);
    res.status(500).json({ msg: "Internal server error." });
  }
};

// ============================Get Resume===========================

export const getResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!resume) {
      return res.status(404).json({ msg: "Resume not Found" });
    }

    res.status(200).json({
      latexCode: resume.latexCode,
    });
  } catch (error) {
    console.error("Error in getResume:", error.message);
    res.status(500).json({ msg: "Internal server error." });
  }
};

// ============================Get All User Resumes===========================

export const getAllUserResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await prisma.resume.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: "desc", // Most recently updated first
      },
      select: {
        id: true,
        title: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Don't send latexCode for list view (too much data)
      },
    });

    res.status(200).json({
      resumes,
      count: resumes.length,
    });
  } catch (error) {
    console.error("Error in getAllUserResumes:", error.message);
    res.status(500).json({ msg: "Internal server error." });
  }
};

// ============================Delete Resume===========================

export const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if resume exists and belongs to user
    const resume = await prisma.resume.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found or unauthorized" });
    }

    await prisma.resume.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ msg: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error in deleteResume:", error.message);
    res.status(500).json({ msg: "Internal server error." });
  }
};
