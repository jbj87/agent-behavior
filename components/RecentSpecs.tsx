"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  loadHistory,
  clearHistory,
  type SpecHistoryEntry,
} from "@/lib/specHistory";

interface RecentSpecsProps {
  onLoad: (spec: string) => void;
  refreshKey: number;
}

export default function RecentSpecs({ onLoad, refreshKey }: RecentSpecsProps) {
  const [entries, setEntries] = useState<SpecHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, [refreshKey]);

  const handleClear = useCallback(() => {
    clearHistory();
    setEntries([]);
  }, []);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Recent Specs</h3>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleClear}
          aria-label="Clear history"
        >
          Clear
        </Button>
      </div>
      <ul className="flex flex-col gap-2" role="list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => onLoad(entry.spec)}
              className="w-full rounded-md border border-border bg-card p-3 text-left transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Load spec: ${entry.requirements}`}
            >
              <p className="truncate text-xs font-medium text-foreground">
                {entry.requirements}
              </p>
              <time
                className="mt-1 block text-xs text-muted-foreground"
                dateTime={entry.createdAt}
              >
                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
