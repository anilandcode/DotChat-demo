import { ArrowRight, CheckCircle2, Database, FileText, GitCompare, MessageCircle } from "lucide-react";
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

export default function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 text-[14px] text-[var(--foreground-2)] hover:text-[var(--foreground)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            DocChat
          </a>
          <a
            href="https://anilpervaiz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Portfolio
          </a>
        </div>
      </header>

      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            Case study
          </div>
          <h1 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[64px]">
            DocChat - RAG over your documents
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-[1.6]" style={{ color: "var(--foreground-2)" }}>
            A production-style AI demo that turns uploaded PDFs into cited answers using a practical two-model architecture.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {stack.map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)] px-6 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((result) => (
            <div key={result.value} className="rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5 text-center">
              <div className="text-3xl font-semibold tracking-tight">{result.value}</div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--foreground-2)" }}>
                {result.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="mb-3 block text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
              Problem
            </span>
            <h2 className="text-[36px] font-semibold tracking-tight">Internal documents are useful only if teams can query them.</h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "var(--foreground-2)" }}>
              SMB teams often have policies, manuals, onboarding docs, and client instructions scattered across PDFs. A generic chatbot can summarize text, but a useful workflow needs ingestion, retrieval, source citations, and an honest fallback when the answer is not in the document.
            </p>
          </div>
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="font-medium">Build goals</div>
            <div className="mt-5 space-y-4">
              {[
                "Accept real PDF uploads.",
                "Embed chunks into Supabase pgvector.",
                "Answer only from retrieved context.",
                "Render citations as clickable source pills.",
                "Show model-routing judgment, not just a wrapper around one LLM.",
              ].map((goal) => (
                <div key={goal} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <div className="text-sm leading-relaxed" style={{ color: "var(--foreground-2)" }}>{goal}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 block text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
              Architecture
            </span>
            <h2 className="text-[36px] font-semibold tracking-tight">A lean RAG pipeline without extra infrastructure</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {architecture.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[var(--accent)]" />
                    <span className="text-xs text-[var(--foreground-3)]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-[18px] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--foreground-2)" }}>
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 block text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
            Work with Anil
          </span>
          <h2 className="text-[40px] font-semibold leading-tight tracking-[-0.03em]">Want a document AI workflow for your business?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: "var(--foreground-2)" }}>
            I design, build, and automate AI products for SMBs and agencies - full-stack, shipped in 14 days, no handoffs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://anilpervaiz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Back to portfolio <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://calendly.com/anilpervaiz/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--border-strong)] px-5 py-3 text-[15px] font-medium transition-colors hover:bg-[var(--card)]"
            >
              Book a call
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
