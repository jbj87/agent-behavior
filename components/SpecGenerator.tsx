"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateSpec } from "@/lib/generateSpec";
import { EXAMPLE_REQUIREMENTS } from "@/lib/exampleTemplate";
import { saveToHistory } from "@/lib/specHistory";
import ExportMenu from "@/components/ExportMenu";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import RecentSpecs from "@/components/RecentSpecs";
import SpecSkeleton from "@/components/SpecSkeleton";

const MIN_INPUT_LENGTH = 20;

export default function SpecGenerator() {
  const [requirementsInput, setRequirementsInput] = useState("");
  const [generatedSpec, setGeneratedSpec] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

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
      setHistoryRefresh((n) => n + 1);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }, [canGenerate, isGenerating, requirementsInput]);

  const handleLoadExample = useCallback(() => {
    setRequirementsInput(EXAMPLE_REQUIREMENTS);
  }, []);

  const handleLoadSpec = useCallback((spec: string) => {
    setGeneratedSpec(spec);
    setError(null);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
      {/* Left Side - Input (40%) */}
      <div className="flex flex-col gap-4 lg:w-2/5">
        <Card className="flex flex-1 flex-col">
          <CardHeader>
            <CardTitle>Business Requirements</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="requirements">Describe your agent</Label>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleLoadExample}
                  aria-label="Load example requirements"
                >
                  Try an Example
                </Button>
              </div>
              <Textarea
                id="requirements"
                placeholder="Describe your AI agent requirements..."
                className="min-h-[400px] flex-1 resize-none"
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                aria-describedby="char-count"
              />
              <p id="char-count" className="text-xs text-muted-foreground">
                {requirementsInput.length} characters
                {requirementsInput.length > 0 &&
                  requirementsInput.trim().length < MIN_INPUT_LENGTH && (
                    <span>
                      {" "}
                      ({MIN_INPUT_LENGTH - requirementsInput.trim().length} more
                      needed)
                    </span>
                  )}
              </p>
            </div>
            <Button
              size="lg"
              disabled={!canGenerate || isGenerating}
              onClick={handleGenerate}
              className="w-full"
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
                "Generate Specification"
              )}
            </Button>
          </CardContent>
        </Card>

        <RecentSpecs onLoad={handleLoadSpec} refreshKey={historyRefresh} />
      </div>

      {/* Right Side - Output (60%) */}
      <Card className="flex flex-col lg:w-3/5">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Generated Specification</CardTitle>
          {generatedSpec && <ExportMenu markdown={generatedSpec} />}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          {error ? (
            <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-destructive/10 p-4 animate-in fade-in duration-300">
              <p
                className="text-center text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
              <Button variant="outline" size="sm" onClick={handleGenerate}>
                Retry
              </Button>
            </div>
          ) : isGenerating ? (
            <SpecSkeleton />
          ) : generatedSpec ? (
            <div className="min-h-[400px] rounded-lg bg-muted p-5 text-sm animate-in fade-in duration-300 print:bg-white print:p-0">
              <MarkdownRenderer content={generatedSpec} />
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-1 items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">
                Your specification will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
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
