"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { axiosAPI } from "@/lib/axiosInterface";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { OAuthButtons } from "@/components/OAuthButtons";
import { CadCrosshair } from "@/components/CadAccents";
import GrainOverlay from "@/components/GrainOverlay";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosAPI.post("/auth/login", formData);

      if (response.data) {
        login(response.data);
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.msg || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex flex-col justify-between items-center px-4 py-8 sm:py-12 overflow-hidden selection:bg-foreground selection:text-background">
      {/* High-frequency analog film-grain texture overlay */}
      <GrainOverlay />


      {/* Symmetrical Subtle Guide Rails */}
      <div className="absolute inset-y-0 left-6 sm:left-12 lg:left-24 w-[1px] border-r border-border/40 pointer-events-none" />
      <div className="absolute inset-y-0 right-6 sm:right-12 lg:right-24 w-[1px] border-l border-border/40 pointer-events-none" />

      {/* Top Brand Mark Link Back to Landing */}
      <div className="relative z-10 w-full max-w-[440px] flex justify-between items-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center group focus:outline-none shrink-0"
          aria-label="Carrier Crew AI Home"
        >
          <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground select-none leading-none group-hover:opacity-85 transition-opacity">
            CareerCrewAI
          </span>
        </Link>

        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          /// 01
        </span>
      </div>

      {/* Center CAD Authentication Terminal Box */}
      <div className="relative z-10 w-full max-w-[440px] border border-border/80 bg-background/90 p-8 sm:p-10 shadow-xs select-none">
        {/* 4 Corner Crosshairs */}
        <CadCrosshair className="-top-2 -left-2 absolute" size="text-[10px]" />
        <CadCrosshair className="-top-2 -right-2 absolute" size="text-[10px]" />
        <CadCrosshair className="-bottom-2 -left-2 absolute" size="text-[10px]" />
        <CadCrosshair className="-bottom-2 -right-2 absolute" size="text-[10px]" />

        {/* Top Millimeter Ruler Strip */}
        <div
          className="absolute top-0 left-0 right-0 h-2 border-b border-border/60 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(to right, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 20px)",
          }}
        />

        {/* Header Metadata */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black tracking-tighter text-foreground/70">///</span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              AUTHENTICATION
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            OPERATOR_ID
          </span>
        </div>

        {/* Minimal Clear Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase mb-1.5">
          Sign In
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-mono">
          Enter credentials to access your autonomous pipeline.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-mono text-[10px] uppercase font-bold tracking-widest text-muted-foreground"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="operator@system.io"
              required
              className="w-full h-10 px-3 text-xs bg-muted/10 border border-border text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block font-mono text-[10px] uppercase font-bold tracking-widest text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                required
                className="w-full h-10 pl-3 pr-10 text-xs bg-muted/10 border border-border text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Primary Split Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group w-full inline-flex items-stretch border border-foreground bg-foreground text-background font-mono text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer pt-0"
          >
            <div className="flex items-center justify-center px-3.5 py-3 border-r border-background/20 bg-foreground">
              {isLoading ? (
                <div className="animate-spin h-3.5 w-3.5 border-2 border-background border-t-transparent" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 text-background transition-transform group-hover:translate-x-0.5" />
              )}
            </div>
            <div className="flex-1 flex items-center justify-center py-3">
              {isLoading ? "Authenticating..." : "Sign In to Console"}
            </div>
          </button>
        </form>

        <OAuthButtons />

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-border/60 text-center font-mono text-xs text-muted-foreground">
          <span>No operator credentials? </span>
          <Link
            href="/signup"
            className="font-bold text-foreground hover:underline transition-colors uppercase tracking-wider ml-1"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Subtle Bottom Metadata */}
      <div className="relative z-10 mt-6 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 w-full max-w-[440px] px-1 select-none">
        <span>SECURITY // ENCRYPTED</span>
        <span>PROTOCOL // TLS_1.3</span>
      </div>
    </div>
  );
}
