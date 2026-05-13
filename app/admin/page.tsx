import { BarChart3, Clock, Database, Smile } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total queries", value: "8,247", note: "Last 30 days", icon: BarChart3 },
  { label: "DeepSeek latency", value: "1.2s", note: "p50 retrieval + answer", icon: Clock },
  { label: "Avg satisfaction", value: "94%", note: "Cited answers marked useful", icon: Smile },
  { label: "Documents indexed", value: "12", note: "Across 3 teams", icon: Database },
];

const rows = [
  { q: "What's the refund policy?", model: "Kimi", source: "Handbook", when: "2m ago", status: "answered" },
  { q: "Summarize page 3.", model: "Kimi", source: "Product manual", when: "6m ago", status: "answered" },
  { q: "Are there any warnings?", model: "DeepSeek", source: "Security policy", when: "13m ago", status: "compared" },
  { q: "Quote the most important paragraph.", model: "Kimi", source: "Handbook", when: "19m ago", status: "answered" },
  { q: "What data is collected?", model: "DeepSeek", source: "Security policy", when: "24m ago", status: "compared" },
  { q: "Any security requirements?", model: "Kimi", source: "Security policy", when: "31m ago", status: "answered" },
  { q: "List key takeaways.", model: "Kimi", source: "Product manual", when: "39m ago", status: "answered" },
  { q: "What is the escalation path?", model: "DeepSeek", source: "Handbook", when: "45m ago", status: "compared" },
];

function StatCard(props: (typeof stats)[number]) {
  const Icon = props.icon;

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="editorial-label text-[var(--muted)]">{props.label}</div>
          <div className="mt-4 font-serif text-[44px] leading-none tracking-[-0.05em]">{props.value}</div>
          <div className="mt-2 text-xs text-[var(--muted)]">{props.note}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--black)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-2 text-[var(--foreground)] md:p-3">
      <div className="border border-[var(--border-strong)]">
        <header className="flex min-h-[72px] items-center justify-between border-b border-[var(--border)] px-4 md:px-6">
          <a href="/" className="editorial-label inline-flex items-center gap-3 text-[var(--foreground)]">
            <span className="h-4 w-4 border border-[var(--black)] bg-[var(--accent)]" aria-hidden="true" />
            Back to DocChat
          </a>
          <Badge variant="secondary">Aurora Labs</Badge>
        </header>

        <section className="grid border-b border-[var(--border)] lg:grid-cols-12">
          <div className="border-b border-[var(--border)] px-4 py-10 md:px-6 md:py-14 lg:col-span-8 lg:border-b-0 lg:border-r">
            <div className="editorial-label text-[var(--muted)]">Internal console</div>
            <h1 className="editorial-heading mt-5 font-serif text-[56px] leading-[0.9] md:text-[92px]">
              Admin dashboard.
            </h1>
          </div>
          <div className="flex items-end px-4 py-8 md:px-6 md:py-14 lg:col-span-4">
            <p className="text-[13px] leading-6 text-[var(--muted)]">
              Demo analytics for retrieval quality, model latency, and recent document questions.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 border-b border-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-b border-r border-[var(--border)] last:border-r-0 lg:border-b-0">
              <StatCard {...stat} />
            </div>
          ))}
        </section>

        <Card className="border-0 bg-[var(--surface)] p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 md:px-6">
            <div>
              <div className="editorial-label text-[var(--foreground)]">Recent queries</div>
              <div className="mt-1 text-xs text-[var(--muted)]">Placeholder data for the portfolio walkthrough.</div>
            </div>
            <Badge variant="outline">demo data</Badge>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-12 gap-3 border-b border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)] md:px-6">
                <div className="col-span-6">Query</div>
                <div className="col-span-2">Model</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">When</div>
              </div>
              {rows.map((r) => (
                <div
                  key={`${r.q}-${r.when}`}
                  className="grid grid-cols-12 items-center gap-3 border-b border-[var(--border)] px-4 py-4 text-sm last:border-b-0 md:px-6"
                >
                  <div className="col-span-6 min-w-0">
                    <div className="truncate">{r.q}</div>
                  </div>
                  <div className="col-span-2 text-[var(--muted)]">{r.model}</div>
                  <div className="col-span-2 truncate text-[var(--muted)]">{r.source}</div>
                  <div className="col-span-1">
                    <Badge variant={r.status === "compared" ? "secondary" : "outline"}>{r.status}</Badge>
                  </div>
                  <div className="col-span-1 text-right text-[var(--muted)]">{r.when}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
