/**
 * Career Guide AI Agent
 *
 * Tool-calling agent using LangChain + Gemini.
 * Accepts { message, conversationHistory, userProfile, language } and returns
 * { textContent, cardPayload }.
 *
 * Max 3 tool-call iterations to keep latency reasonable for hackathon.
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { flashModel, proModel } from "../llm.js";
import prisma from "../../lib/prisma.js";
import { searchAllSources } from "../autopilot/jobSearch.js";

// ─── Skill normalisation ──────────────────────────────────────────────────────

const ALIASES = {
  "js": "javascript",
  "reactjs": "react",
  "nodejs": "node.js",
  "ts": "typescript",
  "py": "python",
  "ml": "machine learning",
  "db": "database",
  "k8s": "kubernetes",
  "css3": "css",
  "html5": "html",
  "vuejs": "vue",
  "angularjs": "angular",
  "expressjs": "express",
  "nextjs": "next.js",
  "psql": "postgresql",
  "postgres": "postgresql",
  "mongo": "mongodb",
  "tf": "tensorflow",
  "pt": "pytorch",
};

function normaliseSkill(s) {
  const lower = s.toLowerCase().trim().replace(/\s+/g, " ");
  return ALIASES[lower] || lower;
}

// ─── Match score computation (always in code, never in LLM) ──────────────────

function computeMatchScore(userSkills, roleSkills) {
  const normUserSkills = userSkills.map(normaliseSkill);
  let totalWeight = 0;
  let matchedWeight = 0;
  const matched = [];
  const missing = [];

  for (const rs of roleSkills) {
    const normSkill = normaliseSkill(rs.skill);
    totalWeight += rs.weight;
    if (normUserSkills.includes(normSkill)) {
      matchedWeight += rs.weight;
      matched.push(rs.skill);
    } else {
      missing.push({ skill: rs.skill, weight: rs.weight, required: rs.required });
    }
  }

  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  const priorityMissing = missing
    .sort((a, b) => b.weight - a.weight)
    .map((m) => m.skill);

  return { score, matched, priorityMissing };
}

// ─── JSON parse helper ────────────────────────────────────────────────────────

function safeJsonParse(text) {
  if (!text || typeof text !== "string") return null;

  // Strategy 1: Direct parse or direct code fence trim
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {}

  // Strategy 2: Extract between ```json ... ``` code fence anywhere in the string
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      try {
        const withoutTrailingCommas = fenceMatch[1].trim().replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(withoutTrailingCommas);
      } catch {}
    }
  }

  // Strategy 3: Find outermost { ... }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const sub = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(sub);
    } catch {
      try {
        const withoutTrailingCommas = sub.replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(withoutTrailingCommas);
      } catch {}
    }
  }

  // Strategy 4: Find outermost [ ... ]
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const sub = text.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(sub);
    } catch {
      try {
        const withoutTrailingCommas = sub.replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(withoutTrailingCommas);
      } catch {}
    }
  }

  return null;
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const extractResumeProfileTool = tool(
  async ({ resumeText }) => {
    const prompt = `You are a resume parser. Extract structured information from the resume text below.
Return ONLY valid JSON matching this schema exactly:
{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "skills": string[],
  "experience": [{"title": string, "company": string, "duration": string, "description": string}],
  "education": [{"degree": string, "institution": string, "year": string}],
  "projects": [{"name": string, "tech": string, "description": string}],
  "achievements": string[]
}

Resume text:
${resumeText.slice(0, 8000)}`;

    const result = await flashModel.invoke([new HumanMessage(prompt)]);
    const parsed = safeJsonParse(result.content);

    if (!parsed) {
      return JSON.stringify({
        error: "Could not parse resume",
        cardPayload: null,
      });
    }

    return JSON.stringify({
      profile: parsed,
      cardPayload: {
        type: "resume_summary",
        data: parsed,
      },
    });
  },
  {
    name: "extract_resume_profile",
    description: "Extract structured profile information from raw resume text",
    schema: z.object({
      resumeText: z.string().describe("The raw text content of the resume"),
    }),
  }
);

const recommendRolesTool = tool(
  async ({ skills, interests, language }) => {
    // Load all roles + skills from DB
    const roles = await prisma.cGRole.findMany({
      include: { skills: true },
    });

    // Compute match scores in code
    const scored = roles.map((role) => {
      const { score, matched, priorityMissing } = computeMatchScore(skills, role.skills);
      const missingSkills = priorityMissing;
      return { role, score, matched, missingSkills };
    });

    // Top 5 by score
    const top5 = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Ask LLM to write personalised explanations
    const rolesForPrompt = top5.map((r) => ({
      name: r.role.name,
      score: r.score,
      matched: r.matched,
      missing: r.missingSkills.slice(0, 5),
      description: r.role.description,
    }));

    const explainPrompt = `You are a career consultant. For each of the following career matches, write a warm, encouraging 1-2 sentence personalised explanation of WHY this role suits the candidate.
Reply language: ${language || "en"}.
User skills: ${skills.join(", ")}
User interests: ${(interests || []).join(", ")}

Roles:
${JSON.stringify(rolesForPrompt, null, 2)}

Return ONLY valid JSON array:
[{"roleName": string, "why": string}]`;

    const explainResult = await flashModel.invoke([new HumanMessage(explainPrompt)]);
    const explanations = safeJsonParse(explainResult.content) || [];
    const explainMap = Object.fromEntries(
      explanations.map((e) => [e.roleName, e.why])
    );

    const recommendations = top5.map((r) => {
      const localizedName =
        language === "as"
          ? r.role.nameAssamese || r.role.name
          : language === "hi"
          ? r.role.nameHindi || r.role.name
          : r.role.name;

      return {
        roleId: r.role.id,
        roleName: r.role.name,
        roleNameLocalized: localizedName,
        score: r.score,
        matchedSkills: r.matched,
        missingSkills: r.missingSkills,
        why: explainMap[r.role.name] || r.role.description,
      };
    });

    return JSON.stringify({
      recommendations,
      cardPayload: {
        type: "role_recommendations",
        data: recommendations,
      },
    });
  },
  {
    name: "recommend_roles",
    description: "Recommend career roles based on the user's skills and interests",
    schema: z.object({
      skills: z.array(z.string()).describe("List of user's current skills"),
      interests: z.array(z.string()).optional().describe("List of user's career interests"),
      language: z.string().optional().describe("Language code: en | as | hi"),
    }),
  }
);

const analyseSkillGapTool = tool(
  async ({ roleName, userSkills }) => {
    // Find role by name (case-insensitive)
    const role = await prisma.cGRole.findFirst({
      where: { name: { equals: roleName, mode: "insensitive" } },
      include: { skills: true },
    });

    if (!role) {
      return JSON.stringify({
        error: `Role "${roleName}" not found in database`,
        cardPayload: null,
      });
    }

    const { matched, priorityMissing } = computeMatchScore(userSkills, role.skills);

    const result = {
      roleName: role.name,
      haveSkills: matched,
      missingSkills: priorityMissing,
      priorityMissing: priorityMissing.slice(0, 5),
    };

    return JSON.stringify({
      gap: result,
      cardPayload: {
        type: "skill_gap",
        data: result,
      },
    });
  },
  {
    name: "analyse_skill_gap",
    description: "Analyse the skill gap between the user's current skills and a target role",
    schema: z.object({
      roleName: z.string().describe("The name of the target role"),
      userSkills: z.array(z.string()).describe("List of user's current skills"),
    }),
  }
);

const reviewResumeTool = tool(
  async ({ resumeProfile, reviewType = "general", targetRole, jobDescription }) => {
    let modeInstruction = "";
    if (reviewType === "job_role" && targetRole) {
      modeInstruction = `REVIEW MODE: SPECIFIC JOB ROLE AUDIT (Target Role: "${targetRole}")
- Assess how well this candidate's resume specifically aligns with and qualifies for the role: "${targetRole}".
- Analyze role relevance, required tech stack / domain competency, project depth, and role fit.
- Identify "matchedSkills": skills in the resume that directly match "${targetRole}".
- Identify "missingSkills": essential skills/competencies required for "${targetRole}" that are absent from the resume.
- Provide 5-7 actionable, high-impact suggestions to tailor this resume specifically for "${targetRole}".`;
    } else if (reviewType === "job_description" && jobDescription) {
      modeInstruction = `REVIEW MODE: SPECIFIC JOB DESCRIPTION AUDIT & KEYWORD MATCH
Target Job Description:
"""
${jobDescription.slice(0, 4500)}
"""
- Perform an exhaustive keyword, qualification, and ATS audit between the resume and this job description.
- Calculate an accurate "matchPercentage" (0-100) reflecting hard skills, qualifications, and domain terms present.
- Identify "matchedKeywords": essential keywords, technologies, and methodologies found in both.
- Identify "missingKeywords": critical keywords and requirements from the job description that are missing from the resume.
- Provide 5-7 actionable suggestions on how to incorporate missing keywords and tailor bullet points for this specific JD.`;
    } else {
      modeInstruction = `REVIEW MODE: GENERAL RESUME REVIEW
- Assess overall resume excellence: clarity, layout structure, technical depth, project impact, and ATS friendliness.
- Highlight standout strengths and identify vague, weak, or unquantified bullet points.
- Provide 5-7 actionable, practical suggestions covering the complete scope of improvement to make the resume competitive.`;
    }

    const prompt = `You are an expert technical recruiter, hiring manager, and senior resume auditor.
Conduct a rigorous, professional analysis of the following candidate resume profile.

${modeInstruction}

Candidate Profile:
${JSON.stringify(resumeProfile, null, 2)}

Return ONLY valid JSON matching this schema:
{
  "reviewType": "${reviewType}",
  "targetRole": ${targetRole ? `"${targetRole}"` : "null"},
  "overallRating": number (1-10, can have 1 decimal place e.g. 8.2),
  "matchPercentage": ${reviewType === "job_description" ? "number (0-100)" : "null"},
  "summary": string (2-3 sentences concise executive assessment),
  "breakdown": {
    "clarity": number (1-10),
    "skills": number (1-10),
    "projectImpact": number (1-10),
    "structure": number (1-10),
    "atsFriendliness": number (1-10),
    "roleRelevance": number (1-10)
  },
  "matchedSkills": ${reviewType === "job_role" ? "string[]" : "null"},
  "missingSkills": ${reviewType === "job_role" ? "string[]" : "null"},
  "matchedKeywords": ${reviewType === "job_description" ? "string[]" : "null"},
  "missingKeywords": ${reviewType === "job_description" ? "string[]" : "null"},
  "strengths": string[] (3-4 concise strong points),
  "suggestions": string[] (5-7 actionable, highly specific improvements)
}`;

    const result = await proModel.invoke([new HumanMessage(prompt)]);
    const review = safeJsonParse(result.content);

    if (!review) {
      return JSON.stringify({
        error: "Could not generate review",
        cardPayload: null,
      });
    }

    review.reviewType = reviewType;
    if (targetRole) review.targetRole = targetRole;

    return JSON.stringify({
      review,
      cardPayload: {
        type: "resume_review",
        data: review,
      },
    });
  },
  {
    name: "review_resume",
    description: "Provide a detailed analysis and review of the user's resume in one of three modes: 'general', 'job_role' (reviewed against a specific target role like Frontend Developer, Sales Manager, etc.), or 'job_description' (reviewed against a specific job description for keyword match and ATS fit).",
    schema: z.object({
      resumeProfile: z.object({}).passthrough().describe("The structured resume profile object"),
      reviewType: z.enum(["general", "job_role", "job_description"]).optional().describe("Review mode: general | job_role | job_description"),
      targetRole: z.string().optional().describe("Target career role (e.g. 'Full Stack Developer', 'Sales Manager') if reviewType is job_role"),
      jobDescription: z.string().optional().describe("Job description text if reviewType is job_description"),
    }),
  }
);

const generateRoadmapTool = tool(
  async ({ targetRole, targetSkill, hoursPerWeek, language }) => {
    const focus = (targetRole || targetSkill || "Software Engineering").trim();

    const structurePrompt = `You are a principal engineer and lead curriculum designer (authoritative, precise, zero-slop educator).
Design an authentic, industry-standard, strictly sequential learning roadmap for: "${focus}".

CRITICAL DOMAIN PURITY & WORKFLOW INSTRUCTIONS (DO NOT VIOLATE):
1. STRICT DOMAIN ISOLATION & RELEVANCE:
   - The roadmap must ONLY cover topics, tools, and concepts that belong specifically to "${focus}".
   - DO NOT contaminate the roadmap with unrelated domains, random buzzwords, or out-of-scope technologies!
   - Domain examples:
     * If "${focus}" is Frontend Developer:
       Steps MUST cover:
       Step 1: HTML5 & Semantic Web (Accessibility, DOM structure, SEO fundamentals)
       Step 2: Modern CSS & Responsive Layouts (Flexbox, CSS Grid, Responsive Design, CSS Variables)
       Step 3: JavaScript Core & Async (ES6+, Scopes, Closures, DOM Manipulation, Promises, Fetch API)
       Step 4: Modern Component Framework (React fundamentals, Hooks, Component Lifecycle, State Management)
       Step 5: Frontend Ecosystem & Tooling (TypeScript, Tailwind CSS, Next.js / Vite build tooling)
       Step 6: Frontend Performance, Testing & Capstone Project (Lighthouse, Core Web Vitals, Jest/RTL, Portfolio Project)
       NEVER include: Docker, Kubernetes, CI/CD, DevOps, AWS Infra, Microservices, Python backend, or server provisioning!
     * If "${focus}" is Full Stack Developer:
       Steps MUST logically balance:
       Step 1: Frontend Core (HTML, CSS, Modern JavaScript)
       Step 2: Frontend Framework (React, State Management, UI libraries)
       Step 3: Backend Runtime & APIs (Node.js, Express, RESTful API design)
       Step 4: Relational Databases & ORM (PostgreSQL, Schema Design, Prisma / SQL queries)
       Step 5: Authentication & Security (JWT, OAuth, Session Handling, Input Validation)
       Step 6: Full-Stack Integration, Deployment & Production Capstone Project
     * If "${focus}" is Backend Developer:
       Steps MUST cover:
       Step 1: Programming Language Mastery (Node.js/TypeScript, Python, or Go)
       Step 2: Web Servers & REST/GraphQL API Design
       Step 3: Relational Databases & SQL Optimization (PostgreSQL, Indexing, Transactions)
       Step 4: Caching, Queues & Asynchronous Processing (Redis, BullMQ / Message Brokers)
       Step 5: API Security, Auth & Best Practices (Rate limiting, CORS, JWT, OWASP)
       Step 6: Server Architecture, Testing & Production Deployment
2. STRICT SEQUENTIAL ORDER:
   - Steps must be logically ordered from foundational prerequisites (Step 1) to intermediate application, advanced architecture, and capstone.
   - Step N must naturally build upon Step N-1.
3. CONCRETE ACTIONABLE CONTENT & RESOURCES:
   - "whatToLearn": 2-3 detailed sentences specifying exact technologies, patterns, and concepts.
   - "whyItMatters": 1-2 motivating sentences explaining why real-world tech companies expect this.
   - "resources": 2-3 genuine, top-tier free/official documentation or tutorial links (e.g., MDN Web Docs, React Docs, Nodejs.org, FreeCodeCamp, TypeScript Handbook).
4. STRICT TIME REMOVAL (NO TIME INDICATORS):
   - Exactly 5 to 7 sequential steps.
   - DO NOT include ANY duration, weeks, days, or time estimates anywhere. Roadmaps are milestone and mastery based.

Return ONLY valid JSON matching this schema:
{
  "title": "${focus} Roadmap",
  "targetRole": "${focus}",
  "targetSkill": null,
  "steps": [
    {
      "stepNumber": number,
      "title": string,
      "whatToLearn": string,
      "whyItMatters": string,
      "resources": [{"label": string, "url": string}]
    }
  ]
}`;

    const structureResult = await proModel.invoke([new HumanMessage(structurePrompt)]);
    const roadmap = safeJsonParse(structureResult.content);

    if (!roadmap) {
      return JSON.stringify({
        error: "Could not generate roadmap",
        cardPayload: null,
      });
    }

    // If non-English, translate step descriptions
    if (language && language !== "en") {
      const translatePrompt = `Translate the following JSON roadmap step descriptions to ${language === "as" ? "Assamese" : "Hindi"}.
Only translate the "whatToLearn", "whyItMatters", and "title" fields. Keep all other fields (urls, resource labels, numbers) unchanged.
Return ONLY valid JSON array with the same structure.

Steps to translate:
${JSON.stringify(roadmap.steps, null, 2)}`;

      const translateResult = await proModel.invoke([new HumanMessage(translatePrompt)]);
      const translatedSteps = safeJsonParse(translateResult.content);
      if (translatedSteps && Array.isArray(translatedSteps)) {
        roadmap.steps = translatedSteps;
      }
    }

    roadmap.targetRole = targetRole || null;
    roadmap.targetSkill = targetSkill || null;
    roadmap.estimatedWeeks = null;
    if (Array.isArray(roadmap.steps)) {
      roadmap.steps = roadmap.steps.map((st) => ({
        ...st,
        estimatedDays: null,
      }));
    }

    return JSON.stringify({
      roadmap,
      cardPayload: {
        type: "roadmap",
        data: roadmap,
      },
    });
  },
  {
    name: "generate_roadmap",
    description: "Generate a pure, structured, sequential step-by-step learning roadmap for a target role or topic (e.g. 'Frontend Developer', 'Full Stack Developer', 'Data Science'). Focused strictly on the requested subject with zero out-of-scope fluff.",
    schema: z.object({
      targetRole: z.string().optional().describe("The target career role (e.g. 'Frontend Developer')"),
      targetSkill: z.string().optional().describe("A specific skill to learn (e.g. 'React')"),
      hoursPerWeek: z.number().optional().describe("Hours available per week for learning"),
      language: z.string().optional().describe("Language code: en | as | hi"),
    }),
  }
);

const findJobsTool = tool(
  async ({ roleName = "Software Engineer", location }) => {
    try {
      const targetRole = roleName?.trim() || "Software Engineer";
      const queries = [location ? `${targetRole} in ${location}` : targetRole];
      const jobs = await searchAllSources(queries, {}, 6);

      const simplifiedJobs = (jobs || []).slice(0, 5).map((j) => ({
        title: j.title,
        company: j.company,
        location: j.location || "Remote / Various",
        salary: j.salary || null,
        url: j.url || null,
        source: j.source,
      }));

      return JSON.stringify({
        roleName: targetRole,
        totalFound: simplifiedJobs.length,
        jobs: simplifiedJobs,
        cardPayload: {
          type: "job_matches",
          data: {
            role: targetRole,
            jobs: simplifiedJobs,
          },
        },
      });
    } catch (err) {
      console.error("[CG Agent] findJobsTool error:", err.message);
      return JSON.stringify({ error: "Failed to search for jobs", cardPayload: null });
    }
  },
  {
    name: "find_jobs",
    description: "Search live job openings for a specific career role or title. If no role is specified, searches for matching openings based on candidate profile.",
    schema: z.object({
      roleName: z.string().optional().describe("The job title or role name to search for (e.g. 'Frontend Developer', 'Software Engineer')"),
      location: z.string().optional().describe("Optional location filter e.g. 'India', 'Remote', 'Bangalore', 'Assam'"),
    }),
  }
);

const mockInterviewTool = tool(
  async ({ topic, roleName, questionNumber = 1, totalQuestions = 5, questionType, previousAnswer = null, language = "en" }) => {
    const focusTopic = (topic || roleName || "Software Engineering").trim();
    const typePref = questionType || "any";

    const prompt = `You are an expert technical and domain interviewer for: "${focusTopic}".
Language: ${language} (reply in this language).
Session Status: Question ${questionNumber} of ${totalQuestions}.
Question format preference: ${typePref}.

${previousAnswer ? `Candidate's previous answer:\n"${previousAnswer}"\nProvide 1-2 concise, constructive sentences evaluating their previous answer strictly in "feedbackOnPrevious". DO NOT prepend or include this feedback inside the "question" field!` : "This is the very first question of the mock interview session."}

Generate an authentic, high-quality interview question for "${focusTopic}".
Question format rules:
- If format preference is "mcq" (or if you choose MCQ):
  Set "questionType" to "mcq".
  Provide exactly 4 distinct choices in "options": ["A) ...", "B) ...", "C) ...", "D) ..."]. Exactly one choice must be correct.
  IMPORTANT: Provide ONLY the question prompt (and code snippet in fenced markdown if testing code) in "question". DO NOT include the options (A, B, C, D) inside "question" as they belong strictly in the "options" array.
- If format preference is "true_false" (or if you choose True/False):
  Set "questionType" to "true_false".
  Provide a crisp technical/domain statement to evaluate as True or False in "question", and set "options" to ["True", "False"].
- If format preference is "long_answer" (or if you choose Long Answer):
  Set "questionType" to "long_answer".
  Provide an architectural, scenario-based, or deep conceptual question that tests hands-on understanding. Set "options" to null.
- Include a helpful "hint" that guides the candidate without giving away the direct answer.

Return ONLY valid JSON matching this schema:
{
  "topic": "${focusTopic}",
  "questionNumber": ${questionNumber},
  "totalQuestions": ${totalQuestions},
  "questionType": "mcq" | "true_false" | "long_answer",
  "question": string in ${language},
  "options": string[] | null,
  "hint": string in ${language},
  "feedbackOnPrevious": ${previousAnswer ? "string" : "null"},
  "category": "technical"
}`;

    let parsed = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await flashModel.invoke([new HumanMessage(prompt)]);
        parsed = safeJsonParse(res.content);
        if (parsed && parsed.question) break;
      } catch (err) {
        console.warn(`[mockInterviewTool] attempt ${attempt + 1} failed:`, err.message);
      }
    }

    if (!parsed || !parsed.question) {
      parsed = {
        topic: focusTopic,
        questionNumber,
        totalQuestions,
        questionType: "long_answer",
        question: `Explain how you would architect and solve a core problem in ${focusTopic}, and discuss the key trade-offs involved in your approach.`,
        options: null,
        hint: `Focus on fundamentals, performance, reliability, and edge-case handling in ${focusTopic}.`,
        feedbackOnPrevious: previousAnswer ? "Good attempt on your previous answer. Let's delve deeper into architectural fundamentals." : null,
        category: "technical",
      };
    }

    parsed.topic = parsed.topic || focusTopic;
    parsed.role = parsed.topic;
    parsed.questionNumber = parsed.questionNumber || questionNumber;
    parsed.totalQuestions = parsed.totalQuestions || totalQuestions;

    // Clean feedback if accidentally prepended to question text
    if (parsed.feedbackOnPrevious && parsed.question.startsWith(parsed.feedbackOnPrevious)) {
      parsed.question = parsed.question.slice(parsed.feedbackOnPrevious.length).trim();
    }
    parsed.question = parsed.question
      .replace(/^(That answer is (?:in)?correct|Correct!|Incorrect|Your previous answer was[^\n]+)\.?\s*/i, "")
      .trim();

    // Fallback: If options were embedded into question text instead of options array
    if ((!parsed.options || !Array.isArray(parsed.options) || parsed.options.length < 2) && parsed.question) {
      const extracted = [];
      const nonOptionLines = [];
      const lines = parsed.question.split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*([A-D]\)|\([A-D]\)|[1-4]\.)\s*(.+)/i);
        if (match) {
          extracted.push(match[0].trim());
        } else {
          nonOptionLines.push(line);
        }
      }
      if (extracted.length >= 2) {
        parsed.options = extracted;
        parsed.question = nonOptionLines.join("\n").trim();
      }
    }

    // Ensure MCQ has options; if not, change to long_answer so user is not stuck with an unclickable card
    if (parsed.questionType === "mcq" && (!parsed.options || parsed.options.length < 2)) {
      parsed.questionType = "long_answer";
      parsed.options = null;
    } else {
      parsed.questionType =
        parsed.questionType ||
        (parsed.options ? (parsed.options.length === 2 ? "true_false" : "mcq") : "long_answer");
    }

    return JSON.stringify({
      result: parsed,
      cardPayload: {
        type: "mock_interview",
        data: parsed,
      },
    });
  },
  {
    name: "mock_interview",
    description: "Conduct or continue a mock interview session for a specific subject, topic, tool, or role. Generates MCQs, True/False, or Long Answer questions with interactive choices and previous feedback.",
    schema: z.object({
      topic: z.string().optional().describe("The subject, topic, tool, or role to interview for (e.g. 'React', 'Python', 'Docker', 'System Design')"),
      roleName: z.string().optional().describe("Alias for topic"),
      questionNumber: z.number().optional().describe("Current question number (1, 2, ...)"),
      totalQuestions: z.number().optional().describe("Total number of questions in the interview (e.g. 3, 5, 10)"),
      questionType: z.enum(["mcq", "true_false", "long_answer"]).optional().describe("Question format: mcq | true_false | long_answer"),
      previousAnswer: z.string().optional().describe("Candidate's answer to the previous question"),
      language: z.string().optional().describe("Language: en | as | hi"),
    }),
  }
);

