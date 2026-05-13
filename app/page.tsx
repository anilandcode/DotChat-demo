"use client";

import { useState } from "react";
import { ArrowRight, FileText, MessageCircle, SearchCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UploadZone } from "@/components/upload/upload-zone";
import { DocumentList } from "@/components/upload/document-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { ThemeToggle } from "@/components/theme-toggle";

const steps = [
  { icon: FileText, title: "Upload", body: "Drop in a PDF and DocChat extracts clean page-level text." },
  { icon: SearchCheck, title: "Retrieve", body: "DeepSeek embeddings find the most relevant chunks in Supabase pgvector." },
  { icon: MessageCircle, title: "Answer", body: "Kimi responds with grounded citations back to the exact source." },
];

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header
        className="sticky top-0 z-30 border-b border-[var(--border)] backdrop-blur-md"
        style={{ background: "color-mix(in_srgb,var(--background)_80%,transparent)" }}
      >
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <span className="text-[15px] font-semibold">DocChat</span>
          </a>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            <a href="#demo" className="text-[14px] text-[var(--foreground-2)] transition-colors hover:text-[var(--foreground)]">
              Demo
            </a>
            <a href="#how-it-works" className="text-[14px] text-[var(--foreground-2)] transition-colors hover:text-[var(--foreground)]">
              How it works
            </a>
            <a href="/admin" className="text-[14px] text-[var(--foreground-2)] transition-colors hover:text-[var(--foreground)]">
              Dashboard
            </a>
            <a href="/case-study" className="text-[14px] text-[var(--foreground-2)] transition-colors hover:text-[var(--foreground)]">
              Case study
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <a
              href="https://calendly.com/anilpervaiz/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-[var(--accent)] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)] md:inline-flex"
            >
              Book a call
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="flex flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              Kimi chat - DeepSeek retrieval - Supabase pgvector
            </div>
            <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[60px]">
              Chat with PDFs.
              <br />
              Get <span className="text-[var(--accent)]">cited answers.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-[1.6]" style={{ color: "var(--foreground-2)" }}>
              DocChat is a production-style RAG demo for teams that need answers from internal documents without guessing.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
              >
                Try the demo <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/case-study"
                className="rounded-full border border-[var(--border-strong)] px-5 py-3 text-[15px] font-medium transition-colors hover:bg-[var(--card)]"
              >
                View case study
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge variant="outline">Next.js 16</Badge>
              <Badge variant="outline">Kimi K2.6</Badge>
              <Badge variant="outline">DeepSeek V4 Pro</Badge>
              <Badge variant="outline">Supabase pgvector</Badge>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-[var(--border)] bg-[var(--surface)] px-6 py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-6">
                  <span className="absolute right-6 top-5 text-[40px] font-semibold leading-none text-[var(--foreground-3)] opacity-30">
                    0{index + 1}
                  </span>
                  <Icon className="h-6 w-6 text-[var(--accent)]" />
                  <h2 className="mt-10 text-[18px] font-semibold">{step.title}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--foreground-2)" }}>
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="demo" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <span className="mb-3 block text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
                Live demo
              </span>
              <h2 className="text-[36px] font-semibold tracking-tight">Upload, retrieve, ask</h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed" style={{ color: "var(--foreground-2)" }}>
                The shell is ready now. Connect Supabase and API keys to run the full ingestion and chat flow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
              <div className="space-y-5">
                <UploadZone onUploaded={() => setRefreshKey((k) => k + 1)} />
                <DocumentList refreshKey={refreshKey} />
              </div>
              <div className="h-[720px] min-h-[640px]">
                <ChatWindow />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)] px-6 py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <span className="mb-3 block text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
              Built by Anil
            </span>
            <h2 className="text-[36px] font-semibold tracking-tight">Want this for your team's docs?</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed" style={{ color: "var(--foreground-2)" }}>
              I design, build, and automate full-stack AI products for SMBs and agencies.
            </p>
            <a
              href="https://anilpervaiz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Back to portfolio <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-[13px] text-[var(--foreground-3)] md:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            Built by{" "}
            <a href="https://anilpervaiz.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
              Anil Pervaiz
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a href="/admin" className="transition-colors hover:text-[var(--foreground)]">Dashboard</a>
            <a href="/case-study" className="transition-colors hover:text-[var(--foreground)]">Case study</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
