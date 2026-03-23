import Header from "@/components/Header";
import SpecGenerator from "@/components/SpecGenerator";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col overflow-hidden rounded-none border-x border-border bg-card lg:rounded-b-xl">
        <ErrorBoundary>
          <SpecGenerator />
        </ErrorBoundary>
      </main>
    </>
  );
}
