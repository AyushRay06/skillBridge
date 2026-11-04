import { LandingLang } from "./landingTranslations";

export interface DashboardDictionary {
  header: {
    title: string;
    subtitle: string;
    oneClickApply: string;
    newResume: string;
    careerGuide: string;
  };
  metrics: {
    totalResumes: string;
    totalResumesDesc: string;
    jobsDiscovered: string;
    jobsDiscoveredDesc: string;
    activeAutopilots: string;
    activeAutopilotsDesc: string;
    live: string;
    placementReadiness: string;
    tier1Ready: string;
    roadmapsActive: (count: number) => string;
  };
  careerGuideHub: {
    title: string;
    subtitle: string;
    voiceReady: string;
    prompts: {
      skillGaps: string;
      roadmap: string;
      resumeReview: string;
    };
    startVoiceCall: string;
    openChat: string;
  };
  roadmap: {
    sectionTitle: string;
    allRoadmaps: (count: number) => string;
    targetRoleLabel: string;
    defaultRole: string;
    weeks: (weeks: number | string) => string;
    curriculumMilestones: string;
    completedCount: (done: number, total: number) => string;
    stepStatus: {
      done: string;
      inProgress: string;
      upcoming: string;
    };
    continuePath: string;
    emptyTitle: string;
    emptyDesc: string;
    generateRoadmap: string;
  };
  recentResumes: {
    sectionTitle: string;
    viewAll: (count: number) => string;
    untitled: string;
    updated: (date: string) => string;
    inspect: string;
    emptyTitle: string;
    createResume: string;
  };
  profile: {
    sectionTitle: string;
    edit: string;
    completeness: string;
    readyHint: string;
    incompleteHint: string;
    skillsCount: (count: number) => string;
    jobsCount: (count: number) => string;
    projectsCount: (count: number) => string;
    importFromResume: string;
  };
  autopilot: {
    sectionTitle: string;
    manage: string;
    active: string;
    paused: string;
    emptyDesc: string;
    configure: string;
  };
  whatsapp: {
    sectionTitle: string;
    liveBadge: string;
    desc: string;
    connect: string;
  };
}

