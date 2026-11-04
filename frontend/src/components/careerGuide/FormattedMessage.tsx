"use client";

import React from "react";

interface FormattedMessageProps {
  content: string;
}

/**
 * Parses inline formatting like **bold**, *italic*, `code`, and [links](url),
 * removing raw markdown symbols like *, **, _, ##.
 */
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      // Bold
      const inner = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {inner}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      // Italic
      const inner = token.slice(1, -1);
      parts.push(
        <em key={match.index} className="italic text-muted-foreground">
          {inner}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      // Inline Code
      const inner = token.slice(1, -1);
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[11px] px-1 py-0.5 bg-muted border border-border/80 text-foreground"
        >
          {inner}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      // Link
      const labelEnd = token.indexOf("](");
      const label = token.slice(1, labelEnd);
      const url = token.slice(labelEnd + 2, -1);
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-2 hover:opacity-80"
        >
          {label}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Cleans up and renders markdown:
 * - Fenced code blocks with language labels and monospace styling
 * - Headings (#, ##, ###)
 * - Bullet lists (*, -, •)
 * - Numbered lists (1., 2.)
 * - Horizontal rules (---)
 */
export function FormattedMessage({ content }: FormattedMessageProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let blockKey = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check code block fence
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // Closing code block
        elements.push(
          <div
            key={`code-${blockKey++}`}
            className="my-2.5 border border-border bg-muted/30 font-mono text-xs overflow-hidden rounded-none"
          >
            {codeLang && (
              <div className="px-3 py-1 bg-muted/60 border-b border-border/70 text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                {codeLang}
              </div>
            )}
            <pre className="p-3 overflow-x-auto leading-relaxed text-foreground font-mono text-xs whitespace-pre">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = "";
      } else {
        // Opening code block
        inCodeBlock = true;
        codeLang = trimmed.replace(/^```/, "").trim();
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Empty line
    if (!trimmed) {
      elements.push(<div key={`empty-${i}`} className="h-1.5" />);
      continue;
    }

    // Horizontal divider
    if (/^[-*_]{3,}$/.test(trimmed)) {
      elements.push(<div key={`hr-${i}`} className="my-2.5 border-t border-border/70" />);
      continue;
    }

    // Headings
    if (/^#{1,6}\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{1,6}\s+/, "");
      elements.push(
        <div
          key={`h-${i}`}
          className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mt-3 mb-1 pt-1"
        >
          {parseInline(headingText)}
        </div>
      );
      continue;
    }

    // Bullet items
    if (/^[*•-]\s+/.test(trimmed)) {
      const bulletText = trimmed.replace(/^[*•-]\s+/, "");
      elements.push(
        <div key={`b-${i}`} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="text-foreground text-[8px] leading-relaxed select-none mt-1 shrink-0">
            ●
          </span>
          <span className="flex-1 min-w-0">{parseInline(bulletText)}</span>
        </div>
      );
      continue;
    }

    // Numbered list items
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemText = numberedMatch[2];
      elements.push(
        <div key={`n-${i}`} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="font-mono text-[10px] text-muted-foreground select-none mt-0.5 shrink-0">
            {num}.
          </span>
          <span className="flex-1 min-w-0">{parseInline(itemText)}</span>
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="my-0.5 leading-relaxed">
        {parseInline(trimmed)}
      </p>
    );
  }

  // Handle unclosed code block if stream cut off
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <div
        key={`code-unclosed-${blockKey}`}
        className="my-2.5 border border-border bg-muted/30 font-mono text-xs overflow-hidden rounded-none"
      >
        {codeLang && (
          <div className="px-3 py-1 bg-muted/60 border-b border-border/70 text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
            {codeLang}
          </div>
        )}
        <pre className="p-3 overflow-x-auto leading-relaxed text-foreground font-mono text-xs whitespace-pre">
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-1 text-sm leading-relaxed font-sans text-foreground">
      {elements}
    </div>
  );
}
