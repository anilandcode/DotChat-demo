import { ArrowRight, CheckCircle2, Database, FileText, GitCompare, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

const stack = ["Next.js 16", "Vercel AI SDK", "Kimi K2.6", "DeepSeek V4 Pro", "Supabase pgvector", "Tailwind v4"];

const results = [
  { value: "PDF -> chunks", label: "page text extracted and indexed into pgvector" },
  { value: "5 chunks", label: "retrieved for every grounded answer by default" },
  { value: "2 models", label: "Kimi primary chat plus DeepSeek comparison" },
  { value: "~$5/mo", label: "demo-scale API cost target" },
];

const architecture = [
  { icon: FileText, title: "Ingest", body: "A PDF upload is parsed page by page, normalized, and split into overlapping token chunks." },
  { icon: Database, title: "Retrieve", body: "DeepSeek-compatible embeddings are stored in Supabase and queried through a pgvector RPC." },
  { icon: MessageCircle, title: "Answer", body: "Kimi receives only the retrieved chunks and must cite each factual claim with source markers." },
  { icon: GitCompare, title: "Compare", body: "A separate compare endpoint runs Kimi and DeepSeek over the same context for side-by-side evaluation." },
];

function SquareLink({
  href,
  children,
  dark = false,
}: {
  href: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`editorial-label inline-flex h-12 items-center gap-3 px-4 transition-colors duration-150 ${
        dark
          ? "bg-[var(--black)] text-[var(--surface)] hover:bg-[var(--foreground)]"
          : "border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--black)] hover:bg-[rgba(0,0,0,0.04)]"
      }`}
    >
      {children}
    </a>
  );
}

export default function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] p-2 text-[var(--foreground)] md:p-3">
      <div className="border border-[var(--border-strong)]">
        <header className="flex min-h-[72px] items-center justify-between border-b border-[var(--border)] px-4 md:px-6">
          <a href="/" className="editorial-label inline-flex items-center gap-3 text-[var(--foreground)]">
            <span className="h-4 w-4 border border-[var(--black)] bg-[var(--accent)]" aria-hidden="true" />
            DocChat
          </a>
          <SquareLink href="https://anilpervaiz.com" dark>
            Portfolio <ArrowRight className="h-4 w-4" />
          </SquareLink>
        </header>

        <section className="grid border-b border-[var(--border)] lg:grid-cols-12">
          <div className="border-b border-[var(--border)] px-4 py-12 md:px-6 md:py-20 lg:col-span-8 lg:border-b-0 lg:border-r">
            <div className="editorial-label text-[var(--muted)]">Case study</div>
            <h1 className="editorial-heading mt-8 max-w-4xl font-serif text-[56px] leading-[0.9] md:text-[96px]">
              DocChat - RAG over your documents.
            </h1>
          </div>
          <div className="flex flex-col justify-between px-4 py-8 md:px-6 md:py-20 lg:col-span-4">
            <p className="text-[13px] leading-6 text-[var(--muted)]">
              A production-style AI demo that turns uploaded PDFs into cited answers using a practical two-model architecture.
            </p>
            <div className="mt-10 flex flex-wrap gap-2">
              {stack.map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="grid border-b border-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {results.map((result) => (
            <div key={result.value} className="border-b border-r border-[var(--border)] bg-[var(--surface)] p-5 last:border-r-0 lg:border-b-0">
              <div className="font-serif text-[34px] leading-none tracking-[-0.05em]">{result.value}</div>
              <p className="mt-4 text-[12px] leading-5 text-[var(--muted)]">{result.label}</p>
            </div>
          ))}
        </section>

        <section className="grid border-b border-[var(--border)] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-[var(--border)] px-4 py-10 md:px-6 md:py-14 lg:border-b-0 lg:border-r">
            <div className="editorial-label text-[var(--muted)]">Problem</div>
            <h2 className="editorial-heading mt-5 font-serif text-[46px] leading-[0.95] md:text-[68px]">
              Internal documents are useful only if teams can query them.
            </h2>
            <p className="mt-6 text-[13px] leading-6 text-[var(--muted)]">
              SMB teams often have policies, manuals, onboarding docs, and client instructions scattered across PDFs. A useful workflow needs ingestion, retrieval, source citations, and an honest fallback when the answer is not in the document.
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="border border-[var(--border)] bg-[var(--card-elevated)]">
              <div className="editorial-label border-b border-[var(--border)] px-4 py-3 text-[var(--muted)]">Build goals</div>
              {[
                "Accept real PDF uploads.",
                "Embed chunks into Supabase pgvector.",
                "Answer only from retrieved context.",
                "Render citations as clickable source chips.",
                "Show model-routing judgment, not just a wrapper around one LLM.",
              ].map((goal) => (
                <div key={goal} className="flex gap-3 border-b border-[var(--border)] px-4 py-4 last:border-b-0">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--foreground)]" />
                  <div className="text-[13px] leading-5 text-[var(--muted)]">{goal}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)]">
          <div className="border-b border-[var(--border)] px-4 py-8 md:px-6">
            <div className="editorial-label text-[var(--muted)]">Architecture</div>
            <h2 className="editorial-heading mt-4 font-serif text-[46px] leading-[0.95] md:text-[68px]">
              A lean RAG pipeline without extra infrastructure.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4">
            {architecture.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="min-h-[280px] border-b border-r border-[var(--border)] bg-[var(--surface)] p-5 last:border-r-0 md:border-b-0">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[var(--foreground)]" />
                    <span className="editorial-label text-[var(--muted)]">0{index + 1}</span>
                  </div>
                  <h3 className="editorial-heading mt-16 font-serif text-[34px] leading-none">{item.title}</h3>
                  <p className="mt-3 text-[12px] leading-5 text-[var(--muted)]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-12">
          <div className="border-b border-[var(--border)] px-4 py-10 md:px-6 md:py-14 lg:col-span-8 lg:border-b-0 lg:border-r">
            <div className="editorial-label text-[var(--muted)]">Work with Anil</div>
            <h2 className="editorial-heading mt-5 font-serif text-[52px] leading-[0.95] md:text-[82px]">
              Want a document AI workflow for your business?
            </h2>
          </div>
          <div className="flex flex-col justify-between px-4 py-8 md:px-6 md:py-14 lg:col-span-4">
            <p className="text-[13px] leading-6 text-[var(--muted)]">
              I design, build, and automate AI products for SMBs and agencies - full-stack, shipped in 14 days, no handoffs.
            </p>
            <div className="mt-10 space-y-3">
              <SquareLink href="https://anilpervaiz.com" dark>
                Back to portfolio <ArrowRight className="h-4 w-4" />
              </SquareLink>
              <SquareLink href="https://calendly.com/anilpervaiz/15min">
                Book a call <ArrowRight className="h-4 w-4" />
              </SquareLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