const evaluateMockInterviewTool = tool(
  async ({ topic, totalQuestions = 5, qaList, language = "en" }) => {
    const focusTopic = (topic || "General").trim();

    const prompt = `You are a principal technical hiring manager and mentor conducting the final evaluation of a candidate's mock interview on: "${focusTopic}".
Language: ${language} (reply in this language).
Total questions: ${totalQuestions}.

Here is the candidate's complete mock interview history with their questions and answers:
${JSON.stringify(qaList, null, 2)}

Evaluate their performance thoroughly:
For each question:
1. Identify the correct answer / ideal solution.
2. Determine if the candidate was correct (true), partially correct ("partial"), or incorrect (false).
3. If they got anything wrong or incomplete, explain specifically what went wrong in "whatWentWrong". If completely correct, set to null.
4. Provide concrete, actionable advice on how to improve in "howToImprove".

Calculate:
- score: total number of correct answers (can award 0.5 for partially correct)
- percentage: round to nearest integer between 0 and 100
- grade: e.g. "Advanced" (>=80%), "Proficient" (>=60%), "Foundational" (>=40%), "Needs Practice" (<40%)
- overallFeedback: 2-3 sentences summarizing their readiness, depth, and overall performance
- strengths: 2-3 specific standout strengths demonstrated
- improvements: 2-3 high-impact areas to review or practice

Return ONLY valid JSON matching this schema:
{
  "topic": "${focusTopic}",
  "totalQuestions": ${totalQuestions},
  "score": number,
  "percentage": number,
  "grade": string,
  "overallFeedback": string,
  "strengths": string[],
  "improvements": string[],
  "questions": [
    {
      "questionNumber": number,
      "question": string,
      "questionType": "mcq" | "true_false" | "long_answer",
      "userAnswer": string,
      "correctAnswer": string,
      "isCorrect": boolean | "partial",
      "whatWentWrong": string | null,
      "howToImprove": string
    }
  ]
}`;

    const res = await proModel.invoke([new HumanMessage(prompt)]);
    const parsed = safeJsonParse(res.content);

    if (!parsed) {
      return JSON.stringify({
        error: "Could not generate interview evaluation",
        cardPayload: null,
      });
    }

    parsed.topic = parsed.topic || focusTopic;
    parsed.totalQuestions = parsed.totalQuestions || totalQuestions;

    return JSON.stringify({
      evaluation: parsed,
      cardPayload: {
        type: "mock_interview_evaluation",
        data: parsed,
      },
    });
  },
  {
    name: "evaluate_mock_interview",
    description: "Evaluate a completed mock interview session. Evaluates candidate answers, scores the interview, identifies what they got wrong, what they can improve on, and generates a comprehensive evaluation report card.",
    schema: z.object({
      topic: z.string().describe("The subject, topic, tool, or role evaluated"),
      totalQuestions: z.number().optional().describe("Total number of questions in this mock interview session"),
      qaList: z.array(
        z.object({
          questionNumber: z.number(),
          question: z.string(),
          questionType: z.string().optional(),
          userAnswer: z.string(),
        })
      ).describe("List of questions and the candidate's answers"),
      language: z.string().optional().describe("Language: en | as | hi"),
    }),
  }
);

