"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Database, FileText, GitCompare, MessageSquareQuote, ScanSearch } from "lucide-react";
import { UploadZone } from "@/components/upload/upload-zone";
import { DocumentList } from "@/components/upload/document-list";
import { ChatWindow } from "@/components/chat/chat-window";

const workflow = [
  { step: "01", title: "Upload", body: "Extract clean page-level text", color: "var(--accent-secondary)", offset: "lg:translate-y-0" },
  { step: "02", title: "Retrieve", body: "Find the most relevant chunks", color: "var(--accent)", offset: "lg:translate-y-24" },
  { step: "03", title: "Answer", body: "Generate cited responses", color: "var(--accent-tertiary)", offset: "lg:translate-y-48" },
  { step: "04", title: "Compare", body: "Route model outputs when useful", color: "var(--surface)", offset: "lg:translate-y-72" },
];

const features = [
  {
    icon: FileText,
    title: "Document ingestion",
    body: "PDFs become normalized page text, chunks, and retrieval metadata.",
    metric: "10MB / PDF",
    border: "var(--accent-secondary)",
  },
  {
    icon: Database,
    title: "Vector retrieval",
    body: "DeepSeek-compatible embeddings are queried through Supabase pgvector.",
    metric: "1024d index",
    border: "var(--accent)",
  },
  {
    icon: MessageSquareQuote,
    title: "Grounded answers",
    body: "Kimi answers from retrieved context and returns citation markers.",
    metric: "cited by page",
    border: "var(--accent-tertiary)",
  },
  {
    icon: GitCompare,
    title: "Model routing",
    body: "Compare runs both models against the same retrieved evidence.",
    metric: "2 model paths",
    border: "var(--border-strong)",
  },
];

const proofStack = ["Kimi K2.6", "DeepSeek V4 Pro", "Supabase pgvector", "Next.js 16", "Vercel"];

