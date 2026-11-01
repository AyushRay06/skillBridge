import Features from "@/components/Features";
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
import type { Metadata } from "next";
import { Rajdhani, Chakra_Petch } from "next/font/google";

import { Briefcase, Laptop, Globe, FileText, Sparkles } from "lucide-react";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
});

export const metadata: Metadata = {
  title: "CareerCrew AI — Autonomous Multi-Agent AI Resume Builder & Job Search Platform",
  description:
    "Build ATS-optimized resumes in seconds with our 4-level, multi-agent AI pipeline. Auto-generate tailored resumes, cover letters, and outreach emails. Let Autopilot search, score, and apply to jobs for you.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className={`landing-page ${rajdhani.variable} ${chakraPetch.variable} relative min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background`}>
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
          <h2>AI Resume Builder &amp; Autonomous Multi-Agent Job Application Suite</h2>
          <p>
            CareerCrew AI is the leading AI resume builder and job search automation platform.
            Create ATS-optimized resumes tailored to specific job descriptions in minutes.
            Our 4-level multi-agent pipeline analyzes job postings, scores match fit, and generates
            professional, ATS-friendly LaTeX resumes, personalized cover letters, and cold outreach.
          </p>
          <h3>Autonomous Job Search with Multi-Agent Pipeline</h3>
          <p>
            Let AI agents do the job hunting for you. CareerCrew AI deploys six specialized agents
            across four synchronized execution levels: Job Search Agent, Scoring Agent, ATS Resume
            Agent, Cover Letter Agent, Outreach Email Agent, and Autonomous Dispatch Agent.
          </p>
        </div>
      </main>

      {/* Dark Technical Footer with Giant CAREERCREW Typographic Wordmark */}
      <FooterNew />
    </div>
  );
}
