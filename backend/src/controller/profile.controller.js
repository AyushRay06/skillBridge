import prisma from "../lib/prisma.js";
import { parseJsonFields, PROFILE_JSON_FIELDS } from "../lib/helpers.js";
import { PDFParse } from "pdf-parse";
import { flashModel } from "../agents/llm.js";
import { HumanMessage } from "@langchain/core/messages";

// ====================== Helper: Parse & Sanitize ======================
function safeJsonParse(text) {
  if (!text) return null;
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function sanitizeArrayOfStrings(arr) {
  if (Array.isArray(arr)) {
    return arr.map(s => String(s).trim()).filter(Boolean);
  }
  if (typeof arr === "string") {
    return arr.split(/[,|•·;\n]/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function sanitizeExperience(expList) {
  if (!Array.isArray(expList)) return [];
  return expList.map(item => {
    let points = [];
    if (Array.isArray(item.points)) {
      points = item.points.map(p => String(p).trim()).filter(Boolean);
    } else if (typeof item.description === "string") {
      points = item.description.split(/\n|•/).map(p => p.trim()).filter(Boolean);
    } else if (typeof item.points === "string") {
      points = item.points.split(/\n|•/).map(p => p.trim()).filter(Boolean);
    }
    return {
      title: item.title || "",
      company: item.company || "",
      location: item.location || "",
      duration: item.duration || "",
      points: points.length > 0 ? points : [""],
    };
  });
}

function sanitizeProjects(projList) {
  if (!Array.isArray(projList)) return [];
  return projList.map(p => {
    let tech = [];
    if (Array.isArray(p.tech)) {
      tech = p.tech.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof p.tech === "string") {
      tech = p.tech.split(/[,|;]/).map(t => t.trim()).filter(Boolean);
    }
    return {
      name: p.name || "",
      tech,
      description: p.description || "",
    };
  });
}

function sanitizeEducation(eduList) {
  if (!Array.isArray(eduList)) return [];
  return eduList.map(e => ({
    degree: e.degree || "",
    school: e.school || e.institution || "",
    year: e.year || "",
  }));
}

function sanitizeAchievements(achList) {
  if (!Array.isArray(achList)) return [];
  return achList.map(a => {
    if (typeof a === "string") {
      return { title: a, description: "", date: "" };
    }
    return {
      title: a.title || "",
      description: a.description || "",
      date: a.date || "",
    };
  });
}

async function parseResumeForProfile(resumeText) {
  const prompt = `You are an expert resume parser. Extract structured profile information from the resume text below to populate a candidate's master profile.

Return ONLY a valid JSON object matching this schema exactly (no markdown formatting, no code fences, no surrounding prose):
{
  "fullName": "Candidate full name",
  "email": "Candidate email address",
  "phone": "Phone number or empty string",
  "github": "GitHub username or profile URL or empty string",
  "linkedin": "LinkedIn username or profile URL or empty string",
  "portfolio": "Personal website or portfolio URL or empty string",
  "skills": ["Skill 1", "Skill 2"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country or Remote",
      "duration": "Duration (e.g. June 2022 - Present)",
      "points": ["Bullet point 1 detailing accomplishments", "Bullet point 2"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "tech": ["React", "Node.js"],
      "description": "Short description of the project"
    }
  ],
  "education": [
    {
      "degree": "Degree and major",
      "school": "University or institution name",
      "year": "Graduation year or date range"
    }
  ],
  "achievements": [
    {
      "title": "Award or milestone title",
      "description": "Details of the achievement",
      "date": "Year or date"
    }
  ]
}

Resume text:
${resumeText.slice(0, 10000)}`;

  try {
    const result = await flashModel.invoke([new HumanMessage(prompt)]);
    return safeJsonParse(result.content);
  } catch (err) {
    console.error("[parseResumeForProfile] LLM error:", err);
    return null;
  }
}

// ====================== Get Profile ======================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found. Please create one." });
    }

    // Parse JSON fields if they are stored as strings (for database consistency)
    const formattedProfile = parseJsonFields(profile, PROFILE_JSON_FIELDS);

    return res.status(200).json({ profile: formattedProfile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

/**
 * Build the profile data object from request body fields.
 * Used by both updateProfile and importProfileFromResume to avoid duplication.
 */
function buildProfileData({ fullName, email, phone, github, linkedin, portfolio, skills, experience, projects, education, achievements }) {
  return {
    fullName,
    email,
    phone: phone || "",
    github: github || "",
    linkedin: linkedin || "",
    portfolio: portfolio || "",
    skills: skills || [],
    experience: experience || [],
    projects: projects || [],
    education: education || [],
    achievements: achievements || [],
  };
}

// ====================== Update/Create Profile ======================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ msg: "Required fields: fullName and email" });
    }

    const profileData = buildProfileData(req.body);

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });

    return res.status(200).json({
      msg: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ====================== Import Profile From Resume ======================
export const importProfileFromResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({ msg: "Resume ID is required." });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
    });

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found or unauthorized." });
    }

    // Parse JSON fields from the resume (may be stored as strings)
    const parsed = parseJsonFields(resume, PROFILE_JSON_FIELDS);

    const profileData = buildProfileData({
      fullName: resume.fullName,
      email: resume.email,
      phone: resume.phone,
      github: resume.github,
      linkedin: resume.linkedin,
      portfolio: resume.portfolio,
      skills: parsed.skills,
      experience: parsed.experience,
      projects: parsed.projects,
      education: parsed.education,
      achievements: parsed.achievements,
    });

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });

    return res.status(200).json({
      msg: "Profile auto-populated from resume successfully.",
      profile,
    });
  } catch (error) {
    console.error("Error in importProfileFromResume:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// ====================== Upload & Import Profile from Local Resume ======================
export const uploadAndImportProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "Please select a resume file (.pdf or .txt) to upload." });
    }

    let text = "";
    if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
      try {
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();
        text = result.text || "";
      } catch (pdfErr) {
        console.warn("[Profile Controller] PDF parsing error, falling back to string:", pdfErr.message);
        text = file.buffer.toString("utf-8");
      }
    } else {
      text = file.buffer.toString("utf-8");
    }

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ 
        msg: "Could not extract readable text from the uploaded file. Please upload a valid PDF or text resume." 
      });
    }

    console.log(`[Profile Controller] Parsing resume for user ${userId}, length: ${text.length} chars`);

    // Call LLM to parse into master profile structure
    const parsed = await parseResumeForProfile(text);

    if (!parsed) {
      return res.status(422).json({ 
        msg: "Could not extract structured profile information from the uploaded resume. Please verify the document format." 
      });
    }

    // Fallback to user credentials if name or email are missing
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const fullName = (parsed.fullName && parsed.fullName.trim()) || user?.name || "Professional";
    const email = (parsed.email && parsed.email.trim()) || user?.email || "";

    const profileData = buildProfileData({
      fullName,
      email,
      phone: parsed.phone || "",
      github: parsed.github || "",
      linkedin: parsed.linkedin || "",
      portfolio: parsed.portfolio || "",
      skills: sanitizeArrayOfStrings(parsed.skills),
      experience: sanitizeExperience(parsed.experience),
      projects: sanitizeProjects(parsed.projects),
      education: sanitizeEducation(parsed.education),
      achievements: sanitizeAchievements(parsed.achievements),
    });

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });

    return res.status(200).json({
      msg: "Master profile created from your uploaded resume successfully.",
      profile,
    });
  } catch (error) {
    console.error("Error in uploadAndImportProfile:", error);
    return res.status(500).json({ msg: "Failed to process resume file. Please try again." });
  }
};