export const DASHBOARD_TRANSLATIONS: Record<LandingLang, DashboardDictionary> = {
  en: {
    header: {
      title: "Dashboard",
      subtitle: "Track your resumes, active job applications, and placement readiness.",
      oneClickApply: "One-Click Apply",
      newResume: "New Resume",
      careerGuide: "Career Guide",
    },
    metrics: {
      totalResumes: "Total Resumes",
      totalResumesDesc: "Tailored ATS documents created",
      jobsDiscovered: "Jobs Discovered",
      jobsDiscoveredDesc: "Matching opportunities indexed",
      activeAutopilots: "Active Autopilots",
      activeAutopilotsDesc: "Background search agents running",
      live: "Live",
      placementReadiness: "Placement Readiness",
      tier1Ready: "Tier 1 Ready",
      roadmapsActive: (count: number) =>
        `${count} Career Roadmap${count !== 1 ? "s" : ""} active`,
    },
    careerGuideHub: {
      title: "Career Guide & Voice Advisory",
      subtitle:
        "Bilingual career consulting, placement readiness audits, and real-time mock interviews.",
      voiceReady: "Voice Call Ready",
      prompts: {
        skillGaps: "Analyze Skill Gaps",
        roadmap: "Generate Career Roadmap",
        resumeReview: "ATS Resume Review",
      },
      startVoiceCall: "Start Voice Call",
      openChat: "Open Advisory Chat",
    },
    roadmap: {
      sectionTitle: "Active Learning Roadmap",
      allRoadmaps: (count: number) => `All roadmaps (${count})`,
      targetRoleLabel: "Target Role",
      defaultRole: "Engineering Role",
      weeks: (weeks: number | string) => `~${weeks} Weeks`,
      curriculumMilestones: "Curriculum Milestones",
      completedCount: (done: number, total: number) =>
        `${done} / ${total} Completed`,
      stepStatus: {
        done: "Done",
        inProgress: "In Progress",
        upcoming: "Upcoming",
      },
      continuePath: "Continue Curriculum Path",
      emptyTitle: "No active roadmap saved",
      emptyDesc:
        "Synthesize a step-by-step learning roadmap tailored to your target role.",
      generateRoadmap: "Generate Roadmap",
    },
    recentResumes: {
      sectionTitle: "Recent Resumes",
      viewAll: (count: number) => `View all (${count})`,
      untitled: "Untitled Resume",
      updated: (date: string) => `Updated ${date}`,
      inspect: "Inspect",
      emptyTitle: "No resumes created yet",
      createResume: "Create Resume",
    },
    profile: {
      sectionTitle: "Master Profile",
      edit: "Edit",
      completeness: "Completeness",
      readyHint: "Ready for high-precision tailoring",
      incompleteHint: "Complete profile to improve match scoring",
      skillsCount: (count: number) => `${count} Skills`,
      jobsCount: (count: number) => `${count} Jobs`,
      projectsCount: (count: number) => `${count} Projects`,
      importFromResume: "Import from Resume",
    },
    autopilot: {
      sectionTitle: "Autopilot Agents",
      manage: "Manage",
      active: "Active",
      paused: "Paused",
      emptyDesc: "No autopilot queues created yet.",
      configure: "Configure Autopilots",
    },
    whatsapp: {
      sectionTitle: "WhatsApp Alerts",
      liveBadge: "Live",
      desc: "Get daily placement practice questions, roadmap milestone updates, and job alerts directly on WhatsApp.",
      connect: "Connect on WhatsApp",
    },
  },
  as: {
    header: {
      title: "ডেছব’ৰ্ড",
      subtitle: "আপোনাৰ ৰিজ্যুমে, সক্ৰিয় আবেদন আৰু কেৰিয়াৰ প্লেচমেণ্টৰ অগ্ৰগতি নিৰীক্ষণ কৰক।",
      oneClickApply: "এটা ক্লিকেৰে আবেদন",
      newResume: "নতুন ৰিজ্যুমে",
      careerGuide: "কেৰিয়াৰ গাইড",
    },
    metrics: {
      totalResumes: "মুঠ ৰিজ্যুমে",
      totalResumesDesc: "প্ৰস্তুত কৰা ATS ৰিজ্যুমে নথিপত্ৰ",
      jobsDiscovered: "চিনাক্ত কৰা চাকৰি",
      jobsDiscoveredDesc: "উপযুক্ত সুযোগসমূহ সংগ্ৰহ কৰা হৈছে",
      activeAutopilots: "সক্ৰিয় অটো-পাইলট",
      activeAutopilotsDesc: "পটভূমিত চলি থকা সন্ধান এজেণ্ট",
      live: "লাইভ",
      placementReadiness: "প্লেচমেণ্ট প্ৰস্তুতি",
      tier1Ready: "টিয়াৰ ১ সাজু",
      roadmapsActive: (count: number) => `${count}টা কেৰিয়াৰ ৰোডমেপ সক্ৰিয়`,
    },
    careerGuideHub: {
      title: "কেৰিয়াৰ গাইড আৰু ভয়েচ পৰামৰ্শ",
      subtitle:
        "দ্বিভাষিক কেৰিয়াৰ পৰামৰ্শ, প্লেচমেণ্ট মূল্যায়ন আৰু বাস্তৱ সময়ৰ মক সাক্ষাৎকাৰ।",
      voiceReady: "ভয়েচ কল সাজু",
      prompts: {
        skillGaps: "দক্ষতাৰ ব্যৱধান বিশ্লেষণ",
        roadmap: "কেৰিয়াৰ ৰোডমেপ প্ৰস্তুত কৰক",
        resumeReview: "ATS ৰিজ্যুমে পৰীক্ষা",
      },
      startVoiceCall: "ভয়েচ কল আৰম্ভ কৰক",
      openChat: "পৰামৰ্শ চেট খোলক",
    },
    roadmap: {
      sectionTitle: "সক্ৰিয় শিক্ষণ ৰোডমেপ",
      allRoadmaps: (count: number) => `সকলো ৰোডমেপ (${count})`,
      targetRoleLabel: "লক্ষ্য পদ",
      defaultRole: "অভিযান্ত্ৰিক পদ",
      weeks: (weeks: number | string) => `~${weeks} সপ্তাহ`,
      curriculumMilestones: "পাঠ্যক্ৰমৰ মাইলষ্টোনসমূহ",
      completedCount: (done: number, total: number) =>
        `${done} / ${total} সম্পন্ন হৈছে`,
      stepStatus: {
        done: "সমাপ্ত",
        inProgress: "চলি আছে",
        upcoming: "আগন্তুক",
      },
      continuePath: "পাঠ্যক্ৰম আগবঢ়াই নিয়ক",
      emptyTitle: "কোনো সক্ৰিয় ৰোডমেপ সংৰক্ষিত নাই",
      emptyDesc:
        "আপোনাৰ লক্ষ্য পদৰ সৈতে খাপ খোৱা এটা ক্ৰমান্বয়ে শিকাৰ ৰোডমেপ প্ৰস্তুত কৰক।",
      generateRoadmap: "ৰোডমেপ বনাওক",
    },
    recentResumes: {
      sectionTitle: "শেহতীয়া ৰিজ্যুমে",
      viewAll: (count: number) => `সকলো চাওক (${count})`,
      untitled: "নামবিহীন ৰিজ্যুমে",
      updated: (date: string) => `আপডেট: ${date}`,
      inspect: "পৰীক্ষা কৰক",
      emptyTitle: "এতিয়ালৈকে কোনো ৰিজ্যুমে সৃষ্টি কৰা হোৱা নাই",
      createResume: "ৰিজ্যুমে সৃষ্টি কৰক",
    },
    profile: {
      sectionTitle: "মাষ্টাৰ প্ৰফাইল",
      edit: "সম্পাদনা",
      completeness: "সম্পূৰ্ণতা",
      readyHint: "নিখুঁত ৰিজ্যুমে নিৰ্মাণৰ বাবে সাজু",
      incompleteHint: "মেচিং বৃদ্ধি কৰিবলৈ প্ৰফাইল সম্পূৰ্ণ কৰক",
      skillsCount: (count: number) => `${count}টা দক্ষতা`,
      jobsCount: (count: number) => `${count}টা চাকৰি`,
      projectsCount: (count: number) => `${count}টা প্ৰজেক্ট`,
      importFromResume: "ৰিজ্যুমেৰ পৰা আমদানি কৰক",
    },
    autopilot: {
      sectionTitle: "অটো-পাইলট এজেণ্ট",
      manage: "পৰিচালনা",
      active: "সক্ৰিয়",
      paused: "স্থগিত",
      emptyDesc: "এতিয়ালৈকে কোনো অটো-পাইলট শাৰী নাই।",
      configure: "অটো-পাইলট সংহতি কৰক",
    },
    whatsapp: {
      sectionTitle: "হোৱাটছএপ বাৰ্তা",
      liveBadge: "লাইভ",
      desc: "হোৱাটছএপত দৈনিক প্লেচমেণ্ট অনুশীলন প্ৰশ্ন, ৰোডমেপ আপডেট আৰু চাকৰিৰ জাননী লাভ কৰক।",
      connect: "হোৱাটছএপত সংযোগ কৰক",
    },
  },
};
