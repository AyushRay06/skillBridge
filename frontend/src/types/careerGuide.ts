export type CardPayloadType =
  | "resume_summary"
  | "role_recommendations"
  | "skill_gap"
  | "resume_review"
  | "roadmap"
  | "progress"
  | "job_matches"
  | "mock_interview"
  | "mock_interview_evaluation";

export interface CardPayload {
  type: CardPayloadType;
  data: any;
}

export interface CGMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  cardPayload?: CardPayload | null;
  createdAt: string;
}

export interface CGConversation {
  id: string;
  title: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

export interface CGRoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  whatToLearn: string;
  whyItMatters: string;
  resources: { label: string; url: string }[];
  estimatedDays?: number;
  status: "not_started" | "in_progress" | "done";
}

export interface CGRoadmap {
  id: string;
  title: string;
  targetRole?: string;
  targetSkill?: string;
  estimatedWeeks?: number;
  language: string;
  steps: CGRoadmapStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSummaryData {
  fullName?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: {
    company?: string;
    role?: string;
    duration?: string;
    description?: string;
  }[];
  education?: {
    institution?: string;
    degree?: string;
    year?: string;
  }[];
  projects?: {
    name?: string;
    description?: string;
    tech?: string[] | string;
  }[];
  achievements?: string[];
}

export interface RoleRecommendation {
  roleId?: string;
  roleName: string;
  roleNameLocalized?: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  why: string;
}

export interface SkillGapData {
  roleName: string;
  haveSkills: string[];
  missingSkills: string[];
  priorityMissing: string[];
}

export interface ResumeReviewData {
  reviewType?: "general" | "job_role" | "job_description";
  targetRole?: string;
  overallRating: number;
  matchPercentage?: number;
  summary: string;
  breakdown: {
    clarity?: number;
    skills?: number;
    projectImpact?: number;
    structure?: number;
    atsFriendliness?: number;
    roleRelevance?: number;
    keywordMatch?: number;
    experienceFit?: number;
    [key: string]: number | undefined;
  };
  matchedSkills?: string[];
  missingSkills?: string[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
  strengths?: string[];
  suggestions: string[];
}

export interface RoadmapData {
  id?: string;
  title: string;
  targetRole?: string;
  targetSkill?: string;
  estimatedWeeks?: number;
  steps: {
    stepNumber: number;
    title: string;
    whatToLearn: string;
    whyItMatters: string;
    resources: { label: string; url: string }[];
    estimatedDays?: number;
    status?: string;
  }[];
}

export interface MockInterviewQuestionData {
  topic?: string;
  role?: string;
  questionNumber: number;
  totalQuestions?: number;
  questionType?: "mcq" | "true_false" | "long_answer";
  question: string;
  options?: string[] | null;
  hint?: string | null;
  feedbackOnPrevious?: string | null;
  category?: string;
}

export interface MockInterviewEvaluationData {
  topic: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  grade: string;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  questions: {
    questionNumber: number;
    question: string;
    questionType: "mcq" | "true_false" | "long_answer";
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean | "partial";
    whatWentWrong?: string | null;
    howToImprove: string;
  }[];
}
