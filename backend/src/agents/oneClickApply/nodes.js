import fs from "fs";
import path from "path";
import { flashModel, proModel } from "../llm.js";
import { ParsedJobSchema, MatchResultSchema, ColdEmailSchema } from "./schemas.js";

// Helper function to format arrays for the resume prompt
function formatArrayForPrompt(data, title) {
  if (!data || data.length === 0) return `${title}: Not provided\n`;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return `${title}: ${data}\n`;
    }
  }

  let result = `${title}:\n`;
  data.forEach((item, index) => {
    result += `  ${index + 1}. `;
    if (typeof item === "object" && item !== null) {
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          result += `${key}: ${value.join(", ")}\n     `;
        } else {
          result += `${key}: ${value}\n     `;
        }
      });
    } else {
      result += `${item}\n`;
    }
  });

  return result + "\n";
}

// Helper to load the latex template
function loadLatexTemplate() {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      "resume.tex"
    );

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, "utf8");
    }
  } catch (error) {
    console.error("Error reading latex template in nodes:", error.message);
  }

  // Fallback inline template
  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}
\\usepackage{fontawesome}
\\usepackage{graphicx}
\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.75in}
\\addtolength{\\evensidemargin}{-0.75in}
\\addtolength{\\textwidth}{1.3in}
\\addtolength{\\topmargin}{-0.8in}
\\addtolength{\\textheight}{1.2in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0.02in}

\\titleformat{\\section}{
  \\vspace{-12pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-6pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-5pt}}
  }
}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-4pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\footnotesize #1} & \\footnotesize #2 \\\\
      \\textit{\\scriptsize #3} & \\textit{\\scriptsize #4}  \\\\
    \\end{tabular*}\\vspace{-5.4pt}
}
\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\scriptsize #1} & \\textit{\\scriptsize #2} \\\\
    \\end{tabular*}\\vspace{-6pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\scriptsize #1 & \\scriptsize #2  \\\\
    \\end{tabular*}\\vspace{-6pt}
}
\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-3pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-4pt}}

\\begin{document}
\\begin{center}
    \\textbf{\\Huge \\scshape [FULL NAME]} \\\\ \\vspace{1pt}
    \\small [PHONE] $|$ \\href{mailto:[EMAIL]}{ \\underline{[EMAIL]}} $|$ 
    \\href{[PORTFOLIO URL]}{ \\underline{[PORTFOLIO TEXT]}} $|$
    \\href{[GITHUB URL]}{\\underline{[GITHUB TEXT]}} $|$
    \\href{[LINKEDIN URL]}{ \\underline{[LINKEDIN TEXT]}} 
\\end{center}

\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small
    \\item \\textbf{Languages:} [LANGUAGE SKILLS]
    \\item \\textbf{Frontend:} [FRONTEND SKILLS]
    \\item \\textbf{Backend:} [BACKEND SKILLS]
    \\item \\textbf{Tools:} [TOOLS SKILLS]
    \\item \\textbf{Database:} [DATABASE SKILLS]
 \\end{itemize}

\\section{Experience}
  \\resumeSubHeadingListStart
[EXPERIENCE CONTENT]
  \\resumeSubHeadingListEnd

\\section{Projects}
    \\resumeSubHeadingListStart
[PROJECTS CONTENT]
    \\resumeSubHeadingListEnd

\\section{Achievements and Volunteering Contributions}
[ACHIEVEMENTS CONTENT]

\\section{Education}
  \\resumeSubHeadingListStart
       \\resumeSubheading
  {[DEGREE]}{[DATE]}
  {[UNIVERSITY]}{[LOCATION]}
  \\resumeSubHeadingListEnd

