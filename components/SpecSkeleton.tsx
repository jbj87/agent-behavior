export default function SpecSkeleton() {
  return (
    <div
      className="flex-1 space-y-4 rounded-lg bg-muted p-6"
      role="status"
      aria-label="Generating specification"
    >
      {/* Heading skeleton */}
      <div className="h-7 w-3/4 animate-pulse rounded bg-border" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-border" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-border" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-border" />
      </div>
      {/* Section skeleton */}
      <div className="h-6 w-1/2 animate-pulse rounded bg-border" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-border" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-border" />
      </div>
      {/* Section skeleton */}
      <div className="h-6 w-2/5 animate-pulse rounded bg-border" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-border" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-border" />
      </div>
      <span className="sr-only">Generating specification...</span>
    </div>
  );
}
