import Features from "@/components/Features";
import CampusSection from "@/components/CampusSection";
import MultimodalSection from "@/components/MultimodalSection";
import { FooterNew } from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import Testimonial from "@/components/TestimonialSection";
import FaqSection from "@/components/FaqSection";
import PipelineFlowSection from "@/components/PipelineFlowSection";
import TelemetryStatsSection from "@/components/TelemetryStatsSection";
import LiveMarqueeTicker from "@/components/LiveMarqueeTicker";
import GrainOverlay from "@/components/GrainOverlay";
import HatchedSectionDivider from "@/components/HatchedSectionDivider";
import Navbar from "@/components/Navbar";
import { LandingLanguageProvider } from "@/contexts/LandingLanguageContext";
import type { Metadata } from "next";
import { Briefcase, Laptop, Globe, FileText, Sparkles, GraduationCap, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "CareerCrew & SkillBridge AI — Autonomous Multi-Agent Career Campus & Multimodal LLM Platform",
  description:
    "Empowering early-career talent and job seekers with Career Campus placement readiness scoring, interactive AI mock interviews, sequential learning roadmaps, 14 frontier multimodal LLMs (Gemini 3.8, GPT-6, Claude 5.5, DeepSeek V4), and 6-agent autonomous job application dispatch on autopilot.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <LandingLanguageProvider>
      <div className="landing-page relative min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
        {/* High-frequency analog film-grain texture overlay */}
        <GrainOverlay />

        <Navbar />

        <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" aria-label="AI Resume Builder Hero">
          <HeroSection />
        </section>

        {/* Live System Telemetry Continuous Marquee Ticker (No divider right after marquee) */}
        <LiveMarqueeTicker />

        {/* 6-Agent Autonomous Pipeline DAG Architecture */}
        <PipelineFlowSection />

        {/* Clean Architectural Hatched Divider with centered job icon */}
        <HatchedSectionDivider icon={Briefcase} />

        {/* Platform Telemetry & Empirical Performance Statistics */}
        <TelemetryStatsSection />

        {/* Clean Architectural Hatched Divider with centered job icon */}
        <HatchedSectionDivider icon={Laptop} />

        {/* The Ultimate Career Platform: 3 Core Capabilities */}
        <section id="features" aria-label="Core Platform Features">
          <Features />
        </section>

        {/* Clean Architectural Hatched Divider with centered graduation icon */}
        <HatchedSectionDivider icon={GraduationCap} />

        {/* Career Campus: Placement & Readiness Navigator */}
        <section id="campus" aria-label="Career Campus and Placement Readiness Platform">
          <CampusSection />
        </section>

        {/* Clean Architectural Hatched Divider with centered CPU icon */}
        <HatchedSectionDivider icon={Cpu} />

        {/* Next-Generation Multimodal LLM Intelligence Matrix */}
        <section id="multimodal" aria-label="Next-Gen Multimodal LLM Architecture">
          <MultimodalSection />
        </section>

        {/* Clean Architectural Hatched Divider with centered job icon */}
        <HatchedSectionDivider icon={FileText} />

        {/* Testimonials: "Trusted by the pioneers" with Infinite Logo Marquee (No divider right after marquee) */}
        <section id="testimonials" aria-label="User Success Stories">
          <Testimonial />
        </section>

        {/* Transparent Subscription Pricing Plans */}
        <section id="pricing" aria-label="Resume Builder Pricing Plans">
          <PricingSection />
        </section>

        {/* Clean Architectural Hatched Divider with centered job icon */}
        <HatchedSectionDivider icon={Globe} />

        {/* FAQ: "Common inquiries" */}
        <FaqSection />

        {/* Clean Architectural Hatched Divider with centered job icon */}
        <HatchedSectionDivider icon={Sparkles} />

        {/* SEO-only crawlable context */}
        <div className="sr-only" aria-hidden="true">
          <h2>CareerCrew &amp; SkillBridge AI — Autonomous Job Search, Career Campus &amp; Multimodal AI Platform</h2>
          <p>
            CareerCrew AI is the leading AI resume builder, job search automation, and Career Campus platform.
            Create ATS-optimized resumes tailored to specific job descriptions in minutes with our 4-level multi-agent pipeline.
            Evaluate campus placement readiness with our audited 0–100% index, simulate role-specific technical and behavioral mock interviews with step-by-step rubrics, and generate sequential learning roadmaps.
          </p>
          <h3>Next-Gen Multimodal LLMs</h3>
          <p>
            Deploy 14 frontier multimodal engines including Google Gemini 3.8 Flash &amp; 3.1 Pro, OpenAI GPT-6 Astra &amp; GPT-6.1 Terra, Anthropic Claude Fable 5.1 &amp; Opus 5.5, DeepSeek V4 Pro (1M context), and Qwen 3.x with native trilingual grounding across English, Hindi, and Assamese.
          </p>
          <h3>Autonomous Job Search with Multi-Agent Pipeline</h3>
          <p>
            Let AI agents do the job hunting for you. CareerCrew AI deploys six specialized agents
            across four synchronized execution levels: Job Search Agent, Scoring Agent, ATS Resume
            Agent, Cover Letter Agent, Outreach Email Agent, and Autonomous Dispatch Agent.
          </p>
          <h3>SkillBridge WhatsApp Campus Companion</h3>
          <p>
            Access interactive career counseling, resume reviews, placement readiness tests, and daily job notifications directly through WhatsApp.
          </p>
        </div>
      </main>

      {/* Dark Technical Footer with Giant CAREERCREW Typographic Wordmark */}
      <FooterNew />
    </div>
    </LandingLanguageProvider>
  );
}
