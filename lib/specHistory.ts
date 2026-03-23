const STORAGE_KEY = "agent-spec-history";
const MAX_ENTRIES = 5;

export interface SpecHistoryEntry {
  id: string;
  requirements: string;
  spec: string;
  createdAt: string;
}

export function loadHistory(): SpecHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(requirements: string, spec: string): void {
  const history = loadHistory();
  const entry: SpecHistoryEntry = {
    id: crypto.randomUUID(),
    requirements: requirements.slice(0, 120),
    spec,
    createdAt: new Date().toISOString(),
  };
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
