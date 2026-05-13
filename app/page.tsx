"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Database, FileText, GitCompare, MessageSquareQuote, ScanSearch } from "lucide-react";
import { UploadZone } from "@/components/upload/upload-zone";
import { DocumentList } from "@/components/upload/document-list";
import { ChatWindow } from "@/components/chat/chat-window";

const workflow = [
  { step: "01", title: "Upload", body: "Extract clean page-level text", color: "var(--accent-secondary)" },
  { step: "02", title: "Retrieve", body: "Find the most relevant chunks", color: "var(--accent)" },
  { step: "03", title: "Answer", body: "Generate cited responses", color: "var(--accent-tertiary)" },
  { step: "04", title: "Compare", body: "Route between model outputs if needed", color: "var(--surface)" },
];

const features = [
  {
    icon: FileText,
    title: "Document ingestion",
    body: "PDF uploads become normalized page text and chunk metadata for retrieval.",
    metric: "10MB / PDF",
  },
  {
    icon: Database,
    title: "Vector retrieval",
    body: "DeepSeek-compatible embeddings are stored and queried through Supabase pgvector.",
    metric: "5 chunks",
  },
  {
    icon: MessageSquareQuote,
    title: "Grounded answers",
    body: "Kimi receives retrieved context and cites factual claims back to source chunks.",
    metric: "cited by page",
  },
  {
    icon: GitCompare,
    title: "Model routing",
    body: "Compare endpoint runs both models over the same retrieved context.",
    metric: "2 models",
  },
];

const costRows = [
  { option: "Researcher reading docs", cost: "$30/hr", coverage: "Manual follow-up" },
  { option: "Notion AI seats", cost: "$20/user/mo", coverage: "Workspace-bound" },
  { option: "DocChat API demo", cost: "~$5/mo", coverage: "Document Q&A" },
];

