import { z } from "zod";

export const ParsedJobSchema = z.object({
  title: z.string().describe("Job title"),
  company: z.string().describe("Company name"),
  location: z.string().describe("Job location"),
  type: z.string().describe("full-time, part-time, contract, remote"),
  requiredSkills: z.array(z.string()).describe("Required technical skills"),
  preferredSkills: z.array(z.string()).describe("Nice-to-have skills"),
  experienceLevel: z.string().describe("junior, mid, senior, lead"),
  keyResponsibilities: z.array(z.string()).describe("Top 5 responsibilities"),
  keywords: z.array(z.string()).describe("ATS keywords to include in resume"),
});

export const MatchResultSchema = z.object({
  score: z.number().min(0).max(100).describe("Match score 0-100"),
  strengths: z.array(z.string()).describe("User's strengths matching this JD"),
  gaps: z.array(z.string()).describe("Skills or experience the user is missing"),
  suggestions: z.array(z.string()).describe("What to emphasize in the resume"),
});

export const ColdEmailSchema = z.object({
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body (plain text, professional tone)"),
});