const ALL_TOOLS = [
  extractResumeProfileTool,
  recommendRolesTool,
  analyseSkillGapTool,
  reviewResumeTool,
  generateRoadmapTool,
  findJobsTool,
  mockInterviewTool,
  evaluateMockInterviewTool,
];

// ─── Resume context builder ───────────────────────────────────────────────────

function buildResumeContext(userProfile) {
  if (userProfile && (userProfile.fullName || (Array.isArray(userProfile.skills) && userProfile.skills.length > 0) || (Array.isArray(userProfile.targetRoles) && userProfile.targetRoles.length > 0))) {
    const skillsList = Array.isArray(userProfile.skills) && userProfile.skills.length > 0
      ? userProfile.skills.join(", ")
      : "Not specified";
    const topSkills = Array.isArray(userProfile.skills) && userProfile.skills.length > 0
      ? userProfile.skills.slice(0, 4).join(", ")
      : "your technical background";

    let primaryRole = "";
    if (Array.isArray(userProfile.targetRoles) && userProfile.targetRoles.length > 0) {
      primaryRole = userProfile.targetRoles[0];
    } else if (Array.isArray(userProfile.experience) && userProfile.experience.length > 0) {
      primaryRole = userProfile.experience[0]?.title || "";
    }
    if (!primaryRole && Array.isArray(userProfile.skills) && userProfile.skills.length > 0) {
      const skillsStr = userProfile.skills.join(" ").toLowerCase();
      if (skillsStr.includes("react") || skillsStr.includes("frontend") || skillsStr.includes("vue") || skillsStr.includes("css")) {
        primaryRole = "Frontend Developer";
      } else if (skillsStr.includes("node") || skillsStr.includes("express") || skillsStr.includes("backend") || skillsStr.includes("django") || skillsStr.includes("java")) {
        primaryRole = "Backend Developer";
      } else if (skillsStr.includes("python") || skillsStr.includes("machine learning") || skillsStr.includes("data")) {
        primaryRole = "Data Scientist";
      } else {
        primaryRole = "Software Engineer";
      }
    }

    return `[Stored Resume Profile On File]
A profile is saved in the database for this user:
- Candidate Name: ${userProfile.fullName || "Candidate"}
- Stored Skills: ${skillsList}
- Inferred / Primary Target Role: ${primaryRole || "Software Engineer"}
- Total Work Experience entries: ${Array.isArray(userProfile.experience) ? userProfile.experience.length : 0}
- Total Education entries: ${Array.isArray(userProfile.education) ? userProfile.education.length : 0}

STRICT OPERATIONAL RULES FOR THIS STORED PROFILE:
1. NEVER assume or take for granted that the user wants every answer based on this stored profile.
2. CAREER PATH & COUNSELLING PROTOCOL — TWO DISTINCT PATHWAYS:
   When the user asks for career path, career guidance, role recommendations, or career counselling ("Career path & counselling", "What role suits me?", "Suggest roles for me", "Career counselling", "Guide my career", "Which career should I pursue?"):
   DO NOT immediately call recommend_roles without presenting the two options!
   You MUST give the user these two options:
   "We can explore and assess your ideal career path in two ways — which path would you like to take?
   1. Interactive Conversational Assessment: We'll have a conversation where I assess your personality, the things you genuinely like, how curious and creative you are, the skills you know, your language and communication fluency, and your work style. Based on this, I'll assess your true interests and guide you toward the career goals that suit you best.
   2. Resume & Profile Assessment: We'll evaluate your background based on your resume or previous profile data on file (${primaryRole || topSkills}) to analyze what career paths and transition opportunities you would be better off with based on your track record."

   - IF THE USER CHOOSES OPTION 1 (Interactive Conversational Assessment):
     * Do NOT call tools immediately. Start an engaging, structured counselling conversation in chat!
     * Ask 2-3 thoughtful questions covering:
       - What their personality is and what kind of work environments they thrive in (e.g., creative explorer vs analytical problem solver, solo builder vs collaborative leader).
       - What specific things they genuinely like doing and how curious/creative they feel when tackling challenges.
       - What hard and soft skills they know, and how fluent/confident they are in language and communication.
       - Work preferences (e.g., building new products, optimizing systems, managing people, strategic planning).
     * Synthesize their answers, explain why certain career goals and roles match their personality and interests, and then invoke recommend_roles with their assessed skills and interests.

   - IF THE USER CHOOSES OPTION 2 (Resume & Profile Assessment):
     * If resume/profile data is on file:
       Warmly confirm their profile on file and invoke recommend_roles with their stored skills (${topSkills}) and target roles.
     * If no resume is on file:
       Invite them to upload their resume using the paperclip icon (PDF/TXT) or paste their background text.
3. RESUME REVIEW PROTOCOL — THREE DISTINCT REVIEW MODES:
   The resume reviewer operates in three distinct ways:
   1) General Resume Review: Reviews overall resume quality, structure, clarity, strengths, ATS friendliness, and scope of improvement.
   2) Review Against a Specific Job Role: Evaluates how well the resume matches a target career role (e.g., Full Stack Developer, Frontend Developer, Sales Manager, Data Scientist, etc.).
   3) Review Against a Specific Job Description: Checks keyword coverage, missing ATS terms, and qualification fit against a pasted JD.

   CRITICAL CLARIFICATION RULE (ALWAYS ENFORCE):
   - Always if LESS INFORMATION is given when the user asks for a resume review (e.g. "Review my resume", "Check my CV", "Review resume", or clicks the quick action):
     You MUST ask them:
     "In what ways do you want to review your resume?
     1. General Review: Assess overall quality, clarity, structure, ATS friendliness, and scope of improvement.
     2. Against a Specific Job Role: Evaluate how well your resume matches a target role (e.g., Full Stack Developer, Frontend Developer, Sales Manager).
     3. Against a Job Description: Check keyword coverage, missing ATS terms, and match fit against a job posting."
   - If the user has ALREADY PROVIDED the detail (e.g. "Review my resume for a Frontend Developer role" or "Review my resume against this job description: [text]"):
     DO NOT ask! Directly execute that specific review mode using review_resume.
   - When the user selects or specifies:
     * General review: Invoke review_resume with { reviewType: "general", resumeProfile: userProfile }.
     * Specific job role: If they haven't named the role yet, ask which role. Once role is known, invoke review_resume with { reviewType: "job_role", targetRole: "[roleName]", resumeProfile: userProfile }.
     * Job description: If they haven't pasted the JD yet, ask them to paste it. Once pasted, invoke review_resume with { reviewType: "job_description", jobDescription: "[JD text]", resumeProfile: userProfile }.
4. ROADMAP PROTOCOL — TWO CRITICAL DISTINCT WORKFLOWS:
   - WORKFLOW A: SPECIFIC JOB ROLE OR TOPIC REQUESTED (e.g. "Create a roadmap for DevOps", "Frontend developer roadmap", "Make me a roadmap for Machine Learning", "Next.js roadmap"):
     * COMPLETELY IGNORE this stored resume and user's previous data!
     * The roadmap must be based strictly and purely on that specific requested role or domain, with zero out-of-scope fluff. Never inject user's past resume skills into it!
     * Call generate_roadmap with targetRole matching their exact requested role.
   - WORKFLOW B: "WHAT TO DO NEXT" OR GENERAL CAREER ADVANCEMENT (e.g. "What to do next?", "What should I do next?", "Make me a roadmap", "Make me a roadmap to level up", "Where do I go from here?", "Next steps in my career"):
     * Inspect what field the user is currently in based on their profile data (${primaryRole || topSkills}).
     * Determine what the user can do next to advance further in their field (for instance, if they are currently a Frontend Developer, the logical next milestone is "Senior Frontend & Web Architecture" or "Full Stack Engineering"; if Backend Developer, the next step is "Advanced Backend Systems & Distributed Architecture"; if Data Analyst, "Data Engineering & Machine Learning").
     * Warmly introduce the progression: "Based on your current background in ${primaryRole || topSkills}, the logical next step to advance your career is moving towards [Next Role]. Here is your structured career progression roadmap:"
     * Call generate_roadmap with targetRole set to that logical next advancement role.
     * In both workflows, NEVER include any weeks, days, or timeframes. Roadmaps are milestone-based.
5. If the user asks to find a job ("Find me a job", "Jobs for me", "Find jobs"):
   - If the user specifies a specific role/title or location in their prompt (e.g., "Find me React jobs in Bangalore" or "Find remote Python jobs"):
     Search immediately for that specific role/location using find_jobs.
   - If the user asks "Find me a job" or "Jobs" WITHOUT prompting any specific role or title:
     USE THIS USER'S STORED DATA ON FILE (${primaryRole || topSkills})! Call find_jobs with roleName="${primaryRole || "Software Engineer"}", and warmly explain that you searched for live openings matching their profile on file (${primaryRole || topSkills}).
6. MOCK INTERVIEW PROTOCOL (TWO SCENARIOS):
   - Scenario 1 (Specific Subject, Topic, or Tool):
     If the user specifies a subject/topic/tool (e.g. "Mock interview on React", "Python MCQs", "Test me on Docker 3 questions"):
     Focus the mock interview strictly on that requested topic/tool!
   - Scenario 2 (Based on Profile / Record):
     If the user asks for a mock interview based on their profile or record (or clicks "Mock interview" and chooses profile-based):
     Use this user's stored profile (${primaryRole || topSkills})! Generate targeted questions testing their real-world skills in ${topSkills}.
   - If they simply say "Mock interview" without specifying:
     Offer the choice between (1) Specific subject/topic/tool, and (2) Their profile on file (${primaryRole || topSkills}), plus the choice of question count and question format (MCQs, True/False, Long Answers).`;
  }

  return `[Stored Resume Context]
No resume has been uploaded yet for this user.
- If the user asks to review their resume: warmly prompt them to share their resume using the paperclip icon (PDF/TXT) or paste their resume text in chat.
- If the user asks what roles suit them: invite them to either upload their resume or share their skills and background in chat.
- If the user asks to find a job without specifying a role: ask what career role or job title they would like you to search for.
- If the user asks "What to do next?" or "Make me a roadmap" without specifying a role: politely ask what field or role they currently work in so you can map out the next logical step in their career.
- If the user asks for a mock interview based on their profile: warmly inform them that no profile is on file yet, and invite them to either upload their resume or specify what subject, role, or tool they would like to be interviewed on.`;
}

