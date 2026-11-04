export type LandingLang = "en" | "as";

export interface LandingTranslations {
  nav: {
    pipeline: string;
    telemetry: string;
    platform: string;
    campus: string;
    multimodal: string;
    testimonials: string;
    pricing: string;
    faq: string;
    dashboard: string;
    logout: string;
    login: string;
    getStarted: string;
  };
  hero: {
    categoryTag: string;
    step1: string;
    step2: string;
    step3Badge: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    metrics: {
      speedValue: string;
      speedLabel: string;
      atsValue: string;
      atsLabel: string;
      timeValue: string;
      timeLabel: string;
    };
  };
  ticker: {
    liveTelemetry: string;
    statusHealthy: string;
    events: string[];
  };
  pipeline: {
    sectionTag: string;
    heading: string;
    subheading: string;
    levels: {
      l1: { tag: string; title: string; desc: string };
      l2: { tag: string; title: string; desc: string };
      l3: { tag: string; title: string; desc: string };
      l4: { tag: string; title: string; desc: string };
    };
    agents: {
      a1: { name: string; role: string; desc: string };
      a2: { name: string; role: string; desc: string };
      a3: { name: string; role: string; desc: string };
      a4: { name: string; role: string; desc: string };
      a5: { name: string; role: string; desc: string };
      a6: { name: string; role: string; desc: string };
    };
  };
  telemetry: {
    sectionTag: string;
    heading: string;
    subheading: string;
    chart1: { title: string; subtitle: string; callout: string };
    chart2: { title: string; subtitle: string; callout: string };
    chart3: { title: string; subtitle: string; callout: string };
    chart4: { title: string; subtitle: string; callout: string };
  };
  features: {
    sectionTag: string;
    heading: string;
    subheading: string;
    f1: { tag: string; title: string; desc: string; spec: string; cta: string };
    f2: { tag: string; title: string; desc: string; spec: string; cta: string };
    f3: { tag: string; title: string; desc: string; spec: string; cta: string };
  };
  campus: {
    sectionTag: string;
    heading: string;
    subheading: string;
    badge: string;
    readinessTitle: string;
    readinessSubtitle: string;
    mockTitle: string;
    mockSubtitle: string;
    c1: { tag: string; title: string; desc: string; spec: string; cta: string };
    c2: { tag: string; title: string; desc: string; spec: string; cta: string };
    c3: { tag: string; title: string; desc: string; spec: string; cta: string };
    whatsappBanner: { title: string; desc: string; cta: string };
  };
  multimodal: {
    sectionTag: string;
    heading: string;
    subheading: string;
    badge: string;
    providersHeading: string;
    capabilitiesHeading: string;
    m1: { tag: string; title: string; desc: string; spec: string };
    m2: { tag: string; title: string; desc: string; spec: string };
    m3: { tag: string; title: string; desc: string; spec: string };
    m4: { tag: string; title: string; desc: string; spec: string };
  };
  testimonials: {
    sectionTag: string;
    heading: string;
    subheading: string;
    items: { quote: string; author: string; role: string; metric: string }[];
  };
  pricing: {
    sectionTag: string;
    heading: string;
    subheading: string;
    monthly: string;
    yearly: string;
    yearlyBadge: string;
    starter: {
      name: string;
      desc: string;
      price: string;
      cta: string;
      features: string[];
    };
    pro: {
      name: string;
      desc: string;
      price: string;
      popularBadge: string;
      cta: string;
      features: string[];
    };
    elite: {
      name: string;
      desc: string;
      price: string;
      cta: string;
      features: string[];
    };
  };
  faq: {
    sectionTag: string;
    heading: string;
    subheading: string;
    items: { q: string; a: string }[];
  };
  footer: {
    description: string;
    columns: {
      product: string;
      architecture: string;
      resources: string;
      legal: string;
    };
    copyright: string;
    allRightsReserved: string;
  };
}

