import prisma from "../lib/prisma.js";
import { parseJsonFields, PROFILE_JSON_FIELDS } from "../lib/helpers.js";

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