// ─── Agent system prompt ──────────────────────────────────────────────────────

function buildSystemPrompt(language) {
  const langInstruction =
    language === "as"
      ? "IMPORTANT: Reply in Assamese language (অসমীয়া). Use Assamese script (অসমীয়া লিপি). The candidate may communicate in Assamese script or Romanized Assamese (typing phonetic English letters like 'moi web developer hoboloi bisaru, mur babe kunto path bhal hobo'). Understand both forms seamlessly and always reply in natural, fluent Assamese script (অসমীয়া লিপি)."
      : language === "hi"
      ? "IMPORTANT: Reply in Hindi language (हिंदी). Use Devanagari script. The candidate may communicate in Devanagari or Hinglish. Understand both seamlessly and reply in clean Hindi in Devanagari script."
      : "Reply in English.";

  return `You are SkillBridge Career Guide — a warm, highly perceptive, and practical career mentor who helps people navigate their career journeys.

${langInstruction}

Your personality:
- Encouraging, supportive, and active listener
- Practical — gives clear, concrete, and actionable guidance
- Interactive — you converse with the user and confirm their preferences rather than robotically firing tools without checking
- Honest — realistic timelines, clear milestones, zero hype

You have access to powerful tools:
- extract_resume_profile: Parse and analyse a resume
- recommend_roles: Match the user's skills to suitable career roles
- analyse_skill_gap: Identify missing skills for a target role
- review_resume: Provide detailed resume review with ratings
- generate_roadmap: Create a pristine, structured, sequential learning roadmap
- find_jobs: Search live job openings for a role
- mock_interview: Conduct interactive mock interview practice with MCQs, True/False, or Long Answers
- evaluate_mock_interview: Evaluate a completed mock interview with scoring, what went wrong, and improvements

CORE INTERACTION & RESUME PROTOCOL (CRITICAL):
1. CAREER PATH & COUNSELLING PROTOCOL (TWO DISTINCT PATHWAYS):
   When a user asks for career path, counselling, or role recommendations ("Career path & counselling", "What role suits me?", "Suggest roles for me", "Career guidance", "Career counselling", "Which career should I choose?"):
   DO NOT immediately call recommend_roles without offering the choice!
   Always present the two options clearly:
   "We can explore and assess your ideal career path in two ways — which path would you like to take?
   1. Interactive Conversational Assessment: We'll have a chat where I assess your personality, the things you genuinely like, how curious and creative you are, the skills you know, your language and communication fluency, and your work style. Based on your answers, I'll assess your true interests and guide you toward the career goals that suit you best.
   2. Resume & Profile Assessment: We'll evaluate your background based on your resume or previous profile data on file to analyze what career paths and transition opportunities you would be better off with based on your track record."

   - Path 1 (Conversational): Ask thoughtful, engaging questions about their personality, creativity, interests, skills, and work style, then provide an insightful analysis and call recommend_roles with the identified skills and interests.
   - Path 2 (Resume / Profile): Use their uploaded resume or profile on file, evaluate their background, and invoke recommend_roles. If no resume is on file, invite them to upload one.

2. ROADMAP GENERATION (TWO STRICT WORKFLOWS — ZERO SLOP, STRICT DOMAIN PURITY, NO TIME ESTIMATES):
   - Workflow A: SPECIFIC JOB ROLE OR TOPIC REQUESTED (e.g. "Frontend Developer roadmap", "Make me a roadmap for DevOps", "Roadmap for Data Engineer"):
     * The roadmap must be based STRICTLY on that specific role or domain!
     * DO NOT consider or inject the user's previous resume or data. The past resume is completely irrelevant here.
     * Steps must be in strict, chronological, prerequisite order (step 1 is foundational, step 2 builds upon step 1, etc.).
     * Call generate_roadmap with targetRole matching their exact requested role.
   - Workflow B: "WHAT TO DO NEXT" / CAREER ADVANCEMENT (e.g. "What to do next?", "Where do I go from here?", "Make me a roadmap", "What should I do next?"):
     * Check what field the user is currently in from their profile on file.
     * Determine what the user can do NEXT to advance further in their field (for example, from Frontend to Senior Frontend / Web Architecture; from Backend to Distributed Systems; from Junior to Senior Specialist).
     * Explain the logical next progression and call generate_roadmap for that target advancement role.
     * If no profile is on file, ask what field they are currently in so you can map out their next level.
   - STRICT TIME REMOVAL (NO TIME INDICATORS):
     * NEVER mention weeks, days, or durations in your text replies or cards (e.g. do not say "in 23 weeks" or "~14 days"). Roadmaps are milestone and mastery based.

3. RESUME REVIEW PROTOCOL (THREE DISTINCT REVIEW MODES):
   The resume reviewer evaluates resumes in three powerful ways:
   1) General Resume Review: Overall assessment of how strong the resume is, clarity, structure, ATS score, standout strengths, and clear scope of improvement.
   2) Review Against a Specific Job Role: Evaluates the resume specifically for a target role (e.g., Full Stack Developer, Frontend Developer, Sales Manager, etc.), identifying matched skills vs missing role competencies.
   3) Review Against a Specific Job Description: Checks keyword coverage (found keywords vs missing ATS keywords) and match percentage against a specific job posting.

   CLARIFICATION RULE (CRITICAL):
   - Always if LESS INFORMATION is given when the user asks for a resume review (e.g. "Review my resume", "Check my CV", "How is my resume?", or clicks "Review my resume"):
     DO NOT immediately run a generic review! You MUST ask them:
     "In what ways do you want to review your resume?
     1. General Review: Assess overall quality, clarity, structure, ATS friendliness, and scope of improvement.
     2. Against a Specific Job Role: Evaluate how well your resume matches a target role (e.g., Full Stack Developer, Frontend Developer, Sales Manager).
     3. Against a Job Description: Check keyword coverage, missing ATS terms, and match fit against a job posting."
   - If the detail is ALREADY PROVIDED in their prompt (e.g. "Review my resume for a Senior Frontend Developer role" or "Review my resume against this job description: ..."):
     Directly invoke review_resume with the corresponding mode (reviewType: "job_role" and targetRole, or reviewType: "job_description" and jobDescription).
   - If no resume is uploaded yet on file, invite them to share their resume using the paperclip icon (PDF/TXT) or paste their resume text in chat.

4. FIND JOBS PROTOCOL (CRITICAL):
   - When the user asks to find a job ("Find me a job", "Jobs for me", or clicks the quick action):
     * If the user specified a role or location in their prompt (e.g. "Find me frontend jobs" or "Find DevOps jobs in Bangalore"), call find_jobs with that roleName and location.
     * If the user asks "Find me a job" WITHOUT prompting any role, AND you have their profile/skills/resume data on file:
       DO NOT ask them what role they want. IMMEDIATELY call find_jobs with their primary role on file (e.g., Frontend Developer, Backend Developer, or Software Engineer). Tell them that you retrieved live openings tailored to their profile on file!
     * If no profile is on file and they gave no role, politely ask what job title or career role they would like you to search for.

5. MOCK INTERVIEW PROTOCOL (TWO SCENARIOS, MULTIPLE QUESTION TYPES, CUSTOM COUNT, AND FINAL EVALUATION):
   When a user asks for a mock interview ("Mock interview", "Interview practice", "Test me", or clicks the quick action):
   
   A. SCENARIOS (OFFER THE TWO OPTIONS IF NOT SPECIFIED):
      If the user has not specified the topic/tool or how they want to be interviewed:
      DO NOT immediately fire a random question! You MUST clearly present the two options:
      "How would you like to conduct your mock interview?
      1. Specific Subject, Topic, or Tool: Choose any technology, framework, tool, or role you want to practice (e.g., React, Python, Docker, System Design, SQL, Product Management, Sales).
      2. Based on Your Profile / Record: I'll generate targeted interview questions based on your background and skills on file. (If your profile is not yet on file, you can tell me about your background or upload your resume).
      
      You can also choose how many questions you'd like (e.g., 3, 5, or 10 questions) and the format (Multiple Choice MCQs, True/False, or open-ended Long Answers)!"
   
   B. STARTING THE INTERVIEW:
      - Scenario 1 (Specific Subject/Topic/Tool): User specifies a topic (e.g., "Mock interview on React", "Python MCQs", "Test me on Docker 3 questions"). Start immediately with question 1 on that topic.
      - Scenario 2 (Profile / Resume Record): User chooses profile-based.
        * If profile is on file: Use their skills and background to generate targeted questions for their field. Mention that the questions are customized to their profile!
        * If no profile is on file: Politely ask what subject, tool, or career role they work with or invite them to upload their resume.
      - Question Count: If the user specified a count (e.g. 3, 5, 10), use that as totalQuestions. Default to 5 if not specified.
      - Question Types: The interview can include MCQs (with 4 choices A, B, C, D), True/False questions, and Long Answer conceptual/problem-solving questions. If the user requested a specific type (e.g. "Only MCQs"), honor it. Otherwise, provide an engaging mix or choose the best format for the concept.
   
   C. CONDUCTING THE SESSION & EVALUATING AT THE END (MANDATORY SEQUENTIAL FLOW):
      - Start: Call mock_interview tool for Question 1 (questionNumber: 1, totalQuestions: N, topic, questionType).
      - Step-by-Step Progression:
        Inspect the previous question number K and totalQuestions N from the conversation history.
        * If the candidate says "where is the question?", "i dont see the question", or indicates they did not see the question prompt, IMMEDIATELY call mock_interview again for that same question number K of N! DO NOT end the interview and DO NOT score it as a wrong answer!
        * If K < N: You MUST generate the next question! Call mock_interview with questionNumber: K + 1 and totalQuestions: N (e.g., after answering Question 1, generate Question 2 of 5; after Question 2, generate Question 3 of 5; after Question 3, generate Question 4 of 5; after Question 4, generate Question 5 of 5).
        * NEVER stop early, NEVER skip questions, and NEVER call evaluate_mock_interview until ALL N questions have been answered by the candidate!
        * If and ONLY if K === N (the candidate has just submitted their answer to Question N of N):
          The mock interview is complete! IMMEDIATELY call evaluate_mock_interview with the full list of all N questions, the candidate's answers, and correct answers.
          In your response text:
          - Congratulate them on finishing the complete mock interview.
          - State their score and percentage clearly.
          - Highlight what they got right, what they got wrong, and what they could have improved on.
          - Point them to the detailed evaluation report card below.

      - CRITICAL LEAD-IN INSTRUCTION:
        When mock_interview tool outputs a card, the interactive card below already handles the complete display of the question prompt, code blocks, clickable option buttons, and hint.
        Your conversational response MUST ONLY be a single 1-sentence friendly lead-in, such as:
        "Here is Question 3 of your JavaScript mock interview:"
        DO NOT repeat the question text, code snippets, options (A, B, C, D), or hints in your conversational reply text!

6. FORMATTING RULES:
   - Do NOT output raw markdown symbols like '###', '####', '---', or literal asterisks '*' in your conversational text.
   - Keep chat text conversational, clean, and elegant with natural paragraphs and clean sentences.
   - When tools output structured cards, introduce them with a concise 1-2 sentence conversational lead-in.

Be the thoughtful, personalized career mentor they wish they had.`;
}

