import Header from "@/components/Header";
import SpecGenerator from "@/components/SpecGenerator";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-6">
        <ErrorBoundary>
          <SpecGenerator />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