const pricingCards = [
  {
    label: "Manual",
    title: "Researcher",
    price: "$30/hr",
    details: "Human reading / slow handoff / no retrieval trace",
    items: ["Repeated searches", "Copy-paste summaries", "No cited source trail"],
  },
  {
    label: "Selected",
    title: "DotChat",
    price: "~$5/mo",
    details: "PDF upload / pgvector retrieval / cited chat",
    items: ["Grounded answers", "Chunk-level citations", "Two-model compare"],
    dark: true,
  },
  {
    label: "Workspace AI",
    title: "Seats",
    price: "$20/user",
    details: "Seat priced / workspace bound / limited routing",
    items: ["Per-user billing", "Generic search layer", "Less control over models"],
  },
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

function SectionHeader({ eyebrow, title, caption }: { eyebrow: string; title: string; caption?: string }) {
  return (
    <div className="grid border-b border-[var(--border)] lg:grid-cols-12">
      <div className="border-b border-[var(--border)] px-4 py-8 md:px-6 md:py-12 lg:col-span-8 lg:border-b-0 lg:border-r">
        <div className="editorial-label text-[var(--muted)]">{eyebrow}</div>
        <h2 className="editorial-heading mt-5 max-w-4xl font-serif text-[46px] leading-[0.95] md:text-[76px]">
          {title}
        </h2>
      </div>
      <div className="flex items-end px-4 py-8 md:px-6 lg:col-span-4">
        {caption ? <p className="max-w-sm text-[12px] leading-5 text-[var(--muted)]">{caption}</p> : null}
      </div>
    </div>
  );
}

function FrameTicks() {
  return <div className="frame-ticks" aria-hidden="true" />;
}

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--black)] p-2 text-[var(--foreground)] md:p-3">
      <div className="page-shell square-surface min-h-[calc(100vh-16px)] border border-[var(--border-strong)] md:min-h-[calc(100vh-24px)]">
        <FrameTicks />
        <header className="sticky top-2 z-30 flex min-h-[72px] items-center border-b border-[var(--border)] bg-[var(--surface)] md:top-3">
          <div className="grid w-full grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
            <a href="/" className="flex h-[72px] items-center gap-3 border-r border-[var(--border)] px-4 md:px-6">
              <span className="h-4 w-4 bg-[var(--black)]" aria-hidden="true" />
              <span className="editorial-label text-[var(--foreground)]">DotChat</span>
            </a>
            <nav className="hidden h-[72px] items-center divide-x divide-[var(--border)] border-r border-[var(--border)] md:flex">
              {[
                ["Product", "#product"],
                ["Workflow", "#workflow"],
                ["Demo", "#demo"],
                ["Case Study", "/case-study"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="editorial-label px-5 text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)]">
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex h-[72px] items-center justify-end px-4 md:px-6">
              <SquareButton href="https://calendly.com/anilpervaiz/15min" variant="outline" external>
                Book a call <ArrowRight className="h-4 w-4" />
              </SquareButton>
            </div>
          </div>
        </header>

        <main className="hairline-grid">
          <section id="product" className="relative grid min-h-[calc(100vh-96px)] border-b border-[var(--border)] lg:grid-cols-12">
            <div className="flex min-h-[520px] flex-col justify-between border-b border-[var(--border)] px-4 py-10 md:px-6 md:py-16 lg:col-span-8 lg:min-h-[760px] lg:border-b-0 lg:border-r">
              <div>
                <div className="editorial-label text-[var(--muted)]">Kimi chat / DeepSeek retrieval / Supabase pgvector</div>
                <h1 className="editorial-heading mt-10 max-w-[1000px] font-serif text-[52px] leading-[0.9] sm:text-[76px] md:text-[104px] xl:text-[124px]">
                  Chat with PDFs.
                  <br />
                  Get <span className="italic">cited</span> answers.
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-px border border-[var(--border)] bg-[var(--border)] text-[var(--muted)] md:grid-cols-4">
                {["Upload", "Retrieve", "Answer", "Cite"].map((label) => (
                  <div key={label} className="editorial-label bg-[var(--surface)] px-3 py-4">
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between px-4 py-8 md:px-6 md:py-16 lg:col-span-4">
              <div>
                <div className="editorial-label text-[var(--foreground)]">Up / cited answers across uploaded PDFs</div>
                <p className="mt-6 max-w-md text-[13px] leading-6 text-[var(--muted)]">
                  Upload internal documents, retrieve the right context, and ask grounded questions without guessing.
                </p>
              </div>
              <div className="mt-12 space-y-3">
                <SquareButton href="#demo">
                  Try the demo <ArrowRight className="h-4 w-4" />
                </SquareButton>
                <SquareButton href="/case-study" variant="outline">
                  View case study <ArrowRight className="h-4 w-4" />
                </SquareButton>
              </div>
            </div>
          </section>

          <section id="workflow" className="border-b border-[var(--border)]">
            <div className="grid min-h-[760px] border-b border-[var(--border)] lg:grid-cols-12">
              <div className="px-4 py-10 md:px-6 md:py-16 lg:col-span-5">
                <div className="editorial-label text-[var(--muted)]">Workflow</div>
                <h2 className="editorial-heading mt-5 max-w-3xl font-serif text-[46px] leading-[0.95] md:text-[78px]">
                  From uploaded PDF to cited answer.
                </h2>
              </div>
              <div className="relative grid gap-8 px-4 pb-12 md:px-6 lg:col-span-7 lg:block lg:py-16">
                {workflow.map((step, index) => (
                  <div
                    key={step.step}
                    className={`lg:absolute ${step.offset}`}
                    style={{ left: `${index * 16}%`, top: `${index * 8 + 10}%`, width: "min(420px, 100%)" }}
                  >
                    <div className="pixel-block h-36 w-full" style={{ "--pixel-color": step.color } as CSSProperties}>
                      <div className="editorial-label relative z-10 p-4 text-[var(--black)]">
                        {step.step} - {step.title}
                      </div>
                    </div>
                    <p className="mt-2 max-w-[260px] text-[12px] uppercase leading-5 tracking-[0.08em] text-[var(--muted)]">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 border-b border-[var(--border)] md:grid-cols-5">
              {proofStack.map((item) => (
                <div key={item} className="editorial-label border-r border-[var(--border)] px-4 py-7 text-[var(--foreground)] last:border-r-0 md:px-6">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-[var(--border)]">
            <SectionHeader
              eyebrow="System"
              title="A lean RAG product, not a chatbot wrapper."
              caption="Every panel maps to real product behavior: parse, index, retrieve, answer, cite, compare."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="min-h-[330px] border-b border-r border-[var(--border)] bg-[var(--surface)] p-5 last:border-r-0 md:p-6 xl:border-b-0"
                    style={{ borderTop: `2px solid ${feature.border}` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="editorial-label text-[var(--muted)]">0{index + 1}</span>
                      <Icon className="h-5 w-5 text-[var(--foreground)]" />
                    </div>
                    <h3 className="editorial-heading mt-20 font-serif text-[32px] leading-none">{feature.title}</h3>
                    <p className="mt-4 text-[12px] leading-5 text-[var(--muted)]">{feature.body}</p>
                    <div className="editorial-label mt-10 border-t border-[var(--border)] pt-3 text-[var(--foreground)]">
                      {feature.metric}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="grid border-b border-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["5", "chunks retrieved by default"],
              ["1024d", "embedding index"],
              ["2", "model routes"],
              ["0", "target unsupported claims"],
            ].map(([value, label]) => (
              <div key={label} className="min-h-[220px] border-b border-r border-[var(--border)] px-4 py-12 last:border-r-0 md:px-6 lg:border-b-0">
                <div className="font-serif text-[62px] leading-none md:text-[82px]">{value}</div>
                <div className="editorial-label mt-3 text-[var(--muted)]">{label}</div>
              </div>
            ))}
          </section>

          <section id="demo" className="border-b border-[var(--border)]">
            <SectionHeader
              eyebrow="Live demo"
              title="A square-edged workspace for document questions."
              caption="The console keeps the real upload, retrieval, chat, citations, compare, and model-selection flow."
            />
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[380px_1fr]">
              <div className="space-y-0 border-b border-[var(--border)] lg:border-b-0 lg:border-r">
                <UploadZone onUploaded={() => setRefreshKey((k) => k + 1)} />
                <DocumentList refreshKey={refreshKey} />
              </div>
              <div className="min-h-[780px] p-3 md:p-4">
                <ChatWindow />
              </div>
            </div>
          </section>

          <section className="border-b border-[var(--border)]">
            <SectionHeader
              eyebrow="Business case"
              title="Fast answers with visible sources."
              caption="A demo-scale RAG workflow that makes the cost and evidence trail legible."
            />
            <div className="grid gap-px border-b border-[var(--border)] bg-[var(--border)] p-px md:grid-cols-3">
              {pricingCards.map((card) => (
                <article key={card.title} className={card.dark ? "bg-[var(--black)] p-6 text-[var(--surface)]" : "bg-[var(--surface)] p-6 text-[var(--foreground)]"}>
                  <div className="flex items-center justify-between">
                    <div className={card.dark ? "editorial-label text-[rgba(242,235,225,0.7)]" : "editorial-label text-[var(--muted)]"}>{card.label}</div>
                    {card.dark ? <div className="editorial-label border border-[rgba(242,235,225,0.35)] px-2 py-1">Selected</div> : null}
                  </div>
                  <h3 className="editorial-heading mt-10 font-serif text-[42px] leading-none">{card.title}</h3>
                  <div className="mt-3 font-serif text-[48px] leading-none">{card.price}</div>
                  <p className={card.dark ? "mt-4 text-[12px] leading-5 text-[rgba(242,235,225,0.68)]" : "mt-4 text-[12px] leading-5 text-[var(--muted)]"}>{card.details}</p>
                  <div className="mt-10 divide-y divide-[var(--border)] border-t border-[var(--border)]">
                    {card.items.map((item) => (
                      <div key={item} className="py-3 text-[12px] leading-5">
                        - {item}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid min-h-[520px] place-items-center border-b border-[var(--border)] px-4 py-16 text-center md:px-6">
            <div>
              <div className="editorial-label text-[var(--muted)]">Built by Anil</div>
              <h2 className="editorial-heading mt-5 max-w-5xl font-serif text-[56px] leading-[0.95] md:text-[106px]">
                Upload once. Ask forever.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[13px] leading-6 text-[var(--muted)]">
                I design, build, and automate full-stack AI products for SMBs and agencies.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
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
          <div>DotChat / RAG demo / 2026</div>
          <div className="flex gap-5">
            <a href="/admin" className="transition-colors duration-150 hover:text-[var(--foreground)]">Dashboard</a>
            <a href="/case-study" className="transition-colors duration-150 hover:text-[var(--foreground)]">Case study</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