export const LANDING_TRANSLATIONS: Record<LandingLang, LandingTranslations> = {
  en: {
    nav: {
      pipeline: "Pipeline",
      telemetry: "Telemetry",
      platform: "Platform",
      campus: "Campus",
      multimodal: "Multimodal",
      testimonials: "Testimonials",
      pricing: "Pricing",
      faq: "FAQ",
      dashboard: "Dashboard",
      logout: "Log Out",
      login: "Log In",
      getStarted: "Get Started",
    },
    hero: {
      categoryTag: "6-AGENT AUTONOMOUS SYSTEM",
      step1: "Stop applying manually.",
      step2: "Deploy your career",
      step3Badge: "ON AUTOPILOT.",
      description:
        "Autonomous multi-agent infrastructure that discovers verified roles, compiles ATS-tailored LaTeX resumes, and submits applications on your cadence.",
      primaryCta: "Start Autopilot Free",
      secondaryCta: "Explore Pipeline",
      metrics: {
        speedValue: "300x",
        speedLabel: "Faster than manual dispatch",
        atsValue: "96.4%",
        atsLabel: "ATS first-pass rate",
        timeValue: "< 2 min",
        timeLabel: "Discovery to submission",
      },
    },
    ticker: {
      liveTelemetry: "LIVE TELEMETRY",
      statusHealthy: "SYSTEM OPTIMAL",
      events: [
        "DISCOVERY AGENT: 4,120 active roles indexed across Greenhouse & Lever",
        "SCORING AGENT: Match confidence threshold evaluated at 94.2%",
        "MULTIMODAL INFERENCE: Gemini 3.8 Flash & GPT-6 Terra visual document parsing verified",
        "CAREER CAMPUS: 18,400+ placement readiness benchmarks evaluated across 42 colleges",
        "LATEX SYNTHESIS: 1.8s compile latency per tailored artifact",
        "DISPATCH AGENT: Batch dispatch executing across 14 target queues",
        "WHATSAPP BOT: 98.2% message dispatch delivery for candidate roadmaps",
        "ATS VERIFICATION: 96.8% parser validation across Workday & Taleo",
      ],
    },
    pipeline: {
      sectionTag: "AUTONOMOUS DAG ARCHITECTURE",
      heading: "6-Agent Synchronized Execution Pipeline",
      subheading:
        "Every job posting flows through four deterministic execution levels without human friction.",
      levels: {
        l1: { tag: "LEVEL 01", title: "Target Ingestion", desc: "Real-time indexation from verified company career portals." },
        l2: { tag: "LEVEL 02", title: "Semantic Fit Scoring", desc: "Cosine vector matching against candidate telemetry profile." },
        l3: { tag: "LEVEL 03", title: "Tri-Artifact Synthesis", desc: "Parallel generation of LaTeX resume, cover letter, and cold email." },
        l4: { tag: "LEVEL 04", title: "Autonomous Dispatch", desc: "Verified delivery into applicant tracking endpoints." },
      },
      agents: {
        a1: { name: "Job Search Agent", role: "Portal Crawler", desc: "Continuously scrapes and parses raw job descriptions from Greenhouse, Lever, and Workday." },
        a2: { name: "Scoring Agent", role: "Vector Matcher", desc: "Evaluates semantic fit, keyword density, and experience requirements with mathematical precision." },
        a3: { name: "ATS LaTeX Agent", role: "Document Compiler", desc: "Produces clean, ATS-compliant LaTeX source code compiled into high-resolution vector PDF." },
        a4: { name: "Cover Letter Agent", role: "Narrative Builder", desc: "Drafts tailored executive narratives bridging candidate achievements to job requisitions." },
        a5: { name: "Outreach Email Agent", role: "Cold Outreach", desc: "Synthesizes concise, high-conversion cold emails directed at hiring managers and recruiters." },
        a6: { name: "Dispatch Agent", role: "Application Dispatch", desc: "Automates multi-step application form filling and submission verification queue." },
      },
    },
    telemetry: {
      sectionTag: "EMPIRICAL PERFORMANCE",
      heading: "Measurable Velocity Advantages",
      subheading: "Audited benchmarks across manual job search vs. autonomous multi-agent pipeline.",
      chart1: { title: "Time to Submit (Minutes)", subtitle: "Manual application vs. autonomous multi-agent pipeline", callout: "300x faster execution speed" },
      chart2: { title: "Monthly Subscription ROI", subtitle: "Consolidated infrastructure vs. disparate subscriptions", callout: "$133/month average candidate savings" },
      chart3: { title: "ATS Screen Pass Rate (%)", subtitle: "Standard Word/Canva resumes vs. CareerCrew LaTeX engine", callout: "96.4% verified ATS pass rate" },
      chart4: { title: "Application Dispatch Velocity", subtitle: "Monthly volume dispatched per active job seeker", callout: "380+ applications dispatched monthly" },
    },
    features: {
      sectionTag: "CORE CAPABILITIES",
      heading: "Architected for Job Search Mastery",
      subheading: "Everything required to dominate the modern technical job market.",
      f1: {
        tag: "CAPABILITY 01",
        title: "24/7 Autonomous Job Discovery",
        desc: "Never miss an opportunity. Our web-scale scrapers monitor thousands of top tech career pages continuously.",
        spec: "GREENHOUSE • LEVER • WORKDAY • LINKEDIN",
        cta: "Explore discovery engine",
      },
      f2: {
        tag: "CAPABILITY 02",
        title: "Dynamic LaTeX Tailoring Engine",
        desc: "Each application gets an uniquely tailored LaTeX resume highlighting matching skills and achievements mathematically.",
        spec: "PURE LATEX • ATS 96.4% • VECTOR PDF",
        cta: "Inspect resume compiler",
      },
      f3: {
        tag: "CAPABILITY 03",
        title: "One-Click Autopilot Dispatch",
        desc: "Choose between review-first semi-autonomous mode or full autopilot to apply while you sleep.",
        spec: "SEMI-AUTONOMOUS • FULL AUTOPILOT",
        cta: "View dispatch automation",
      },
    },
    campus: {
      sectionTag: "CAMPUS TO CAREER PLATFORM",
      heading: "Career Campus: Placement & Readiness Navigator",
      subheading:
        "Tailored for students, universities, and early-career talent. Turn coursework and academic projects into verified interview confidence with deterministic placement readiness scoring, AI mock interviews, and regional opportunities.",
      badge: "CAMPUS PLACEMENT HUB",
      readinessTitle: "Placement Readiness Index",
      readinessSubtitle: "Empirical score evaluated from skill coverage, ATS resume health & roadmap milestones.",
      mockTitle: "Interactive Mock Interview Simulator",
      mockSubtitle: "Technical & behavioral interview simulator with step-by-step hints and rubric evaluations.",
      c1: {
        tag: "CAMPUS // 01",
        title: "Placement Readiness Scoring",
        desc: "Stop wondering if you are placement-ready. Our deterministic scoring index audits your resume, coursework, and coding skills against real campus recruitment bars.",
        spec: "AUDITED 0-100% INDEX • ATS AUDIT • ZERO GUESSWORK",
        cta: "Calculate readiness score",
      },
      c2: {
        tag: "CAMPUS // 02",
        title: "Role-Specific Mock Interviews",
        desc: "Simulate rigorous technical coding rounds and behavioral interviews with step-by-step questions, real-time hints, and structured scorecard evaluations.",
        spec: "TECHNICAL & HR • HINTS • INSTANT RUBRIC GRADING",
        cta: "Start practice interview",
      },
      c3: {
        tag: "CAMPUS // 03",
        title: "Northeast & Regional Enterprise Tracks",
        desc: "Dedicated preparation pathways for APSC, Banking (SBI/IBPS), State Govt, Oil & Natural Gas (OIL/ONGC), and regional tech ventures with native multilingual support.",
        spec: "APSC • REGIONAL ENTERPRISE • PSUs • TRILINGUAL SUPPORT",
        cta: "Explore regional tracks",
      },
      whatsappBanner: {
        title: "SkillBridge WhatsApp Campus Companion",
        desc: "Receive daily campus practice questions, roadmap milestone updates, and job alerts straight to your phone via WhatsApp.",
        cta: "Connect on WhatsApp",
      },
    },
    multimodal: {
      sectionTag: "FRONTIER INTELLIGENCE MATRIX",
      heading: "Powered by Next-Gen Multimodal LLMs",
      subheading:
        "CareerCrew doesn't rely on a single generic LLM. We orchestrate frontier multimodal models across vision, voice, reasoning, and document synthesis to accelerate every stage of your career.",
      badge: "MULTIMODAL ORCHESTRATION",
      providersHeading: "Supported Frontier Model Engines",
      capabilitiesHeading: "Four Multimodal Execution Modalities",
      m1: {
        tag: "MODALITY 01",
        title: "Visual & Document Grounding",
        desc: "Ingests complex multi-column PDFs, academic transcripts, and portfolio images without OCR degradation or lost structure.",
        spec: "GEMINI 3.8 FLASH • GPT-6.1 TERRA • PDF-PARSE v2",
      },
      m2: {
        tag: "MODALITY 02",
        title: "Real-Time Hands-Free Voice Engine",
        desc: "Conduct full-duplex conversational voice mock interviews with live microphone streaming, low-latency synthesis, and audio waveform feedback.",
        spec: "WEB SPEECH API • FULL-DUPLEX AUDIO • LOW LATENCY",
      },
      m3: {
        tag: "MODALITY 03",
        title: "Trilingual Code-Switching Intelligence",
        desc: "Fluidly comprehends mixed-language dialect code-switching across Assamese, Hindi, and English technical terms without loss of precision.",
        spec: "ENGLISH • অসমীয়া • HINDI • SEAMLESS CODE-SWITCH",
      },
      m4: {
        tag: "MODALITY 04",
        title: "Reactive Structured Card UI Synthesis",
        desc: "Generates interactive card payloads (roadmaps, skill gap matrices, question scorecards) with rich UI components rather than flat markdown text.",
        spec: "TYPED JSON SCHEMAS • REACTIVE CARDS • ZERO MARKDOWN CLUTTER",
      },
    },
    testimonials: {
      sectionTag: "VERIFIED OUTCOMES",
      heading: "Trusted by Modern Job Seekers",
      subheading: "Real results from engineers, product managers, and specialists who automated their career search.",
      items: [
        {
          quote: "Applying used to feel like sending resumes into a black hole. With CareerCrew tailoring my frontend achievements to every spec, I landed 3 recruiter screens in week one.",
          author: "Alex Morgan",
          role: "Senior Frontend Engineer @ Stripe",
          metric: "3 Recruiter Calls in 7 Days",
        },
        {
          quote: "Most AI resume tools hallucinate skills you don't possess. CareerCrew actually understood my tech stack, preserved authentic truth, and scored 98% ATS match on my top choice.",
          author: "Priya Sharma",
          role: "Cloud Architect @ Snowflake",
          metric: "98% ATS First-Round Pass",
        },
        {
          quote: "The autopilot applied to 40 verified positions in my sleep. By Thursday I had an interview schedule that would have taken me three months to compile manually.",
          author: "Marcus Chen",
          role: "Data Platform Lead @ Databricks",
          metric: "40 Applications Dispatched",
        },
      ],
    },
    pricing: {
      sectionTag: "TRANSPARENT PRICING",
      heading: "Invest in Your Career Velocity",
      subheading: "Predictable, fair pricing with zero hidden fees. Upgrade or cancel anytime.",
      monthly: "Monthly billing",
      yearly: "Annual billing",
      yearlyBadge: "SAVE 20%",
      starter: {
        name: "Starter",
        desc: "Essential AI resume tailoring and manual search for active candidates.",
        price: "Free",
        cta: "Start Free",
        features: [
          "3 AI agent runs per month",
          "1 manual LaTeX resume generation daily",
          "Vector PDF and LaTeX source exports",
          "Basic ATS keyword scanner",
          "Community support",
        ],
      },
      pro: {
        name: "Professional",
        desc: "Semi-autonomous pipeline with live discovery and personalized cold outreach.",
        price: "$19",
        popularBadge: "MOST POPULAR",
        cta: "Get Professional",
        features: [
          "50 AI agent autopilot runs per month",
          "Unlimited LaTeX resume tailoring",
          "AI Cover Letters & Cold Outreach emails",
          "Multi-portal job scraping (Greenhouse/Lever)",
          "Advanced ATS matching analytics",
          "Priority job alert notifications",
        ],
      },
      elite: {
        name: "Elite",
        desc: "Maximum speed full autopilot dispatch with dedicated compute and career mentor.",
        price: "$49",
        cta: "Deploy Elite",
        features: [
          "Unlimited autonomous autopilot dispatches",
          "Full Career Guide AI Agent with Voice Calls",
          "Sequential Learning Roadmaps & Mock Interviews",
          "Custom ATS keyword optimization algorithms",
          "Dedicated priority cloud worker queue",
          "24/7 Concierge career support",
        ],
      },
    },
    faq: {
      sectionTag: "COMMON INQUIRIES",
      heading: "Frequently Asked Questions",
      subheading: "Everything you need to know about autonomous job search and ATS-tailored resumes.",
      items: [
        {
          q: "What is CareerCrew AI?",
          a: "CareerCrew is an autonomous multi-agent AI platform that discovers active job openings, calculates semantic fit, and compiles ATS-optimized LaTeX resumes, cover letters, and outreach emails for candidates.",
        },
        {
          q: "How does CareerCrew ensure resumes pass ATS filters?",
          a: "Our compiler validates resumes against parsing schemas for Greenhouse, Lever, and Workday, ensuring accurate keyword parity, standard section hierarchy, and clean typographic structure without unparseable graphics.",
        },
        {
          q: "Can I export pure LaTeX and Vector PDF files?",
          a: "Yes. Every generated resume can be previewed in your browser and exported in both lightweight Vector PDF and compile-ready LaTeX (.tex) format.",
        },
        {
          q: "How does the autonomous crawler and job match work?",
          a: "Agent 01 indexes openings across company career portals 24/7. Agent 02 performs cosine match scoring, advancing only openings that match your target profile and skill criteria.",
        },
        {
          q: "Do I have control before an application is submitted?",
          a: "Yes. You can choose Semi-Autonomous mode (requires your 1-click confirmation before submission) or Full Autopilot mode (auto-submits directly to the application queue).",
        },
        {
          q: "Can I cancel or change my plan anytime?",
          a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your billing dashboard with zero penalty.",
        },
        {
          q: "What is Career Campus and how does Placement Readiness work?",
          a: "Career Campus is our dedicated student and university placement hub. It evaluates your projects, coursework, and technical skills to generate an audited 0–100% Placement Readiness score, offers interactive mock interviews with real-time hints and scorecards, and curates customized learning roadmaps with regional placement opportunities.",
        },
        {
          q: "Which Multimodal LLMs are available on the platform?",
          a: "CareerCrew / SkillBridge orchestrates frontier multimodal models including Google Gemini 3.8 Flash & 3.1 Pro, OpenAI GPT-6 Astra & GPT-6.1 Terra, Anthropic Claude Fable 5.1 & Opus 5.5, DeepSeek V4 Pro (1M context), and Qwen 3.x for multilingual multimodal grounding across English, Hindi, and Assamese. You can switch models anytime in the Career Guide.",
        },
      ],
    },
    footer: {
      description: "Autonomous multi-agent infrastructure for live job discovery, ATS LaTeX synthesis, and automated dispatch.",
      columns: {
        product: "Platform",
        architecture: "Architecture",
        resources: "Resources",
        legal: "Legal",
      },
      copyright: "CareerCrew AI Inc.",
      allRightsReserved: "All rights reserved.",
    },
  },

  as: {
    nav: {
      pipeline: "পাইপলাইন",
      telemetry: "টেলিমেট্ৰি",
      platform: "প্লেটফৰ্ম",
      campus: "কেম্পাছ",
      multimodal: "মাল্টিম'ডেল",
      testimonials: "প্ৰশংসাপত্ৰ",
      pricing: "মূল্য নিৰ্ধাৰণ",
      faq: "প্ৰশ্নোত্তৰ",
      dashboard: "ডেশ্বব'ৰ্ড",
      logout: "লগ আউট",
      login: "লগ ইন",
      getStarted: "আৰম্ভ কৰক",
    },
    hero: {
      categoryTag: "৬-এজেণ্ট স্বায়ত্তশাসিত ব্যৱস্থা",
      step1: "মেনুৱেলভাৱে আবেদন কৰা বন্ধ কৰক।",
      step2: "আপোনাৰ কেৰিয়াৰ নিয়োজিত কৰক",
      step3Badge: "অটোপাইলটত।",
      description:
        "স্বায়ত্তশাসিত মাল্টি-এজেণ্ট আন্তঃগাঁথনি যিয়ে প্ৰমাণিত চাকৰি সন্ধান কৰে, ATS-অনুকূলিত LaTeX ৰিজিউমি প্ৰস্তুত কৰে আৰু আপোনাৰ গতি অনুসৰি আবেদন দাখিল কৰে।",
      primaryCta: "বিনামূলীয়াকৈ অটোপাইলট আৰম্ভ কৰক",
      secondaryCta: "পাইপলাইন চাওক",
      metrics: {
        speedValue: "৩০০ গুণ",
        speedLabel: "মেনুৱেল আবেদনতকৈ দ্ৰুত",
        atsValue: "৯৬.৪%",
        atsLabel: "ATS উত্তীৰ্ণ হোৱাৰ হাৰ",
        timeValue: "< ২ মিনিট",
        timeLabel: "সন্ধানৰ পৰা আবেদনলৈ",
      },
    },
    ticker: {
      liveTelemetry: "লাইভ টেলিমেট্ৰি",
      statusHealthy: "ব্যৱস্থা সক্ৰিয়",
      events: [
        "সন্ধান এজেণ্ট: গ্ৰীণহাউচ আৰু লিভাৰৰ পৰা ৪,১২০ টা সক্ৰিয় পদ সংগ্ৰহ কৰা হৈছে",
        "স্কোৰিং এজেণ্ট: প্ৰাৰ্থীৰ প্ৰ'ফাইলৰ সৈতে ৯৪.২% মিল মূল্যায়ন কৰা হৈছে",
        "মাল্টিম'ডেল ইঞ্জিন: Gemini 3.8 Flash আৰু GPT-6 Terra দ্বাৰা ৰিজিউমি বিশ্লেষণ প্ৰমাণিত",
        "কেৰিয়াৰ কেম্পাছ: ৪২ খন মহাবিদ্যালয়ত ১৮,৪০০+ শিক্ষাৰ্থীৰ প্লেচমেণ্ট প্ৰস্তুতি নিৰ্ধাৰিত",
        "LaTeX ৰিজিউমি নিৰ্মাণ: প্ৰতিটো ৰিজিউমি প্ৰস্তুত কৰিবলৈ মাত্ৰ ১.৮ ছেকেণ্ড সময় লাগে",
        "প্ৰেৰণ এজেণ্ট: ১৪ টা নিৰ্বাচিত কোম্পানীত স্বয়ংক্ৰিয়ভাৱে আবেদন প্ৰেৰণ চলি আছে",
        "হোৱাটছএপ বট: শিক্ষাৰ্থীৰ ৰোডমেপ প্ৰেৰণত ৯৮.২% সফলতা",
        "ATS পৰীক্ষণ: ৱৰ্কডে আৰু টালিঅ'ত ৯৬.৮% ৰিজিউমি সফলভাৱে গৃহীত হৈছে",
      ],
    },
    pipeline: {
      sectionTag: "স্বায়ত্তশাসিত পাইপলাইন গাঁথনি",
      heading: "৬-এজেণ্টৰ সুসংহত কাৰ্যকৰী ব্যৱস্থা",
      subheading: "প্ৰতিটো চাকৰি কোনো মানৱীয় হস্তক্ষেপ নোহোৱাকৈ চাৰিটা স্তৰৰ মাজেৰে স্বয়ংক্ৰিয়ভাৱে অগ্ৰসৰ হয়।",
      levels: {
        l1: { tag: "স্তৰ ০১", title: "চাকৰি সংগ্ৰহ", desc: "প্ৰমাণিত কোম্পানী পৰ্টেলৰ পৰা বাস্তৱ সময়ত চাকৰি সংগ্ৰহ।" },
        l2: { tag: "স্তৰ ০২", title: "যোগ্যতা মূল্যায়ন", desc: "প্ৰাৰ্থীৰ কৌশলৰ সৈতে চাকৰিৰ যোগ্যতাৰ নিখুঁত মিল পৰীক্ষা।" },
        l3: { tag: "স্তৰ ০৩", title: "নথি প্ৰস্তুতকৰণ", desc: "LaTeX ৰিজিউমি, কভাৰ লেটাৰ আৰু আউটৰিচ ইমেইল একেলগে প্ৰস্তুত।" },
        l4: { tag: "স্তৰ ০৪", title: "স্বয়ংক্ৰিয় আবেদন", desc: "কোম্পানীৰ আবেদন ব্যৱস্থাত নিশ্চিত আবেদন দাখিল।" },
      },
      agents: {
        a1: { name: "চাকৰি সন্ধান এজেণ্ট", role: "পৰ্টেল ক্ৰলাৰ", desc: "গ্ৰীণহাউচ, লিভাৰ আৰু ৱৰ্কডেৰ পৰা নিৰন্তৰ নতুন চাকৰিৰ তথ্য সংগ্ৰহ কৰে।" },
        a2: { name: "স্কোৰিং এজেণ্ট", role: "ভেক্টৰ মেচাৰ", desc: "আপোনাৰ অভিজ্ঞতা আৰু প্ৰয়োজনীয় দক্ষতাৰ নিখুঁত মিল পৰীক্ষা কৰে।" },
        a3: { name: "ATS LaTeX এজেণ্ট", role: "নথি সংকলক", desc: "ATS স্কেনাৰত সহজে উত্তীৰ্ণ হ'ব পৰা নিখুঁত LaTeX আৰু PDF ৰিজিউমি প্ৰস্তুত কৰে।" },
        a4: { name: "কভাৰ লেটাৰ এজেণ্ট", role: "কভাৰ লেটাৰ নিৰ্মাতা", desc: "চাকৰিৰ প্ৰয়োজনীয়তা অনুসৰি আকৰ্ষণীয় আৰু ব্যক্তিগত কভাৰ লেটাৰ লিখে।" },
        a5: { name: "ইমেইল আউটৰিচ এজেণ্ট", role: "ইমেইল যোগাযোগ", desc: "নিয়োগকাৰীৰ বাবে সংক্ষেপ অথচ ফলপ্ৰসূ ব্যক্তিগত ইমেইল প্ৰস্তুত কৰে।" },
        a6: { name: "প্ৰেৰণ এজেণ্ট", role: "আবেদন প্ৰেৰক", desc: "ফৰ্ম পূৰণ কৰি নিৰ্ধাৰিত সময়ত সম্পূৰ্ণ স্বয়ংক্ৰিয়ভাৱে আবেদন প্ৰেৰণ কৰে।" },
      },
    },
    telemetry: {
      sectionTag: "প্ৰমাণিত পৰিসংখ্যা",
      heading: "পৰিমাপযোগ্য গতি আৰু সফলতা",
      subheading: "মেনুৱেল চাকৰি সন্ধান বনাম মাল্টি-এজেণ্ট ব্যৱস্থাৰ তুলনামূলক তথ্য।",
      chart1: { title: "আবেদনৰ সময় (মিনিটত)", subtitle: "মেনুৱেল আবেদন বনাম স্বায়ত্তশাসিত এজেণ্ট ব্যৱস্থা", callout: "৩০০ গুণ দ্ৰুত কাৰ্যকৰী গতি" },
      chart2: { title: "মাহিলী বিনিয়োগৰ লাভ", subtitle: "পৃথক ছাবস্ক্ৰিপশ্বনৰ তুলনাত কেৰিয়াৰক্ৰুৰ ব্যয় সংকোচন", callout: "গড়ে মাহে ১৩৩ ডলাৰ সঞ্চয়" },
      chart3: { title: "ATS উত্তীৰ্ণৰ হাৰ (%)", subtitle: "সাধাৰণ ৱৰ্ড/কেনভা ৰিজিউমি বনাম LaTeX ৰিজিউমি", callout: "৯৬.৪% প্ৰমাণিত ATS উত্তীৰ্ণ হাৰ" },
      chart4: { title: "মাহিলী আবেদনৰ গতি", subtitle: "প্ৰতিজন সক্ৰিয় চাকৰি প্ৰাৰ্থীৰ মাহিলী আবেদন সংখ্যা", callout: "মাহে ৩৮০+ আবেদন প্ৰেৰণ" },
    },
    features: {
      sectionTag: "মূল সুবিধাসমূহ",
      heading: "চাকৰি সন্ধানত অগ্ৰণী হোৱাৰ বাবে বিশেষভাৱে নিৰ্মিত",
      subheading: "আধুনিক প্ৰযুক্তিগত চাকৰি বজাৰত সফলতা লাভ কৰিবলৈ প্ৰয়োজনীয় সকলো সুবিধা।",
      f1: {
        tag: "সুবিধা ০১",
        title: "২৪/৭ স্বয়ংক্ৰিয় চাকৰি সন্ধান",
        desc: "কোনো সুযোগ হেৰুৱাই নাযাব। আমাৰ এজেণ্টে শীৰ্ষ কোম্পানীৰ হাজাৰ হাজাৰ পদ নিৰন্তৰ নিৰীক্ষণ কৰে।",
        spec: "গ্ৰীণহাউচ • লিভাৰ • ৱৰ্কডে • লিংকডইন",
        cta: "সন্ধান ইঞ্জিন চাওক",
      },
      f2: {
        tag: "সুবিধা ০২",
        title: "গতিশীল LaTeX ৰিজিউমি অনুকূলন",
        desc: "প্ৰতিটো চাকৰিৰ বাবে প্ৰাসঙ্গিক দক্ষতা আৰু সাফল্য স্পষ্টভাৱে প্ৰতিফলিত কৰা বিশেষ ৰিজিউমি প্ৰস্তুত হয়।",
        spec: "বিশুদ্ধ LATEX • ৯৬.৪% ATS উত্তীৰ্ণ • ভেক্টৰ PDF",
        cta: "ৰিজিউমি সংকলক চাওক",
      },
      f3: {
        tag: "সুবিধা ০৩",
        title: "এক ক্লিকে অটোপাইলট প্ৰেৰণ",
        desc: "পুনৰীক্ষণ কৰি প্ৰেৰণ কৰাৰ বাবে অৰ্ধ-স্বায়ত্তশাসিত বিকল্প বা টোপনিতো আবেদন চলাবলৈ সম্পূৰ্ণ অটোপাইলট বাছক।",
        spec: "অৰ্ধ-স্বায়ত্তশাসিত • সম্পূৰ্ণ অটোপাইলট",
        cta: "স্বয়ংক্ৰিয় প্ৰেৰণ চাওক",
      },
    },
    campus: {
      sectionTag: "কেম্পাছৰ পৰা কেৰিয়াৰ প্লেটফৰ্ম",
      heading: "কেৰিয়াৰ কেম্পাছ: প্লেচমেণ্ট আৰু প্ৰস্তুতি নিৰ্দেশক",
      subheading:
        "ছাত্ৰ-ছাত্ৰী, বিশ্ববিদ্যালয় আৰু নৱাগত প্ৰাৰ্থীসকলৰ বাবে বিশেষভাৱে নিৰ্মিত। পাঠ্যক্ৰম আৰু শৈক্ষিক প্ৰকল্পসমূহক নিশ্চিত সাক্ষাৎকাৰ আত্মবিশ্বাসলৈ ৰূপান্তৰ কৰক।",
      badge: "কেম্পাছ প্লেচমেণ্ট কেন্দ্ৰ",
      readinessTitle: "প্লেচমেণ্ট প্ৰস্তুতি সূচক",
      readinessSubtitle: "দক্ষতাৰ পৰিসৰ, ATS ৰিজিউমিৰ মান আৰু ৰোডমেপ অগ্ৰগতিৰ পৰা নিৰ্ধাৰিত বাস্তৱিক স্কোৰ।",
      mockTitle: "আন্তঃক্ৰিয়ামুখী মক সাক্ষাৎকাৰ চিমুলেটৰ",
      mockSubtitle: "পদ-ভিত্তিক কাৰিকৰী আৰু আচৰণগত সাক্ষাৎকাৰ সহ বাস্তৱ সময়ৰ ইঙ্গিত আৰু ৰুব্ৰিক মূল্যায়ন।",
      c1: {
        tag: "কেম্পাছ // ০১",
        title: "প্লেচমেণ্ট প্ৰস্তুতি মূল্যায়ন",
        desc: "আপুনি কেম্পাছ নিযুক্তিৰ বাবে প্ৰস্তুত নে নহয় তাক লৈ চিন্তা নকৰিব। আমাৰ নিৰ্ধাৰিত সূচকে আপোনাৰ ৰিজিউমি আৰু দক্ষতাক কোম্পানীৰ নিযুক্তি মাপকাঠীৰ সৈতে তুলনা কৰে।",
        spec: "০-১০০% প্ৰস্তুতি স্কোৰ • ATS পৰীক্ষণ • নিশ্চিত তথ্য",
        cta: "প্ৰস্তুতি স্কোৰ গণনা কৰক",
      },
      c2: {
        tag: "কেম্পাছ // ০২",
        title: "পদ-ভিত্তিক মক সাক্ষাৎকাৰ",
        desc: "প্ৰতিটো পদক্ষেপত প্ৰশ্ন, তাৎক্ষণিক সহায়ক ইঙ্গিত আৰু গাঁথনিগত স্কোৰকাৰ্ড সহ কঠিন কাৰিকৰী আৰু এইচ.আৰ. সাক্ষাৎকাৰৰ অনুশীলন কৰক।",
        spec: "কাৰিকৰী আৰু HR • বাস্তৱ সময়ৰ সহায় • তাৎক্ষণিক মূল্যায়ন",
        cta: "মক সাক্ষাৎকাৰ আৰম্ভ কৰক",
      },
      c3: {
        tag: "কেম্পাছ // ০৩",
        title: "উত্তৰ-পূৰ্বাঞ্চল আৰু আঞ্চলিক কেৰিয়াৰ ট্ৰেক",
        desc: "APSC, বেংকিং (SBI/IBPS), ৰাজ্য চৰকাৰৰ পদ, OIL/ONGC আৰু স্থানীয় ষ্টাৰ্টআপসমূহৰ বাবে অসমীয়া আৰু হিন্দী ভাষাত বিশেষ প্ৰস্তুতি সুবিধা।",
        spec: "APSC • আঞ্চলিক প্ৰতিষ্ঠান • PSUs • ত্ৰিভাষিক সহায়",
        cta: "আঞ্চলিক সুযোগ চাওক",
      },
      whatsappBanner: {
        title: "স্কিলব্ৰিজ হোৱাটছএপ কেম্পাছ সহযোগী",
        desc: "হোৱাটছএপৰ জৰিয়তে পোনপটীয়াকৈ দৈনিক কেম্পাছ অনুশীলন প্ৰশ্ন, ৰোডমেপ আৰু চাকৰিৰ জাননী লাভ কৰক।",
        cta: "হোৱাটছএপত সংযোগ কৰক",
      },
    },
    multimodal: {
      sectionTag: "অত্যাধুনিক মাল্টিম'ডেল বুদ্ধিমত্তা",
      heading: "উন্নত মাল্টিম'ডেল LLM দ্বাৰা চালিত",
      subheading:
        "কেৰিয়াৰক্ৰু কোনো এটা সাধাৰণ মডেলৰ ওপৰত নিৰ্ভৰ নকৰে। আমি দৃষ্টি, কণ্ঠ, কাৰিকৰী ক'ড আৰু যুক্তিৰ ক্ষেত্ৰত বিশ্বমানৰ মাল্টিম'ডেল মডেলসমূহ ব্যৱহাৰ কৰোঁ।",
      badge: "মাল্টিম'ডেল সমন্বয়",
      providersHeading: "সমৰ্থিত শীৰ্ষ AI ইঞ্জিনসমূহ",
      capabilitiesHeading: "চাৰিটা মাল্টিম'ডেল কাৰ্যকৰী দিশ",
      m1: {
        tag: "সুবিধা ০১",
        title: "নথি আৰু ভিজুৱেল বিশ্লেষণ",
        desc: "জটিল বহু-স্তম্ভ PDF ৰিজিউমি, বিশ্ববিদ্যালয়ৰ নম্বৰ তালিকা আৰু প্ৰমাণপত্ৰ কোনো ক্ষতি নোহোৱাকৈ নিখুঁতভাৱে বুজি পায়।",
        spec: "GEMINI 3.8 FLASH • GPT-6.1 TERRA • PDF বিশ্লেষণ",
      },
      m2: {
        tag: "সুবিধা ০২",
        title: "বাস্তৱ সময়ৰ কণ্ঠ সাক্ষাৎকাৰ ইঞ্জিন",
        desc: "লাইভ মাইক্ৰ'ফোন আৰু স্পষ্ট কণ্ঠ সহ পোনপটীয়াকৈ কথা পাতি মক সাক্ষাৎকাৰ অনুশীলন কৰক।",
        spec: "WEB SPEECH API • তাৎক্ষণিক কণ্ঠ সংযোগ • নিম্ন লেটেন্সি",
      },
      m3: {
        tag: "সুবিধা ০৩",
        title: "ত্ৰিভাষিক ক'ড-ছুইচিং বুদ্ধিমত্তা",
        desc: "অসমীয়া, হিন্দী আৰু ইংৰাজী মিশ্ৰিত বাক্যসমূহৰ সূক্ষ্ম অৰ্থ নিখুঁতভাৱে অনুধাৱন কৰে।",
        spec: "ইংৰাজী • অসমীয়া • হিন্দী • নিৰৱচ্ছিন্ন ভাষা পৰিৱৰ্তন",
      },
      m4: {
        tag: "সুবিধা ০৪",
        title: "গাঁথনিগত কাৰ্ড UI নিৰ্মাণ",
        desc: "কেৱল পাঠ্য বাৰ্তাৰ পৰিৱৰ্তে শিক্ষণ ৰোডমেপ, স্কিল গেপ আৰু সাক্ষাৎকাৰ মূল্যায়নৰ আকৰ্ষণীয় কাৰ্ড প্ৰদৰ্শন কৰে।",
        spec: "প্ৰকাৰযুক্ত JSON • সংবেদনশীল কাৰ্ড • নিকা ব্যৱহাৰকাৰী মাধ্যম",
      },
    },
    testimonials: {
      sectionTag: "প্ৰমাণিত ফলাফল",
      heading: "আমাৰ ব্যৱহাৰকাৰীসকলৰ বিশ্বাস",
      subheading: "চাকৰি সন্ধান স্বয়ংক্ৰিয় কৰি কেৰিয়াৰ সফল কৰা অভিযন্তা আৰু বিশেষজ্ঞসকলৰ প্ৰকৃত মতামত।",
      items: [
        {
          quote: "পূৰ্বে আবেদন কৰা মানে অন্ধকাৰত ৰিজিউমি নিক্ষেপ কৰা যেন লাগিছিল। কেৰিয়াৰক্ৰু ব্যৱহাৰ কৰাৰ মাত্ৰ এসপ্তাহৰ ভিতৰতে মই ৩ টা নিযুক্তিদাতাৰ সাক্ষাৎকাৰ পালোঁ।",
          author: "এলেক্স মৰ্গান",
          role: "জ্যেষ্ঠ ফ্ৰণ্টএণ্ড অভিযন্তা @ ষ্ট্ৰাইপ",
          metric: "৭ দিনত ৩টা সাক্ষাৎকাৰ",
        },
        {
          quote: "বহুতো AI টুলে নথকা কৌশল সংযোগ কৰে। কিন্তু কেৰিয়াৰক্ৰুৱে মোৰ বাস্তৱিক দক্ষতাসমূহ বুজি পাই ৯৮% ATS মিল সহ প্ৰথম পচন্দৰ কোম্পানীত মোৰ ৰিজিউমি প্ৰৱেশ কৰালে।",
          author: "প্ৰিয়া শৰ্মা",
          role: "ক্লাউড আৰ্কিটেক্ট @ স্নোফ্লেক",
          metric: "৯৮% ATS প্ৰথম ৰাউণ্ড উত্তীৰ্ণ",
        },
        {
          quote: "মই টোপনিত থাকোতেই অটোপাইলটে ৪০টা পদত আবেদন কৰিলে। বৃহস্পতিবাৰৰ ভিতৰত মোৰ হাতত সাক্ষাৎকাৰৰ তালিকা আছিল যিটো মেনুৱেলভাৱে কৰিবলৈ ৩ মাহ লাগিলেহেঁতেন।",
          author: "মাৰ্কাছ চেন",
          role: "ডাটা প্লেটফৰ্ম প্ৰধান @ ডাটাাব্ৰিক্স",
          metric: "৪০টা নিশ্চিত আবেদন প্ৰেৰণ",
        },
      ],
    },
    pricing: {
      sectionTag: "স্বচ্ছ মূল্য তালিকা",
      heading: "আপোনাৰ কেৰিয়াৰত বিনিয়োগ কৰক",
      subheading: "কোনো গোপন মূল্য অবিহনে স্পষ্ট আৰু যুক্তিসংগত পৰিকল্পনা। যিকোনো সময়তে সলনি কৰক।",
      monthly: "মাহেকীয়া বিলিং",
      yearly: "বাৰ্ষিক বিলিং",
      yearlyBadge: "২০% ৰেহাই",
      starter: {
        name: "ষ্টাৰ্টাৰ",
        desc: "সক্ৰিয় প্ৰাৰ্থীৰ বাবে প্ৰাথমিক AI ৰিজিউমি অনুকূলন আৰু সন্ধান।",
        price: "বিনামূলীয়া",
        cta: "বিনামূলীয়াকৈ আৰম্ভ কৰক",
        features: [
          "মাহে ৩টা AI এজেণ্ট ৰান",
          "দৈনিক ১টা মেনুৱেল LaTeX ৰিজিউমি নিৰ্মাণ",
          "ভেক্টৰ PDF আৰু LaTeX ফাইল ডাউনল'ড",
          "প্ৰাথমিক ATS কী-ৱৰ্ড স্কেনাৰ",
          "কমিউনিটি সহায়",
        ],
      },
      pro: {
        name: "প্ৰফেচনেল",
        desc: "লাইভ সন্ধান আৰু ব্যক্তিগত ইমেইল সহ অৰ্ধ-স্বায়ত্তশাসিত পাইপলাইন।",
        price: "১৯ ডলাৰ",
        popularBadge: "সৰ্বাধিক জনপ্ৰিয়",
        cta: "প্ৰফেচনেল লওক",
        features: [
          "মাহে ৫০টা AI এজেণ্ট অটোপাইলট ৰান",
          "সীমাহীন LaTeX ৰিজিউমি অনুকূলন",
          "AI কভাৰ লেটাৰ আৰু আউটৰিচ ইমেইল",
          "গ্ৰীণহাউচ/লিভাৰ চাকৰি সন্ধান",
          "উন্নত ATS বিশ্লেষণ",
          "প্ৰাথমিক চাকৰি জাননী",
        ],
      },
      elite: {
        name: "এলিট",
        desc: "কেৰিয়াৰ গাইড আৰু ভইচ কল সহ সৰ্বোচ্চ গতিৰ সম্পূৰ্ণ অটোপাইলট।",
        price: "৪৯ ডলাৰ",
        cta: "এলিট নিয়োজিত কৰক",
        features: [
          "সীমাহীন স্বায়ত্তশাসিত অটোপাইলট আবেদন",
          "কেৰিয়াৰ গাইড AI এজেণ্ট আৰু ভইচ কল",
          "পৰ্যায়ক্ৰমিক ৰোডমেপ আৰু মক সাক্ষাৎকাৰ",
          "বিশেষ ATS কী-ৱৰ্ড অনুকূলন এলগৰিথম",
          "উচ্চ গতিৰ ক্লাউড ৱৰ্কাৰ",
          "২৪/৭ ব্যক্তিগত কেৰিয়াৰ সহায়",
        ],
      },
    },
    faq: {
      sectionTag: "প্ৰশ্নোত্তৰ",
      heading: "সঘনাই সোধা প্ৰশ্নসমূহ",
      subheading: "স্বায়ত্তশাসিত চাকৰি সন্ধান আৰু ATS ৰিজিউমি সম্পৰ্কে জানিবলগীয়া সকলো তথ্য।",
      items: [
        {
          q: "কেৰিয়াৰক্ৰু AI কি?",
          a: "কেৰিয়াৰক্ৰু হৈছে এটা স্বায়ত্তশাসিত মাল্টি-এজেণ্ট AI প্লেটফৰ্ম যিয়ে সক্ৰিয় চাকৰি বিচাৰি উলিয়ায়, প্ৰাৰ্থীৰ যোগ্যতা মূল্যায়ন কৰে আৰু ATS-অনুকূলিত LaTeX ৰিজিউমি, কভাৰ লেটাৰ আৰু ইমেইল প্ৰস্তুত কৰে।",
        },
        {
          q: "ৰিজিউমি কেনেকৈ ATS স্কেনাৰত উত্তীৰ্ণ হয়?",
          a: "আমাৰ ইঞ্জিনে গ্ৰীণহাউচ, লিভাৰ আৰু ৱৰ্কডেৰ পেটাৰ্ণ অনুসৰি ৰিজিউমি প্ৰস্তুত কৰে, যাৰ ফলত সঠিক কী-ৱৰ্ড আৰু স্পষ্ট বিন্যাস সহ সহজে গৃহীত হয়।",
        },
        {
          q: "মই LaTeX আৰু PDF ফাইল ডাউনল'ড কৰিব পাৰিমনে?",
          a: "হয়। আপুনি ব্ৰাউজাৰতে ৰিজিউমি চাব পাৰিব আৰু উচ্চ মানৰ ভেক্টৰ PDF আৰু LaTeX (.tex) ফাইল ডাউনল'ড কৰিব পাৰিব।",
        },
        {
          q: "স্বয়ংক্ৰিয় সন্ধান আৰু যোগ্যতা নিৰ্ধাৰণ কেনেকৈ কাম কৰে?",
          a: "এজেণ্ট ০১ এ কোম্পানী পৰ্টেলসমূহ ২৪/৭ পৰ্যবেক্ষণ কৰে। এজেণ্ট ০২ এ আপোনাৰ কৌশল আৰু প্ৰয়োজনীয়তাৰ নিখুঁত মিল পৰীক্ষা কৰি কেৱল উপযুক্ত পদসমূহ বাছনি কৰে।",
        },
        {
          q: "আবেদন প্ৰেৰণ কৰাৰ আগতে মই পৰীক্ষা কৰিব পাৰিমনে?",
          a: "হয়। আপুনি অৰ্ধ-স্বায়ত্তশাসিত মোড বাছি আপোনাৰ অনুমতি সাপেক্ষে প্ৰেৰণ কৰিব পাৰে, অথবা সম্পূৰ্ণ অটোপাইলট বাছি স্বয়ংক্ৰিয়ভাৱে আবেদন চলাব পাৰে।",
        },
        {
          q: "মই যেতিয়াই ইচ্ছা মোৰ পৰিকল্পনা বাতিল কৰিব পাৰিমনে?",
          a: "হয়। আপুনি যিকোনো সময়তে ডেশ্বব'ৰ্ডৰ পৰা কোনো অতিৰিক্ত মাচুল অবিহনে আপোনাৰ ছাবস্ক্ৰিপশ্বন আপগ্ৰেড, ডাউনগ্ৰেড বা বাতিল কৰিব পাৰিব।",
        },
        {
          q: "কেৰিয়াৰ কেম্পাছ কি আৰু প্লেচমেণ্ট প্ৰস্তুতি সূচক কেনেকৈ কাম কৰে?",
          a: "কেৰিয়াৰ কেম্পাছ হৈছে ছাত্ৰ-ছাত্ৰী আৰু বিশ্ববিদ্যালয়ৰ বাবে নিৰ্মিত প্লেচমেণ্ট হাব। ই আপোনাৰ শৈক্ষিক প্ৰকল্প আৰু দক্ষতাক মূল্যায়ন কৰি ০-১০০% প্ৰস্তুতি স্কোৰ প্ৰদান কৰে, ৰুব্ৰিক আৰু ইঙ্গিত সহ লাইভ মক সাক্ষাৎকাৰ চলায় আৰু আঞ্চলিক নিযুক্তিৰ সুযোগ প্ৰদান কৰে।",
        },
        {
          q: "প্লেটফৰ্মত কি কি মাল্টিম'ডেল LLM উপলব্ধ?",
          a: "কেৰিয়াৰক্ৰু / স্কিলব্ৰিজত Google Gemini 3.8 Flash আৰু 3.1 Pro, OpenAI GPT-6 Astra আৰু GPT-6.1 Terra, Anthropic Claude Fable 5.1 আৰু Opus 5.5, DeepSeek V4 Pro (১ নিযুত কনটেক্সট) আৰু ত্ৰিভাষিক Qwen 3.x অন্তৰ্ভুক্ত আছে। আপুনি কেৰিয়াৰ গাইডত যিকোনো সময়তে মডেল সলনি কৰিব পাৰে।",
        },
      ],
    },
    footer: {
      description: "লাইভ চাকৰি সন্ধান, ATS LaTeX ৰিজিউমি নিৰ্মাণ আৰু স্বয়ংক্ৰিয় আবেদনৰ বাবে স্বায়ত্তশাসিত মাল্টি-এজেণ্ট আন্তঃগাঁথনি।",
      columns: {
        product: "প্লেটফৰ্ম",
        architecture: "স্থাপত্য",
        resources: "সম্পদ",
        legal: "আইনী",
      },
      copyright: "কেৰিয়াৰক্ৰু AI",
      allRightsReserved: "সৰ্বস্বত্ব সংৰক্ষিত।",
    },
  },
};
