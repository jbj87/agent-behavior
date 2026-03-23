export default function Header() {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="mx-auto flex max-w-[1200px] items-center gap-2">
        <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
        <h1 className="text-base font-medium tracking-tight text-foreground">
          Agent Spec Generator
        </h1>
      </div>
    </header>
  );
}