// ─── Main agent function ──────────────────────────────────────────────────────

/**
 * Run the Career Guide agent.
 *
 * @param {object} params
 * @param {string} params.message — the user's message
 * @param {Array}  params.conversationHistory — [{role, content}] last N messages
 * @param {object} [params.userProfile] — optional CGResumeProfile
 * @param {string} [params.language] — "en" | "as" | "hi"
 * @returns {Promise<{textContent: string, cardPayload: object|null}>}
 */
export async function runCareerGuideAgent({ message, conversationHistory = [], userProfile = null, language = "en" }) {
  // Bind tools to the flash model
  const modelWithTools = flashModel.bindTools(ALL_TOOLS);

  const systemPrompt = buildSystemPrompt(language);

  // Build message history
  const messages = [new SystemMessage(systemPrompt)];

  // Add conversation history
  for (const msg of conversationHistory) {
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    } else if (msg.role === "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  }

  // Add resume on-file context
  messages.push(new SystemMessage(buildResumeContext(userProfile)));

  // Current user message
  messages.push(new HumanMessage(message));

  let finalTextContent = "";
  let finalCardPayload = null;

  // Agent loop — max 3 iterations
  for (let iteration = 0; iteration < 3; iteration++) {
    const response = await modelWithTools.invoke(messages);
    messages.push(response);

    // Check if the model wants to call tools
    if (!response.tool_calls || response.tool_calls.length === 0) {
      // No tool calls — final answer
      if (finalCardPayload?.type === "mock_interview" && finalCardPayload.data) {
        const d = finalCardPayload.data;
        finalTextContent =
          language === "as"
            ? `আপোনাৰ ${d.topic || "টেকনিকেল"} মক সাক্ষাৎকাৰৰ ${d.questionNumber || 1} নং প্ৰশ্ন:`
            : language === "hi"
            ? `आपके ${d.topic || "तकनीकी"} मॉक इंटरव्यू का प्रश्न ${d.questionNumber || 1} (${d.totalQuestions || 5} में से):`
            : `Here is Question ${d.questionNumber || 1} of ${d.totalQuestions || 5} for your ${d.topic || "technical"} mock interview:`;
      } else {
        finalTextContent = response.content || "";
      }
      break;
    }

    // Execute all tool calls
    for (const toolCall of response.tool_calls) {
      const matchedTool = ALL_TOOLS.find((t) => t.name === toolCall.name);

      if (!matchedTool) {
        messages.push(
          new ToolMessage({
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: `Tool ${toolCall.name} not found` }),
          })
        );
        continue;
      }

      try {
        // Inject language into tool args if supported
        const args = { ...toolCall.args };
        if (language && (toolCall.name === "recommend_roles" || toolCall.name === "generate_roadmap" || toolCall.name === "mock_interview" || toolCall.name === "evaluate_mock_interview")) {
          args.language = args.language || language;
        }

        const toolResult = await matchedTool.invoke(args);
        const parsed = typeof toolResult === "string" ? safeJsonParse(toolResult) : toolResult;

        // Capture card payload from tool result
        if (parsed?.cardPayload) {
          finalCardPayload = parsed.cardPayload;
        }

        let toolMessageContent = typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult);
        if (toolCall.name === "mock_interview" && parsed?.result) {
          toolMessageContent = JSON.stringify({
            status: "mock_interview_card_displayed_on_ui",
            topic: parsed.result.topic,
            questionNumber: parsed.result.questionNumber,
            totalQuestions: parsed.result.totalQuestions,
            instruction: `The interactive question card is already rendered on the user's screen with the question prompt, code snippet, options, and hint. Output ONLY a 1-sentence friendly lead-in (e.g. 'Here is Question ${parsed.result.questionNumber} of your ${parsed.result.topic} mock interview:') and NEVER repeat the question, code, options, or hint in text.`,
          });
        }

        messages.push(
          new ToolMessage({
            tool_call_id: toolCall.id,
            content: toolMessageContent,
          })
        );
      } catch (toolErr) {
        console.error(`[CG Agent] Tool ${toolCall.name} error:`, toolErr.message);
        messages.push(
          new ToolMessage({
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: toolErr.message }),
          })
        );
      }
    }

    // If this was the last iteration and we still have tool calls, get final response
    if (iteration === 2) {
      if (finalCardPayload?.type === "mock_interview" && finalCardPayload.data) {
        const d = finalCardPayload.data;
        finalTextContent =
          language === "as"
            ? `আপোনাৰ ${d.topic || "টেকনিকেল"} মক সাক্ষাৎকাৰৰ ${d.questionNumber || 1} নং প্ৰশ্ন:`
            : language === "hi"
            ? `आपके ${d.topic || "तकनीकी"} मॉक इंटरव्यू का प्रश्न ${d.questionNumber || 1} (${d.totalQuestions || 5} में से):`
            : `Here is Question ${d.questionNumber || 1} of ${d.totalQuestions || 5} for your ${d.topic || "technical"} mock interview:`;
      } else {
        const finalResponse = await modelWithTools.invoke(messages);
        finalTextContent = finalResponse.content || "";
      }
    }
  }

  // Safety override: if mock_interview card exists, guarantee clean 1-sentence lead-in
  if (finalCardPayload?.type === "mock_interview" && finalCardPayload.data) {
    const d = finalCardPayload.data;
    finalTextContent =
      language === "as"
        ? `আপোনাৰ ${d.topic || "টেকনিকেল"} মক সাক্ষাৎকাৰৰ ${d.questionNumber || 1} নং প্ৰশ্ন:`
        : language === "hi"
        ? `आपके ${d.topic || "तकनीकी"} मॉक इंटरव्यू का प्रश्न ${d.questionNumber || 1} (${d.totalQuestions || 5} में से):`
        : `Here is Question ${d.questionNumber || 1} of ${d.totalQuestions || 5} for your ${d.topic || "technical"} mock interview:`;
  }

  // Recovery: If in an active mock interview and no card was outputted, automatically advance/re-serve the question
  if (!finalCardPayload) {
    let activeInterview = null;
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const h = conversationHistory[i];
      if (h.role === "assistant" && h.content) {
        const match = h.content.match(/\[MOCK INTERVIEW ACTIVE QUESTION\]: Question (\d+) of (\d+) on "([^"]+)"/i);
        if (match) {
          activeInterview = {
            currentQ: parseInt(match[1], 10),
            totalQ: parseInt(match[2], 10),
            topic: match[3],
          };
          break;
        }
      }
    }

    if (activeInterview && activeInterview.currentQ < activeInterview.totalQ) {
      const isExit = /^(cancel|stop|exit|quit|end interview|leave)/i.test(message.trim());
      if (!isExit) {
        const isNotSeeing = /(don'?t see|where is|can'?t see|didn'?t see|missing) (the )?(3rd|third|\d+(?:st|nd|rd|th)? )?question/i.test(message);
        const nextQNum = isNotSeeing ? activeInterview.currentQ : activeInterview.currentQ + 1;
        try {
          const recRes = await mockInterviewTool.invoke({
            topic: activeInterview.topic,
            questionNumber: nextQNum,
            totalQuestions: activeInterview.totalQ,
            previousAnswer: isNotSeeing ? null : message,
            language,
          });
          const parsedRec = typeof recRes === "string" ? safeJsonParse(recRes) : recRes;
          if (parsedRec?.cardPayload) {
            finalCardPayload = parsedRec.cardPayload;
            finalTextContent =
              language === "as"
                ? `আপোনাৰ ${activeInterview.topic} মক সাক্ষাৎকাৰৰ ${nextQNum} নং প্ৰশ্ন:`
                : language === "hi"
                ? `आपके ${activeInterview.topic} मॉक इंटरव्यू का प्रश्न ${nextQNum} (${activeInterview.totalQ} में से):`
                : `Here is Question ${nextQNum} of ${activeInterview.totalQ} for your ${activeInterview.topic} mock interview:`;
            if (typeof onCard === "function") onCard(finalCardPayload);
            if (typeof onChunk === "function") onChunk(finalTextContent);
          }
        } catch (recErr) {
          console.error("[CG Agent Recovery] failed to generate next question:", recErr.message);
        }
      }
    }
  }

  return {
    textContent: finalTextContent,
    cardPayload: finalCardPayload,
  };
}

