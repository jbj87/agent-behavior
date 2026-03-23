"use client";

import { lazy, Suspense, type ComponentProps } from "react";

const ReactMarkdown = lazy(() => import("react-markdown"));

const components: ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-6 text-2xl font-bold first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-5 text-xl font-semibold first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-lg font-medium">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 ml-4 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-4 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-md bg-foreground/5 p-3 font-mono text-sm">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mb-3">{children}</pre>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Suspense
      fallback={
        <div className="whitespace-pre-wrap font-mono text-sm">
          {content}
        </div>
      }
    >
      <div className="prose-spec">
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </div>
    </Suspense>
  );
}