function SquareButton({
  href,
  children,
  variant = "dark",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "dark" | "outline";
  external?: boolean;
}) {
  const className =
    variant === "dark"
      ? "bg-[var(--black)] text-[var(--surface)] hover:bg-[var(--foreground)]"
      : "border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--black)] hover:bg-[rgba(0,0,0,0.04)]";

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`editorial-label inline-flex h-12 items-center justify-between gap-4 px-4 transition-colors duration-150 ${className}`}
    >
      {children}
    </a>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-b border-[var(--border)] px-4 py-6 md:px-6 md:py-8">
      <div className="editorial-label text-[var(--muted)]">{eyebrow}</div>
      <h2 className="editorial-heading mt-4 max-w-3xl font-serif text-[42px] leading-[0.95] md:text-[60px]">
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--background)] p-2 text-[var(--foreground)] md:p-3">
      <div className="min-h-[calc(100vh-16px)] border border-[var(--border-strong)] md:min-h-[calc(100vh-24px)]">
        <header className="sticky top-2 z-30 flex min-h-[72px] items-center border-b border-[var(--border)] bg-[var(--surface)] md:top-3">
          <div className="grid w-full grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
            <a href="/" className="flex h-[72px] items-center gap-3 border-r border-[var(--border)] px-4 md:px-6">
              <span className="h-4 w-4 border border-[var(--black)] bg-[var(--accent)]" aria-hidden="true" />
              <span className="editorial-label text-[var(--foreground)]">DocChat</span>
            </a>
            <nav className="hidden h-[72px] items-center divide-x divide-[var(--border)] border-r border-[var(--border)] md:flex">
              <a href="#product" className="editorial-label px-5 text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)]">
                Product
              </a>
              <a href="#workflow" className="editorial-label px-5 text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)]">
                Workflow
              </a>
              <a href="#demo" className="editorial-label px-5 text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)]">
                Demo
              </a>
              <a href="/case-study" className="editorial-label px-5 text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)]">
                Case Study
              </a>
            </nav>
            <div className="flex h-[72px] items-center justify-end px-4 md:px-6">
              <SquareButton href="https://calendly.com/anilpervaiz/15min" variant="outline" external>
                Book a call <ArrowRight className="h-4 w-4" />
              </SquareButton>
            </div>
          </div>
        </header>

        <main className="hairline-grid">
          <section id="product" className="grid min-h-[calc(100vh-96px)] border-b border-[var(--border)] lg:grid-cols-12">
            <div className="flex flex-col justify-between border-b border-[var(--border)] px-4 py-10 md:px-6 md:py-16 lg:col-span-8 lg:border-b-0 lg:border-r">
              <div>
                <div className="editorial-label text-[var(--muted)]">Kimi chat / DeepSeek retrieval / Supabase pgvector</div>
                <h1 className="editorial-heading mt-10 max-w-[920px] font-serif text-[56px] leading-[0.9] sm:text-[72px] md:text-[96px] lg:text-[112px]">
                  Chat with PDFs.
                  <br />
                  Get <span className="italic">cited</span> answers.
                </h1>
              </div>
              <div className="mt-12 grid gap-3 sm:grid-cols-3">
                <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="editorial-label text-[var(--muted)]">Stack</div>
                  <div className="mt-2 text-[13px]">Next.js 16 / Tailwind v4 / TypeScript</div>
                </div>
                <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="editorial-label text-[var(--muted)]">Retrieval</div>
                  <div className="mt-2 text-[13px]">DeepSeek V4 Pro embeddings</div>
                </div>
                <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="editorial-label text-[var(--muted)]">Answers</div>
                  <div className="mt-2 text-[13px]">Source-cited chat responses</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between px-4 py-8 md:px-6 md:py-16 lg:col-span-4">
              <div className="max-w-md text-[13px] leading-6 text-[var(--muted)]">
                Upload internal documents, retrieve the right context, and ask grounded questions without guessing.
              </div>
              <div className="mt-12 space-y-3">
                <SquareButton href="#demo">
                  Try the demo <ArrowRight className="h-4 w-4" />
                </SquareButton>
                <SquareButton href="/case-study" variant="outline">
                  View case study <ArrowRight className="h-4 w-4" />
                </SquareButton>
                <div className="editorial-label pt-4 text-[var(--muted)]">
                  Kimi chat / DeepSeek retrieval / Supabase pgvector
                </div>
              </div>
            </div>
          </section>

          <section id="workflow" className="border-b border-[var(--border)]">
            <SectionHeader eyebrow="Workflow" title="From uploaded PDF to cited answer." />
            <div className="grid grid-cols-1 md:grid-cols-4">
              {workflow.map((step) => (
                <div key={step.step} className="min-h-[260px] border-b border-r border-[var(--border)] p-4 last:border-r-0 md:border-b-0 md:p-6">
                  <div className="editorial-label text-[var(--muted)]">{step.step}</div>
                  <div className="mt-8 h-24 border border-[var(--border)]" style={{ background: step.color }} />
                  <h3 className="editorial-heading mt-8 font-serif text-[34px] leading-none">{step.title}</h3>
                  <p className="mt-3 text-[12px] leading-5 text-[var(--muted)]">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-[var(--border)]">
            <SectionHeader eyebrow="System" title="A lean RAG product, not a chatbot wrapper." />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="min-h-[300px] border-b border-r border-[var(--border)] bg-[var(--surface)] p-5 last:border-r-0 md:p-6 xl:border-b-0">
                    <div className="flex items-center justify-between">
                      <span className="editorial-label text-[var(--muted)]">0{index + 1}</span>
                      <Icon className="h-5 w-5 text-[var(--foreground)]" />
                    </div>
                    <h3 className="editorial-heading mt-16 font-serif text-[34px] leading-none">{feature.title}</h3>
                    <p className="mt-4 text-[12px] leading-5 text-[var(--muted)]">{feature.body}</p>
                    <div className="editorial-label mt-10 border-t border-[var(--border)] pt-3 text-[var(--foreground)]">
                      {feature.metric}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="demo" className="border-b border-[var(--border)]">
            <SectionHeader eyebrow="Live demo" title="A square-edged workspace for document questions." />
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
              <div className="space-y-0 border-b border-[var(--border)] lg:border-b-0 lg:border-r">
                <UploadZone onUploaded={() => setRefreshKey((k) => k + 1)} />
                <DocumentList refreshKey={refreshKey} />
              </div>
              <div className="min-h-[760px] p-3 md:p-4">
                <ChatWindow />
              </div>
            </div>
          </section>

          <section className="grid border-b border-[var(--border)] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-[var(--border)] px-4 py-10 md:px-6 md:py-14 lg:border-b-0 lg:border-r">
              <div className="editorial-label text-[var(--muted)]">Business case</div>
              <h2 className="editorial-heading mt-5 max-w-xl font-serif text-[46px] leading-[0.95] md:text-[72px]">
                Fast answers with visible sources.
              </h2>
              <p className="mt-6 max-w-md text-[13px] leading-6 text-[var(--muted)]">
                The value is less time searching, fewer unsupported answers, and a clear path from prototype to internal AI workflow.
              </p>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {costRows.map((row) => (
                <div key={row.option} className={`grid grid-cols-12 gap-3 px-4 py-6 text-[13px] md:px-6 ${row.option === "DocChat API demo" ? "bg-[var(--black)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>
                  <div className="col-span-6">{row.option}</div>
                  <div className="col-span-3 text-center">{row.cost}</div>
                  <div className="col-span-3 text-right">{row.coverage}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid min-h-[420px] lg:grid-cols-12">
            <div className="border-b border-[var(--border)] px-4 py-10 md:px-6 md:py-14 lg:col-span-8 lg:border-b-0 lg:border-r">
              <div className="editorial-label text-[var(--muted)]">Built by Anil</div>
              <h2 className="editorial-heading mt-5 max-w-4xl font-serif text-[52px] leading-[0.95] md:text-[86px]">
                Want this for your team's docs?
              </h2>
            </div>
            <div className="flex flex-col justify-between px-4 py-8 md:px-6 md:py-14 lg:col-span-4">
              <p className="text-[13px] leading-6 text-[var(--muted)]">
                I design, build, and automate full-stack AI products for SMBs and agencies.
              </p>
              <div className="mt-10 space-y-3">
                <SquareButton href="https://anilpervaiz.com" external>
                  Back to portfolio <ArrowRight className="h-4 w-4" />
                </SquareButton>
                <SquareButton href="/admin" variant="outline">
                  View dashboard <ScanSearch className="h-4 w-4" />
                </SquareButton>
              </div>
            </div>
          </section>
        </main>

        <footer className="flex flex-col justify-between gap-3 border-t border-[var(--border)] px-4 py-5 text-[11px] uppercase tracking-[0.1em] text-[var(--muted)] md:flex-row md:px-6">
          <div>DocChat / RAG demo / 2026</div>
          <div className="flex gap-5">
            <a href="/admin" className="transition-colors duration-150 hover:text-[var(--foreground)]">Dashboard</a>
            <a href="/case-study" className="transition-colors duration-150 hover:text-[var(--foreground)]">Case study</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