\\end{document}`;
}

// 1. parseJobNode
export async function parseJobNode(state) {
  try {
    const jobDescription = state.jobDescription;
    if (!jobDescription) {
      throw new Error("Job description is missing from the state.");
    }

    console.log("[parseJobNode] Extracting structured details from JD...");
    const modelWithStructuredOutput = flashModel.withStructuredOutput(ParsedJobSchema);
    
    const systemPrompt = `You are a technical recruiter. Parse the provided job description and extract key structured information. Identify the primary skills, keywords, responsibilities, and experience levels required. Make sure they are parsed accurately.`;
    
    const result = await modelWithStructuredOutput.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: jobDescription },
    ]);

    return { parsedJob: result };
  } catch (error) {
    console.error("Error in parseJobNode:", error);
    return { errors: [error.message] };
  }
}

// 2. scoreMatchNode
export async function scoreMatchNode(state) {
  if (state.errors?.length > 0) {
    console.log("[scoreMatchNode] Skipping due to prior errors.");
    return {};
  }
  try {
    const { parsedJob, userProfile } = state;
    if (!parsedJob) {
      throw new Error("Parsed job details are missing from state.");
    }
    if (!userProfile) {
      throw new Error("UserProfile is missing from state.");
    }

    console.log("[scoreMatchNode] Computing match analysis...");
    const modelWithStructuredOutput = flashModel.withStructuredOutput(MatchResultSchema);

    const systemPrompt = `You are an AI Matchmaker and ATS scorer. Compare the candidate's master user profile details with the parsed job requirements. Compute a match score (0 to 100), identify clear strengths, experience/skills gaps, and provide specific, actionable recommendations on what the candidate should emphasize or rephrase in their resume to bypass ATS filters.`;

    const userProfileString = JSON.stringify(userProfile);
    const parsedJobString = JSON.stringify(parsedJob);

    const result = await modelWithStructuredOutput.invoke([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Candidate Profile:\n${userProfileString}\n\nJob Requirements:\n${parsedJobString}`,
      },
    ]);

    return { matchResult: result };
  } catch (error) {
    console.error("Error in scoreMatchNode:", error);
    return { errors: [error.message] };
  }
}

// 3. tailorResumeNode
export async function tailorResumeNode(state) {
  if (state.errors?.length > 0) {
    console.log("[tailorResumeNode] Skipping due to prior errors.");
    return {};
  }
  try {
    const { userProfile, parsedJob, matchResult } = state;
    if (!userProfile) {
      throw new Error("UserProfile is missing from state.");
    }
    if (!parsedJob) {
      throw new Error("Parsed job description is missing from state.");
    }

    console.log("[tailorResumeNode] Tailoring LaTeX resume...");

    // Format profile fields
    const fullName = userProfile.fullName || "";
    const phone = userProfile.phone || "";
    const email = userProfile.email || "";
    const github = userProfile.github || "";
    const linkedin = userProfile.linkedin || "";
    const portfolio = userProfile.portfolio || "";

    const skills = typeof userProfile.skills === "string" ? JSON.parse(userProfile.skills) : userProfile.skills;
    const experience = typeof userProfile.experience === "string" ? JSON.parse(userProfile.experience) : userProfile.experience;
    const projects = typeof userProfile.projects === "string" ? JSON.parse(userProfile.projects) : userProfile.projects;
    const education = typeof userProfile.education === "string" ? JSON.parse(userProfile.education) : userProfile.education;
    const achievements = typeof userProfile.achievements === "string" ? JSON.parse(userProfile.achievements) : userProfile.achievements;

    const userDetailsString = `
  Personal Information:
  - Name: ${fullName}
  - Phone: ${phone}
  - Email: ${email}
  - Portfolio: ${portfolio}
  - GitHub: ${github}
  - LinkedIn: ${linkedin}

  ${formatArrayForPrompt(skills, "TECHNICAL SKILLS")}
  ${formatArrayForPrompt(experience, "EXPERIENCE")}
  Note: Each experience entry includes: title, company, location, and duration.
  ${formatArrayForPrompt(projects, "PROJECTS")}
  Note: Each project entry includes: name, technologies, and description.
  ${formatArrayForPrompt(education, "EDUCATION")}
  ${formatArrayForPrompt(achievements, "ACHIEVEMENTS & CERTIFICATIONS")}
  Note: Each achievement entry includes: title, description, and date.
  `;

    const systemPrompt = `You are an ATS Resume Generator. Your task is to create resumes using ONLY the exact LaTeX template provided below. You must replace the placeholder content with user information. Rephrase and tailor the candidate's achievements and details using the job requirements and match recommendations to make it highly relevant to the role, while maintaining factual alignment with the candidate's background. Elaborate where helpful using the job description.
    
    CRITICAL RULES:
    1. You MUST output ONLY the complete LaTeX code without any explanations, comments, or additional text
    2. You MUST use the EXACT LaTeX template provided below - no modifications to packages, commands, formatting, or structure
    3. You MUST preserve all custom commands (\\resumeItem, \\resumeSubheading, etc.) exactly as provided
    4. You MUST maintain the same section order and formatting style
    5. You MUST only replace content between the placeholder markers while keeping all LaTeX code intact
    6. You MUST tailor bullet points, skill ordering, and emphasis to match the SPECIFIC job requirements provided — each job should produce a DIFFERENT resume

    LATEX TEMPLATE:
    ${loadLatexTemplate()}
    
    PROCESSING INSTRUCTIONS:
    CRITICAL LATEX FORMATTING RULES: The output must be valid LaTeX code. Follow these rules precisely:

    PERCENTAGE SYMBOL ESCAPING (MOST CRITICAL):
    - EVERY SINGLE percentage symbol (%) MUST be escaped as \\% in LaTeX
    - This is MANDATORY for all percentage values in numbers like 25%, 30%, 40%, 95%, etc.
    - Example: "30% increase" MUST be written as "30\\% increase"
    - NEVER write a bare % symbol - it will cause LaTeX compilation errors
    - Double-check ALL numbers followed by percentage symbols and add backslash before %

    Escape Special Characters:
    - Percentage (%): ALWAYS use \\%.
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
    7. ACHIEVEMENTS SECTION - This section is OPTIONAL and dynamic. If no achievements are provided, COMPLETELY REMOVE this entire section from the output.
    `;

    // Build job-specific user prompt that includes BOTH the candidate profile AND the target job details.
    // This ensures the LLM sees differentiated input for each job and produces a uniquely tailored resume.
    const userPrompt = `=== CANDIDATE PROFILE ===
${userDetailsString}

=== TARGET JOB REQUIREMENTS ===
${JSON.stringify(parsedJob, null, 2)}

=== MATCH ANALYSIS & RECOMMENDATIONS (use these to decide what to emphasize) ===
${JSON.stringify(matchResult || {}, null, 2)}

IMPORTANT: Tailor the resume specifically to this job. Reorder skills to prioritize what this job needs. Rewrite experience bullet points to emphasize relevant accomplishments. Use keywords from the job requirements naturally throughout the resume.`;

    const response = await proModel.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    let latexCode = response.content;

    // Clean markdown codeblocks
    latexCode = latexCode.replace(/^```latex\s*/i, "").replace(/\s*```$/, "");
    latexCode = latexCode.replace(/^```\s*/, "").replace(/\s*```$/, "");

    // Escapes unescaped %
    latexCode = latexCode.replace(/(?<!\\)%/g, "\\%");

    return { tailoredResume: latexCode };
  } catch (error) {
    console.error("Error in tailorResumeNode:", error);
    return { errors: [error.message] };
  }
}

// 4. generateCoverLetterNode
export async function generateCoverLetterNode(state) {
  if (state.errors?.length > 0) {
    console.log("[generateCoverLetterNode] Skipping due to prior errors.");
    return {};
  }
  try {
    const { userProfile, parsedJob, matchResult } = state;
    if (!userProfile) {
      throw new Error("UserProfile is missing from state.");
    }
    if (!parsedJob) {
      throw new Error("Parsed job is missing from state.");
    }

    console.log("[generateCoverLetterNode] Generating tailored cover letter...");

    const systemPrompt = `You are a professional resume writer and career coach. Write a highly compelling, beautifully tailored cover letter (around 300-400 words) for the candidate. Rephrase and highlight their matching skills, relevant achievements, and unique strengths. Express strong enthusiasm for the role and company. Use a professional, elegant, and persuasive tone. Keep it in clean, standard plain text format.`;

    const candidateSummary = `
      Name: ${userProfile.fullName}
      Email: ${userProfile.email}
      Phone: ${userProfile.phone || ""}
      Skills: ${JSON.stringify(userProfile.skills)}
      Experience Summary: ${JSON.stringify(userProfile.experience || [])}
    `;

    const response = await proModel.invoke([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Candidate Information:\n${candidateSummary}\n\nJob Target:\n${JSON.stringify(parsedJob)}\n\nMatch Context:\n${JSON.stringify(matchResult || {})}`,
      },
    ]);

    return { coverLetter: response.content };
  } catch (error) {
    console.error("Error in generateCoverLetterNode:", error);
    return { errors: [error.message] };
  }
}