/**
 * Run the Career Guide agent with real-time streaming tokens.
 *
 * @param {object} params
 * @param {string} params.message — the user's message
 * @param {Array}  params.conversationHistory — [{role, content}] last N messages
 * @param {object} [params.userProfile] — optional CGResumeProfile
 * @param {string} [params.language] — "en" | "as" | "hi"
 * @param {function} params.onChunk — callback for each incremental text token (chunk: string) => void
 * @param {function} [params.onCard] — callback when a structured card payload is generated (card: object) => void
 * @returns {Promise<{textContent: string, cardPayload: object|null}>}
 */
export async function runCareerGuideAgentStream({
  message,
  conversationHistory = [],
  userProfile = null,
  language = "en",
  onChunk = () => {},
  onCard = () => {},
}) {
  const modelWithTools = flashModel.bindTools(ALL_TOOLS);
  const systemPrompt = buildSystemPrompt(language);
  const messages = [new SystemMessage(systemPrompt)];

  for (const msg of conversationHistory) {
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    } else if (msg.role === "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  }

  // Add resume on-file context
  messages.push(new SystemMessage(buildResumeContext(userProfile)));

  messages.push(new HumanMessage(message));

  let finalTextContent = "";
  let finalCardPayload = null;

  // Initial tool evaluation
  const initialResponse = await modelWithTools.invoke(messages);
  messages.push(initialResponse);

  if (!initialResponse.tool_calls || initialResponse.tool_calls.length === 0) {
    // Direct conversational reply
    const fullText = typeof initialResponse.content === "string" ? initialResponse.content : "";
    finalTextContent = fullText;

    // Stream out words smoothly
    const tokens = fullText.split(/(\s+)/);
    for (const token of tokens) {
      if (token) {
        onChunk(token);
        await new Promise((resolve) => setTimeout(resolve, 14));
      }
    }
  } else {
    // Model decided to call tools
    for (const toolCall of initialResponse.tool_calls) {
      const matchedTool = ALL_TOOLS.find((t) => t.name === toolCall.name);
      if (!matchedTool) continue;
      try {
        const args = { ...toolCall.args };
        if (
          language &&
          (toolCall.name === "recommend_roles" ||
            toolCall.name === "generate_roadmap" ||
            toolCall.name === "mock_interview" ||
            toolCall.name === "evaluate_mock_interview")
        ) {
          args.language = args.language || language;
        }
        const toolResult = await matchedTool.invoke(args);
        const parsed = typeof toolResult === "string" ? safeJsonParse(toolResult) : toolResult;
        if (parsed?.cardPayload) {
          finalCardPayload = parsed.cardPayload;
          onCard(parsed.cardPayload);
        }
        let toolMessageContent = typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult);
        if (toolCall.name === "mock_interview" && parsed?.result) {
          toolMessageContent = JSON.stringify({
            status: "mock_interview_card_displayed_on_ui",
            topic: parsed.result.topic,
            questionNumber: parsed.result.questionNumber,
            totalQuestions: parsed.result.totalQuestions,
            instruction: `The interactive question card is already rendered on the user's screen with the question prompt, code snippet, options, and hint. Output ONLY a 1-sentence friendly lead-in (e.g. 'Here is Question ${parsed.result.questionNumber} of your ${parsed.result.topic} mock interview:') and NEVER repeat the question, code, options, or hint in text.`,
          });
        }

        messages.push(
          new ToolMessage({
            tool_call_id: toolCall.id,
            content: toolMessageContent,
          })
        );
      } catch (err) {
        console.error(`[CG Agent Stream] Tool ${toolCall.name} error:`, err.message);
      }
    }

    if (finalCardPayload?.type === "mock_interview" && finalCardPayload.data) {
      const d = finalCardPayload.data;
      const cleanLeadIn =
        language === "as"
          ? `আপোনাৰ ${d.topic || "টেকনিকেল"} মক সাক্ষাৎকাৰৰ ${d.questionNumber || 1} নং প্ৰশ্ন:`
          : language === "hi"
          ? `आपके ${d.topic || "तकनीकी"} मॉक इंटरव्यू का प्रश्न ${d.questionNumber || 1} (${d.totalQuestions || 5} में से):`
          : `Here is Question ${d.questionNumber || 1} of ${d.totalQuestions || 5} for your ${d.topic || "technical"} mock interview:`;
      finalTextContent = cleanLeadIn;
      onChunk(cleanLeadIn);
    } else {
      // Now stream the explanation / advice directly from flashModel!
      try {
        const stream = await flashModel.stream(messages);
        for await (const chunk of stream) {
          const text = typeof chunk.content === "string" ? chunk.content : "";
          if (text) {
            finalTextContent += text;
            onChunk(text);
          }
        }
      } catch (streamErr) {
        console.warn("[CG Agent Stream] stream error, falling back to invoke:", streamErr.message);
        const fallback = await flashModel.invoke(messages);
        const fullText = typeof fallback.content === "string" ? fallback.content : "";
        finalTextContent = fullText;
        const tokens = fullText.split(/(\s+)/);
        for (const token of tokens) {
          if (token) {
            onChunk(token);
            await new Promise((resolve) => setTimeout(resolve, 14));
          }
        }
      }
    }
  }

  // Safety override: if mock_interview card exists, guarantee clean 1-sentence lead-in
  if (finalCardPayload?.type === "mock_interview" && finalCardPayload.data) {
    const d = finalCardPayload.data;
    finalTextContent =
      language === "as"
        ? `আপোনাৰ ${d.topic || "টেকনিকেল"} মক সাক্ষাৎকাৰৰ ${d.questionNumber || 1} নং প্ৰশ্ন:`
        : language === "hi"
        ? `आपके ${d.topic || "तकनीकी"} मॉक इंटरव्यू का प्रश्न ${d.questionNumber || 1} (${d.totalQuestions || 5} में से):`
        : `Here is Question ${d.questionNumber || 1} of ${d.totalQuestions || 5} for your ${d.topic || "technical"} mock interview:`;
  }

  // Recovery: If in an active mock interview and no card was outputted, automatically advance/re-serve the question
  if (!finalCardPayload) {
    let activeInterview = null;
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const h = conversationHistory[i];
      if (h.role === "assistant" && h.content) {
        const match = h.content.match(/\[MOCK INTERVIEW ACTIVE QUESTION\]: Question (\d+) of (\d+) on "([^"]+)"/i);
        if (match) {
          activeInterview = {
            currentQ: parseInt(match[1], 10),
            totalQ: parseInt(match[2], 10),
            topic: match[3],
          };
          break;
        }
      }
    }

    if (activeInterview && activeInterview.currentQ < activeInterview.totalQ) {
      const isExit = /^(cancel|stop|exit|quit|end interview|leave)/i.test(message.trim());
      if (!isExit) {
        const isNotSeeing = /(don'?t see|where is|can'?t see|didn'?t see|missing) (the )?(3rd|third|\d+(?:st|nd|rd|th)? )?question/i.test(message);
        const nextQNum = isNotSeeing ? activeInterview.currentQ : activeInterview.currentQ + 1;
        try {
          const recRes = await mockInterviewTool.invoke({
            topic: activeInterview.topic,
            questionNumber: nextQNum,
            totalQuestions: activeInterview.totalQ,
            previousAnswer: isNotSeeing ? null : message,
            language,
          });
          const parsedRec = typeof recRes === "string" ? safeJsonParse(recRes) : recRes;
          if (parsedRec?.cardPayload) {
            finalCardPayload = parsedRec.cardPayload;
            finalTextContent =
              language === "as"
                ? `আপোনাৰ ${activeInterview.topic} মক সাক্ষাৎকাৰৰ ${nextQNum} নং প্ৰশ্ন:`
                : language === "hi"
                ? `आपके ${activeInterview.topic} मॉक इंटरव्यू का प्रश्न ${nextQNum} (${activeInterview.totalQ} में से):`
                : `Here is Question ${nextQNum} of ${activeInterview.totalQ} for your ${activeInterview.topic} mock interview:`;
            if (typeof onCard === "function") onCard(finalCardPayload);
            if (typeof onChunk === "function") onChunk(finalTextContent);
          }
        } catch (recErr) {
          console.error("[CG Agent Recovery] failed to generate next question:", recErr.message);
        }
      }
    }
  }

  return {
    textContent: finalTextContent,
    cardPayload: finalCardPayload,
  };
}

// Export normaliseSkill and parseResumeText for use in controller
export async function parseResumeText(resumeText) {
  const prompt = `You are a resume parser. Extract structured information from the resume text below.
Return ONLY valid JSON matching this schema exactly:
{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "skills": string[],
  "experience": [{"title": string, "company": string, "duration": string, "description": string}],
  "education": [{"degree": string, "institution": string, "year": string}],
  "projects": [{"name": string, "tech": string, "description": string}],
  "achievements": string[]
}

Resume text:
${resumeText.slice(0, 8000)}`;

  const result = await flashModel.invoke([new HumanMessage(prompt)]);
  return safeJsonParse(result.content);
}

export { normaliseSkill };
