"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 border border-border rounded-none" />;
  }

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={(newTheme) => setTheme(newTheme)}
      className="w-8 h-8 flex items-center justify-center rounded-none border border-border bg-background hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary [&>svg]:w-3.5 [&>svg]:h-3.5 transition-colors cursor-pointer"
      variant="circle"
    />
  );
}
