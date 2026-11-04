"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "@/components/animate-ui/icons";
import { axiosAPI } from "@/lib/axiosInterface";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { OAuthButtons } from "@/components/OAuthButtons";
import { CadCrosshair } from "@/components/CadAccents";
import GrainOverlay from "@/components/GrainOverlay";
import { ModeToggle } from "@/components/theme-toggle";
import { PandaLogo } from "@/components/PandaLogo";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const { login } = useAuth();

  const passwordRequirements = [
    { text: "6+ characters", met: password.length >= 6 },
    { text: "Uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Lowercase letter", met: /[a-z]/.test(password) },
    { text: "Numeric digit", met: /\d/.test(password) },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosAPI.post("/auth/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data) {
        login(response.data);
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.msg || "Signup failed. Please try again."
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
          className="inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
          aria-label="CareerCrew AI Home"
        >
          <PandaLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
          <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground select-none leading-none group-hover:opacity-85 transition-opacity">
            CareerCrewAI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            /// 02
          </span>
        </div>
      </div>

      {/* Center CAD Registration Terminal Box */}
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
              REGISTRATION
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            NEW_OPERATOR
          </span>
        </div>

        {/* Minimal Clear Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase mb-1.5">
          Create Account
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-mono">
          Deploy your autonomous application pipeline.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block font-mono text-[10px] uppercase font-bold tracking-widest text-muted-foreground"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Alex Chen"
              required
              className="w-full h-10 px-3 text-xs bg-muted/10 border border-border text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

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

            {/* Subtle Minimalist Password Checklist */}
            {password && (
              <div className="mt-2.5 p-3 bg-muted/10 border border-border/80 font-mono text-[10px]">
                <div className="grid grid-cols-2 gap-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 shrink-0 ${req.met ? "bg-foreground" : "bg-border"}`} />
                      <span className={req.met ? "text-foreground font-semibold" : "text-muted-foreground/60"}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </div>
          </button>
        </form>

        <OAuthButtons />

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-border/60 text-center font-mono text-xs text-muted-foreground">
          <span>Already registered an account? </span>
          <Link
            href="/login"
            className="font-bold text-foreground hover:underline transition-colors uppercase tracking-wider ml-1"
          >
            Sign In
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
