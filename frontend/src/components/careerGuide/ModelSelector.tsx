"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronDown,
  Check,
  Plus,
  Bot,
  Terminal,
  Globe,
  X,
  AnimateIcon,
} from "@/components/animate-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export interface AIModel {
  id: string;
  name: string;
  provider: "Google" | "Anthropic" | "OpenAI" | "DeepSeek" | "Trending" | "Custom";
  tag: string;
  badgeColor: string;
  isCustom?: boolean;
}

const DEFAULT_MODELS: AIModel[] = [
  // Google
  {
    id: "gemini-3-8-flash",
    name: "Gemini 3.8 Flash",
    provider: "Google",
    tag: "Default • High Speed",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: "gemini-3-1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    tag: "Reasoning & Coding",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: "gemini-3-7-flash",
    name: "Gemini 3.7 Flash",
    provider: "Google",
    tag: "Ultra Low Latency",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },

  // Anthropic
  {
    id: "claude-fable-5-1",
    name: "Claude Fable 5.1",
    provider: "Anthropic",
    tag: "Frontier Intelligence",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "opus-5-5",
    name: "Opus 5.5",
    provider: "Anthropic",
    tag: "Deep Academic Reasoning",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "sonnet-5-5",
    name: "Sonnet 5.5",
    provider: "Anthropic",
    tag: "Balanced Enterprise Coding",
    badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },

  // OpenAI
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    provider: "OpenAI",
    tag: "Next-Gen Omni Reasoning",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "gpt-6-1-sol",
    name: "GPT-6.1 Sol",
    provider: "OpenAI",
    tag: "Math & Scientific Logic",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "gpt-6-1-terra",
    name: "GPT-6.1 Terra",
    provider: "OpenAI",
    tag: "Multimodal Grounding",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },

  // DeepSeek
  {
    id: "deepseek-v4-pro",
    name: "V4 Pro",
    provider: "DeepSeek",
    tag: "Deep Reasoning 1M Context",
    badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  {
    id: "deepseek-v4-flash",
    name: "V4 Flash",
    provider: "DeepSeek",
    tag: "High Throughput MoE",
    badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  {
    id: "deepseek-v4-lite",
    name: "V4 Lite",
    provider: "DeepSeek",
    tag: "Fast Edge Execution",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },

  // Trending
  {
    id: "kimi-k3",
    name: "Kimi K3 (Moonshot AI)",
    provider: "Trending",
    tag: "2M Context Long-Form",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  {
    id: "qwen-3-x",
    name: "Qwen 3.x (Alibaba)",
    provider: "Trending",
    tag: "Multilingual Multimodal",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    id: "muse-spark-open",
    name: "Muse Spark Open (Meta)",
    provider: "Trending",
    tag: "Open Weights Frontier",
    badgeColor: "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20",
  },
  {
    id: "grok-4-5",
    name: "Grok 4.5 (xAI)",
    provider: "Trending",
    tag: "Real-Time Uncensored CoT",
    badgeColor: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
  {
    id: "glm-5-3",
    name: "GLM 5.3 (Zhipu)",
    provider: "Trending",
    tag: "Autonomous Agentic AI",
    badgeColor: "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-600/20",
  },
];

export function ModelSelector() {
  const [selectedModelId, setSelectedModelId] = useState<string>("gemini-3-8-flash");
  const [customModels, setCustomModels] = useState<AIModel[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Custom model form state
  const [providerType, setProviderType] = useState("OpenRouter");
  const [modelName, setModelName] = useState("");
  const [modelLabel, setModelLabel] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("https://openrouter.ai/api/v1");
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedModel = localStorage.getItem("skillbridge_selected_model");
    if (storedModel && DEFAULT_MODELS.some((m) => m.id === storedModel)) {
      setSelectedModelId(storedModel);
    } else {
      setSelectedModelId("gemini-3-8-flash");
    }

    try {
      const storedCustom = localStorage.getItem("skillbridge_custom_models");
      if (storedCustom) {
        setCustomModels(JSON.parse(storedCustom));
      }
    } catch {}
  }, []);

  const allModels = [...DEFAULT_MODELS, ...customModels];
  const activeModel = allModels.find((m) => m.id === selectedModelId) ?? DEFAULT_MODELS[0];

  const handleSelectModel = (model: AIModel) => {
    setSelectedModelId(model.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("skillbridge_selected_model", model.id);
    }
    toast.success(`Switched to ${model.name}`);
  };

  const handleSaveCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) {
      toast.error("Please enter a model name or ID");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newCustom: AIModel = {
        id: `custom-${Date.now()}`,
        name: modelLabel.trim() || modelName.trim(),
        provider: "Custom",
        tag: providerType,
        badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        isCustom: true,
      };

      const updated = [...customModels, newCustom];
      setCustomModels(updated);
      setSelectedModelId(newCustom.id);

      if (typeof window !== "undefined") {
        localStorage.setItem("skillbridge_custom_models", JSON.stringify(updated));
        localStorage.setItem("skillbridge_selected_model", newCustom.id);
      }

      setIsSaving(false);
      setIsAddModalOpen(false);
      setModelName("");
      setModelLabel("");
      setApiKey("");
      toast.success(`Connected custom model: ${newCustom.name}`);
    }, 400);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 gap-1.5 text-xs font-medium border border-border/50 hover:border-border hover:bg-muted/80 rounded-none transition-colors cursor-pointer select-none"
            title="Switch AI inference model"
          >
            <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
              {activeModel.name}
            </span>
            <ChevronDown size={12} className="w-3 h-3 text-muted-foreground shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="bottom"
          className="w-72 max-h-[420px] overflow-y-auto rounded-none border border-border bg-popover/95 backdrop-blur-md p-1.5 shadow-xl select-none"
        >
          <div className="px-2 py-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Select AI Engine
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-xs border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold">
              Multi-LLM
            </span>
          </div>

          <DropdownMenuSeparator className="my-1" />

          {/* Google Models */}
          <DropdownMenuLabel className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
            Google
          </DropdownMenuLabel>
          {DEFAULT_MODELS.filter((m) => m.provider === "Google").map((m) => (
            <ModelOptionItem
              key={m.id}
              model={m}
              isSelected={selectedModelId === m.id}
              onSelect={() => handleSelectModel(m)}
            />
          ))}

          <DropdownMenuSeparator className="my-1" />

          {/* Anthropic Models */}
          <DropdownMenuLabel className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
            Anthropic
          </DropdownMenuLabel>
          {DEFAULT_MODELS.filter((m) => m.provider === "Anthropic").map((m) => (
            <ModelOptionItem
              key={m.id}
              model={m}
              isSelected={selectedModelId === m.id}
              onSelect={() => handleSelectModel(m)}
            />
          ))}

          <DropdownMenuSeparator className="my-1" />

          {/* OpenAI Models */}
          <DropdownMenuLabel className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
            OpenAI
          </DropdownMenuLabel>
          {DEFAULT_MODELS.filter((m) => m.provider === "OpenAI").map((m) => (
            <ModelOptionItem
              key={m.id}
              model={m}
              isSelected={selectedModelId === m.id}
              onSelect={() => handleSelectModel(m)}
            />
          ))}

          <DropdownMenuSeparator className="my-1" />

          {/* DeepSeek Models */}
          <DropdownMenuLabel className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
            DeepSeek
          </DropdownMenuLabel>
          {DEFAULT_MODELS.filter((m) => m.provider === "DeepSeek").map((m) => (
            <ModelOptionItem
              key={m.id}
              model={m}
              isSelected={selectedModelId === m.id}
              onSelect={() => handleSelectModel(m)}
            />
          ))}

          <DropdownMenuSeparator className="my-1" />

          {/* Trending Models */}
          <DropdownMenuLabel className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
            Trending Frontier
          </DropdownMenuLabel>
          {DEFAULT_MODELS.filter((m) => m.provider === "Trending").map((m) => (
            <ModelOptionItem
              key={m.id}
              model={m}
              isSelected={selectedModelId === m.id}
              onSelect={() => handleSelectModel(m)}
            />
          ))}

          {/* Custom Models */}
          {customModels.length > 0 && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuLabel className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Custom Models
              </DropdownMenuLabel>
              {customModels.map((m) => (
                <ModelOptionItem
                  key={m.id}
                  model={m}
                  isSelected={selectedModelId === m.id}
                  onSelect={() => handleSelectModel(m)}
                />
              ))}
            </>
          )}

          <DropdownMenuSeparator className="my-1" />

          {/* Add Custom Model trigger */}
          <DropdownMenuItem
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-2 py-2 text-xs font-medium cursor-pointer rounded-none text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 transition-colors"
          >
            <Plus size={14} className="w-3.5 h-3.5" />
            <span>Connect Custom Model / API Key...</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Custom Model Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-md border border-border bg-card p-6 shadow-2xl rounded-none"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border border-border bg-muted flex items-center justify-center">
                    <Bot size={14} className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Connect Custom Model</h3>
                    <p className="text-[11px] text-muted-foreground font-mono">Bring your own key or local engine</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-colors rounded-none cursor-pointer"
                >
                  <X size={14} className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomModel} className="mt-4 space-y-3.5">
                {/* Provider preset */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Provider Type
                  </label>
                  <select
                    value={providerType}
                    onChange={(e) => {
                      setProviderType(e.target.value);
                      if (e.target.value === "OpenRouter") setApiEndpoint("https://openrouter.ai/api/v1");
                      else if (e.target.value === "Ollama (Local)") setApiEndpoint("http://localhost:11434/v1");
                      else if (e.target.value === "Hugging Face") setApiEndpoint("https://api-inference.huggingface.co/v1");
                      else if (e.target.value === "vLLM") setApiEndpoint("http://localhost:8000/v1");
                    }}
                    className="w-full bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-foreground/40 rounded-none font-mono"
                  >
                    <option value="OpenRouter">OpenRouter (Any open weights)</option>
                    <option value="Ollama (Local)">Ollama Local (http://localhost:11434)</option>
                    <option value="OpenAI Compatible">OpenAI-Compatible Gateway</option>
                    <option value="Hugging Face">Hugging Face TGI</option>
                    <option value="vLLM">vLLM Inference Server</option>
                  </select>
                </div>

                {/* Model ID */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Model ID / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. meta-llama/llama-3.3-70b-instruct or mistral-large"
                    className="w-full bg-background border border-border px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/40 rounded-none font-mono"
                  />
                </div>

                {/* Friendly Label */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Display Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={modelLabel}
                    onChange={(e) => setModelLabel(e.target.value)}
                    placeholder="e.g. My Llama 3.3 70B"
                    className="w-full bg-background border border-border px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/40 rounded-none font-mono"
                  />
                </div>

                {/* Base URL */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    API Base URL
                  </label>
                  <input
                    type="url"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/40 rounded-none font-mono"
                  />
                </div>

                {/* API Key */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    API Key (Optional for Local Ollama)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-background border border-border px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/40 rounded-none font-mono"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-8 text-xs font-mono uppercase tracking-wider rounded-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    variant="default"
                    size="sm"
                    className="h-8 text-xs font-mono uppercase tracking-wider rounded-none gap-1.5"
                  >
                    <Check size={12} className="w-3 h-3" />
                    <span>{isSaving ? "Connecting..." : "Save & Connect"}</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function ModelOptionItem({
  model,
  isSelected,
  onSelect,
}: {
  model: AIModel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={`flex items-center justify-between px-2.5 py-1.5 text-xs cursor-pointer rounded-none group transition-colors ${
        isSelected ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <div className="flex flex-col min-w-0 pr-2">
        <span className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
          {model.name}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/70 truncate">
          {model.tag}
        </span>
      </div>
      {isSelected && (
        <Check size={14} className="w-3.5 h-3.5 text-primary shrink-0" />
      )}
    </DropdownMenuItem>
  );
}
