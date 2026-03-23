"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportMenuProps {
  markdown: string;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "- ");
}

export default function ExportMenu({ markdown }: ExportMenuProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  }, []);

  const copyMarkdown = useCallback(async () => {
    await navigator.clipboard.writeText(markdown);
    showFeedback("Copied as Markdown!");
  }, [markdown, showFeedback]);

  const copyPlainText = useCallback(async () => {
    await navigator.clipboard.writeText(stripMarkdown(markdown));
    showFeedback("Copied as Plain Text!");
  }, [markdown, showFeedback]);

  const downloadPdf = useCallback(() => {
    window.print();
  }, []);

  if (feedback) {
    return (
      <span
        className="text-sm font-medium text-success animate-in fade-in"
        role="status"
        aria-live="polite"
      >
        {feedback}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" aria-label="Export options" />}
      >
        Export
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyMarkdown}>
          Copy as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyPlainText}>
          Copy as Plain Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPdf}>
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
