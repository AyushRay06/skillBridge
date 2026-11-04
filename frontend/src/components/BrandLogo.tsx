"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PandaLogo } from "@/components/PandaLogo";

interface BrandLogoProps {
  className?: string;
  textClassName?: string;
  logoClassName?: string;
  href?: string;
  short?: boolean;
  showText?: boolean;
}

export default function BrandLogo({
  className = "",
  textClassName = "",
  logoClassName = "",
  href = "/",
  short = false,
  showText = true,
}: BrandLogoProps) {
  const content = (
    <div className="inline-flex items-center gap-2 select-none group">
      <PandaLogo className={cn("w-6 h-6 shrink-0 transition-transform group-hover:scale-105", logoClassName)} />
      {showText && (
        <span
          className={cn(
            "font-heading font-bold tracking-tight text-foreground leading-none inline-block transition-opacity group-hover:opacity-85",
            textClassName
          )}
        >
          {short ? "CC" : "CareerCrewAI"}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn("inline-flex items-center focus:outline-none", className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn("inline-flex items-center", className)}>{content}</div>;
}
