"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateSpec } from "@/lib/generateSpec";
import { saveToHistory } from "@/lib/specHistory";
import ExportMenu from "@/components/ExportMenu";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import SpecSkeleton from "@/components/SpecSkeleton";

const MIN_INPUT_LENGTH = 20;

const SPEC_SECTIONS = [
  { id: "core-capabilities", title: "CORE CAPABILITIES", pattern: /## CORE CAPABILITIES\n([\s\S]*?)(?=\n## |$)/ },
  { id: "quality-boundaries", title: "QUALITY BOUNDARIES", pattern: /## QUALITY BOUNDARIES\n([\s\S]*?)(?=\n## |$)/ },
  { id: "error-handling", title: "ERROR HANDLING BEHAVIOR", pattern: /## ERROR HANDLING BEHAVIOR\n([\s\S]*?)(?=\n## |$)/ },
  { id: "learning-boundaries", title: "LEARNING BOUNDARIES", pattern: /## LEARNING BOUNDARIES\n([\s\S]*?)(?=\n## |$)/ },
  { id: "edge-cases", title: "EDGE CASE HANDLING", pattern: /## EDGE CASE HANDLING\n([\s\S]*?)(?=\n## |$)/ },
  { id: "success-metrics", title: "SUCCESS METRICS", pattern: /## SUCCESS METRICS\n([\s\S]*?)(?=\n## |$)/ },
];

function parseSpecSections(spec: string) {
  return SPEC_SECTIONS.map((section) => {
    const match = spec.match(section.pattern);
    return {
      ...section,
      content: match ? match[1].trim() : null,
    };
  });
}

const QUICK_START_TEMPLATES = [
  {
    label: "Hotel concierge",
    icon: "🏨",
    prompt:
      "A hotel concierge agent that handles guest requests, room service orders, spa bookings, and local recommendations with multilingual support.",
  },
  {
    label: "SaaS support",
    icon: "🔔",
    prompt:
      "A SaaS customer support agent that handles billing inquiries, feature requests, troubleshooting, and account management.",
  },
  {
    label: "Medical scheduler",
    icon: "🏥",
    prompt:
      "A medical appointment scheduling agent that books, reschedules, and cancels appointments, handles insurance verification, and sends reminders via SMS.",
  },
  {
    label: "E-commerce returns",
    icon: "📦",
    prompt:
      "An e-commerce returns agent that processes return requests, generates shipping labels, tracks refunds, and handles customer complaints.",
  },
];

export default function SpecGenerator() {
  const [requirementsInput, setRequirementsInput] = useState("");
  const [generatedSpec, setGeneratedSpec] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = requirementsInput.trim().length >= MIN_INPUT_LENGTH;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedSpec("");

    try {
      const spec = await generateSpec(requirementsInput);
      setGeneratedSpec(spec);
      saveToHistory(requirementsInput, spec);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }, [canGenerate, isGenerating, requirementsInput]);

  const handleQuickStart = useCallback((prompt: string) => {
    setRequirementsInput(prompt);
  }, []);

  const handleClear = useCallback(() => {
    setRequirementsInput("");
  }, []);

  const getStatus = () => {
    if (isGenerating) return { label: "GENERATING", color: "bg-amber-500" };
    if (error) return { label: "ERROR", color: "bg-destructive" };
    if (generatedSpec) return { label: "COMPLETE", color: "bg-emerald-500" };
    return { label: "READY", color: "bg-muted-foreground" };
  };

  const status = getStatus();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Left Panel - Input */}
      <div className="flex flex-col gap-6 border-b border-border p-6 lg:w-[420px] lg:border-b-0 lg:border-r">
        {/* Section Header */}
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Business Requirements
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what your agent needs to do
          </p>
        </div>

        {/* Quick Start Templates */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quick Start
          </h3>
          <div className="flex flex-wrap gap-2">
            {QUICK_START_TEMPLATES.map((template) => (
              <button
                key={template.label}
                onClick={() => handleQuickStart(template.prompt)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <span>{template.icon}</span>
                <span>{template.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="flex flex-1 flex-col gap-2">
          <Textarea
            placeholder="Describe your AI agent requirements..."
            className="min-h-[320px] flex-1 resize-none rounded-lg border-border bg-input text-foreground placeholder:text-muted-foreground"
            value={requirementsInput}
            onChange={(e) => setRequirementsInput(e.target.value)}
            aria-describedby="char-count"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span id="char-count">{requirementsInput.length} characters</span>
            {requirementsInput.length > 0 && (
              <button
                onClick={handleClear}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                clear
              </button>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          size="lg"
          disabled={!canGenerate || isGenerating}
          onClick={handleGenerate}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label={
            isGenerating
              ? "Generating specification"
              : "Generate specification"
          }
        >
          {isGenerating ? (
            <>
              <LoadingSpinner />
              Generating...
            </>
          ) : (
            <>
              <span className="text-lg">⚡</span>
              Generate Specification
            </>
          )}
        </Button>
      </div>

      {/* Right Panel - Output */}
      <div className="flex flex-1 flex-col p-6">
        {/* Status Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${status.color}`}
              aria-hidden="true"
            />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {status.label}
            </span>
          </div>
          {generatedSpec && <ExportMenu markdown={generatedSpec} />}
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {error ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
              <p className="text-center text-sm text-destructive" role="alert">
                {error}
              </p>
              <Button variant="outline" size="sm" onClick={handleGenerate}>
                Retry
              </Button>
            </div>
          ) : isGenerating ? (
            <SpecSkeleton />
          ) : generatedSpec ? (
            <SpecCards spec={generatedSpec} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function SpecCards({ spec }: { spec: string }) {
  const sections = parseSpecSections(spec);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto">
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex flex-col rounded-lg border border-border bg-muted/50 p-4"
          >
            <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              {section.title}
            </h3>
            <div className="flex-1 text-sm text-foreground/90">
              {section.content ? (
                <MarkdownRenderer content={section.content} />
              ) : (
                <p className="italic text-muted-foreground">
                  No content available
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Placeholder Cards */}
      <div className="grid flex-1 gap-4 md:grid-cols-2">
        {SPEC_SECTIONS.map((section) => (
          <div
            key={section.id}
            className="flex flex-col rounded-lg border border-border bg-muted/30 p-4"
          >
            <span className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {section.title}
            </span>
            <div className="flex-1 space-y-2">
              <div className="h-2 w-4/5 rounded bg-border/50" />
              <div className="h-2 w-3/5 rounded bg-border/50" />
              <div className="h-2 w-2/3 rounded bg-border/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Describe your agent on the left and click Generate to build a
          structured behavior spec.
        </p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="size-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