// 5. draftColdEmailNode
export async function draftColdEmailNode(state) {
  if (state.errors?.length > 0) {
    console.log("[draftColdEmailNode] Skipping due to prior errors.");
    return {};
  }
  try {
    const { userProfile, parsedJob } = state;
    if (!userProfile) {
      throw new Error("UserProfile is missing from state.");
    }
    if (!parsedJob) {
      throw new Error("Parsed job details are missing from state.");
    }

    console.log("[draftColdEmailNode] Drafting cold outreach email...");
    const modelWithStructuredOutput = flashModel.withStructuredOutput(ColdEmailSchema);

    const systemPrompt = `You are an expert cold recruiter and outreach strategist. Draft a brief, punchy, and highly persuasive cold outreach email (subject and body) that the candidate can send to a hiring manager or recruiter at the company. Highlight 1-2 key accomplishments that align directly with the role. Ensure it is short, professional, and has a clear call to action. Keep recipient names and specific company details as clear placeholders (e.g. [Hiring Manager], [Company]) if not known.`;

    const candidateSummary = `
      Name: ${userProfile.fullName}
      Skills: ${JSON.stringify(userProfile.skills)}
      Experience Summary: ${JSON.stringify(userProfile.experience || [])}
    `;

    const result = await modelWithStructuredOutput.invoke([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Candidate summary:\n${candidateSummary}\n\nTarget Job:\n${JSON.stringify(parsedJob)}`,
      },
    ]);

    return { coldEmail: result };
  } catch (error) {
    console.error("Error in draftColdEmailNode:", error);
    return { errors: [error.message] };
  }
}
