"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles, X, Terminal } from "@/components/animate-ui/icons";
import { cn } from "@/lib/utils";
import { axiosAPI } from "@/lib/axiosInterface";

interface AutopilotRunOverlayProps {
  isOpen: boolean;
  scheduleId: string | null;
  scheduleName: string;
  initialLastRunAt: string | null;
  onComplete: () => void;
  onDismiss: () => void;
}

const STEPS = [
  { id: 0, label: "Building optimized search queries", duration: 3000 },
  { id: 1, label: "Scanning job boards (JSearch & Remotive)", duration: 8000 },
  { id: 2, label: "Evaluating jobs against your profile", duration: 12000 },
  { id: 3, label: "Tailoring resumes and cover letters", duration: 15000 },
  { id: 4, label: "Finalizing execution report", duration: 0 },
];

export function AutopilotRunOverlay({
  isOpen,
  scheduleId,
  scheduleName,
  initialLastRunAt,
  onComplete,
  onDismiss,
}: AutopilotRunOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen || isDone) return;
    
    const stepDuration = STEPS[currentStep]?.duration;
    if (stepDuration && stepDuration > 0) {
      stepTimerRef.current = setTimeout(() => {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      }, stepDuration);
    }
    
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [currentStep, isOpen, isDone]);

  useEffect(() => {
    if (!isOpen || !scheduleId || isDone) return;
    
    const pollBackend = async () => {
      try {
        const response = await axiosAPI.get(`/autopilot/schedules`);
        const schedules = response.data.schedules;
        const currentSchedule = schedules.find((s: any) => s.id === scheduleId);
        
        if (currentSchedule && currentSchedule.lastRunAt !== initialLastRunAt) {
          handleActualCompletion();
        }
      } catch (error) {
        console.error("Failed to poll schedule status:", error);
      }
    };

    pollingTimerRef.current = setInterval(pollBackend, 5000);
    
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isOpen, scheduleId, initialLastRunAt, isDone]);

  const handleActualCompletion = () => {
    setIsDone(true);
    setCurrentStep(STEPS.length);
    
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsDone(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      >
        <button
          onClick={onDismiss}
          className="absolute top-6 right-6 p-2 rounded-none border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Run in background"
        >
          <X size={18} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border shadow-2xl rounded-none p-6 sm:p-8 max-w-md w-full relative overflow-hidden"
        >
          {/* Top Progress Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-muted">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          <div className="flex flex-col items-center text-center mb-6 mt-1">
            <div className="w-12 h-12 bg-background border border-border rounded-none flex items-center justify-center mb-3 relative">
              <Terminal className="text-emerald-500 w-5 h-5" />
              {!isDone && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-1">
              {isDone ? "[PIPELINE_COMPLETE]" : "[AGENT_EXECUTING]"}
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {isDone ? "Autopilot Finished" : "Running Automation"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-[300px] font-mono">
              Schedule: <span className="font-semibold text-foreground">{scheduleName}</span>
            </p>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            {STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const isPast = currentStep > index;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-none border text-xs transition-colors",
                    isActive
                      ? "bg-emerald-500/5 border-emerald-500/40 text-foreground"
                      : isPast
                      ? "bg-card border-border/50 text-foreground"
                      : "border-transparent text-muted-foreground opacity-60"
                  )}
                >
                  <div className="w-5 flex justify-center flex-shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <span
                      className={cn(
                        "font-mono text-xs tracking-tight",
                        isPast ? "text-foreground" :
                        isActive ? "text-emerald-500 font-semibold" :
                        "text-muted-foreground"
                      )}
                    >
                      {step.label}
                      {isActive && <span className="animate-pulse">_</span>}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
