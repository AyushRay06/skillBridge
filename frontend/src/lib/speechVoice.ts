// Utility for 100% Free Browser-Native Voice Agent using Web Speech API

export function getSpeechRecognition(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

/**
 * Clean text for natural speech:
 * - Strips code blocks, URLs, markdown, emojis, asterisks
 * - Keeps spoken output crisp (first 2-3 sentences, max ~350 chars) for responsive voice conversation
 */
export function cleanTextForSpeech(text: string, isVoiceCall = false): string {
  if (!text) return "";

  let cleaned = text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove Markdown headings
    .replace(/#{1,6}\s+/g, "")
    // Remove bullet characters, asterisks, tildes, underscores
    .replace(/[*_~•·|]/g, "")
    // Remove Markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove standalone URLs
    .replace(/https?:\/\/\S+/g, "")
    // Collapse multi-newlines into periods
    .replace(/\n+/g, ". ")
    // Clean up multiple spaces or periods
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim();

  // If in Voice Call mode and text is long, take the first 2-3 sentences (up to ~350 chars)
  if (isVoiceCall && cleaned.length > 350) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      let combined = "";
      for (const s of sentences) {
        if ((combined + s).length <= 350) {
          combined += s + " ";
        } else {
          break;
        }
      }
      if (combined.trim()) {
        cleaned = combined.trim();
      } else {
        cleaned = cleaned.slice(0, 320) + "...";
      }
    } else {
      cleaned = cleaned.slice(0, 320) + "...";
    }
  }

  return cleaned;
}

export function speakText(
  text: string,
  language = "en",
  onEnd?: () => void,
  onError?: () => void,
  isVoiceCall = false
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  // Cancel any ongoing speech first
  try {
    window.speechSynthesis.cancel();
  } catch {}

  const clean = cleanTextForSpeech(text, isVoiceCall);
  if (!clean) {
    if (onEnd) onEnd();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(clean);

  // Configure language code
  if (language === "hi") {
    utterance.lang = "hi-IN";
  } else if (language === "as") {
    utterance.lang = "as-IN";
  } else {
    utterance.lang = "en-US";
  }

  // Select the highest quality voice available on the device
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    if (language === "hi") {
      const hiVoice = voices.find(
        (v) => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi")
      );
      if (hiVoice) utterance.voice = hiVoice;
    } else {
      const enVoice =
        voices.find(
          (v) =>
            (v.lang.startsWith("en-US") || v.lang.startsWith("en-IN") || v.lang.startsWith("en-GB")) &&
            (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Neural"))
        ) || voices.find((v) => v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
    }
  }

  utterance.rate = 1.05; // Slightly brisk for natural dialogue
  utterance.pitch = 1.0;

  let ended = false;
  const finish = () => {
    if (!ended) {
      ended = true;
      if (onEnd) onEnd();
    }
  };

  utterance.onend = finish;
  utterance.onerror = (e) => {
    // If user cancelled or interrupted, complete gracefully
    finish();
  };

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("[speakText] Synthesis error:", err);
    finish();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
