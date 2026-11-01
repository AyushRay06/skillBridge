"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  textClassName?: string;
  href?: string;
  short?: boolean;
}

export default function BrandLogo({
  className = "",
  textClassName = "",
  href = "/",
  short = false,
}: BrandLogoProps) {
  const content = (
    <span
      className={cn(
        "font-heading font-bold tracking-tight text-foreground select-none leading-none inline-block transition-opacity hover:opacity-85",
        textClassName
      )}
    >
      {short ? "CC" : "CareerCrewAI"}
    </span>
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
