"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { PandaLogo } from "@/components/PandaLogo";
import { LandingLanguageToggle } from "@/components/LandingLanguageToggle";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLandingLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.pipeline, href: "/#pipeline" },
    { label: t.nav.telemetry, href: "/#telemetry" },
    { label: t.nav.platform, href: "/#features" },
    { label: t.nav.testimonials, href: "/#testimonials" },
    { label: t.nav.pricing, href: "/#pricing" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      {/* Full-width container with generous edge-to-edge breathing space */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex h-20 sm:h-24 items-center justify-between gap-12">
          {/* Brand Mark using landing page heading typography */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
            aria-label="CareerCrewAI Home"
          >
            <PandaLogo className="w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105" />
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground select-none leading-none group-hover:opacity-85 transition-opacity">
              CareerCrewAI
            </span>
          </Link>

          {/* Desktop Navigation with Expansive Negative Spacing */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-10 xl:gap-14 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-foreground transition-colors py-2 relative group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-4 xl:gap-6 shrink-0">
            <LandingLanguageToggle />
            <ModeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground hover:text-foreground/80 transition-colors"
                >
                  {t.nav.dashboard}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.nav.login}
                </Link>

                {/* Sharp Split Button */}
                <Link
                  href="/signup"
                  className="group inline-flex items-stretch border border-foreground bg-foreground text-background font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90"
                >
                  <div className="flex items-center justify-center px-3 py-2.5 border-r border-background/20 bg-foreground">
                    <ChevronRight className="h-3.5 w-3.5 text-background transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex items-center px-5 py-2.5">
                    {t.nav.getStarted}
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger & Theme Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <ModeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 border border-border text-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-8 py-8 space-y-5 font-mono text-xs uppercase tracking-wider">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="text-[10px] text-muted-foreground">Language / ভাষা</span>
            <LandingLanguageToggle />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 text-muted-foreground hover:text-foreground border-b border-border/40"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center bg-foreground text-background font-semibold"
              >
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center border border-border text-foreground"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center bg-foreground text-background font-semibold"
                >
                  {t.nav.getStarted}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
