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
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--foreground-3)" }}>
            {props.label}
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{props.value}</div>
          <div className="mt-1 text-xs" style={{ color: "var(--foreground-2)" }}>
            {props.note}
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-[13px] text-[var(--foreground-2)] hover:text-[var(--foreground)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              Back to DocChat
            </a>
            <h1 className="mt-6 text-[40px] font-semibold leading-tight tracking-[-0.03em]">Admin dashboard</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed" style={{ color: "var(--foreground-2)" }}>
              Demo analytics for retrieval quality, model latency, and recent document questions.
            </p>
          </div>
          <Badge variant="secondary">Aurora Labs</Badge>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <Card className="mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-medium">Recent queries</div>
              <div className="mt-1 text-xs" style={{ color: "var(--foreground-2)" }}>
                Placeholder data for the portfolio walkthrough.
              </div>
            </div>
            <Badge variant="outline">demo data</Badge>
          </div>

          <div className="mt-5 overflow-hidden rounded-[16px] border border-[var(--border)]">
            <div className="grid grid-cols-12 gap-3 bg-[var(--surface)] px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-[var(--foreground-3)]">
              <div className="col-span-6">Query</div>
              <div className="col-span-2 hidden sm:block">Model</div>
              <div className="col-span-2 hidden md:block">Source</div>
              <div className="col-span-3 sm:col-span-2">Status</div>
              <div className="col-span-3 text-right sm:col-span-2 md:col-span-1">When</div>
            </div>
            {rows.map((r) => (
              <div
                key={`${r.q}-${r.when}`}
                className="grid grid-cols-12 items-center gap-3 border-t border-[var(--border)] px-4 py-3 text-sm"
              >
                <div className="col-span-6 min-w-0">
                  <div className="truncate">{r.q}</div>
                  <div className="mt-1 text-xs sm:hidden" style={{ color: "var(--foreground-3)" }}>
                    {r.model} - {r.source}
                  </div>
                </div>
                <div className="col-span-2 hidden text-[var(--foreground-2)] sm:block">{r.model}</div>
                <div className="col-span-2 hidden truncate text-[var(--foreground-2)] md:block">{r.source}</div>
                <div className="col-span-3 sm:col-span-2">
                  <Badge variant={r.status === "compared" ? "secondary" : "outline"}>{r.status}</Badge>
                </div>
                <div className="col-span-3 text-right text-[var(--foreground-3)] sm:col-span-2 md:col-span-1">
                  {r.when}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
