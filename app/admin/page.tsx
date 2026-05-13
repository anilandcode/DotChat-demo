import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StatCard(props: { label: string; value: string; note?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs" style={{ color: "var(--foreground-2)" }}>
        {props.label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{props.value}</div>
      {props.note ? (
        <div className="mt-1 text-xs" style={{ color: "var(--foreground-2)" }}>
          {props.note}
        </div>
      ) : null}
    </Card>
  );
}

export default function AdminPage() {
  const rows = [
    { q: "What's the refund policy?", model: "DeepSeek", when: "2m ago" },
    { q: "Summarize page 3.", model: "Kimi", when: "6m ago" },
    { q: "Are there any warnings?", model: "DeepSeek", when: "13m ago" },
    { q: "Quote the most important paragraph.", model: "Kimi", when: "19m ago" },
    { q: "What data is collected?", model: "DeepSeek", when: "24m ago" },
    { q: "Any security requirements?", model: "DeepSeek", when: "31m ago" },
    { q: "List key takeaways.", model: "Kimi", when: "39m ago" },
    { q: "What is the escalation path?", model: "DeepSeek", when: "45m ago" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--foreground-2)" }}>
            Demo metrics dashboard (placeholder data).
          </p>
        </div>
        <Badge variant="secondary">Aurora Labs</Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total queries" value="8,247" note="Last 30 days" />
        <StatCard label="Avg latency (DeepSeek)" value="1.2s" note="p50" />
        <StatCard label="Avg latency (Kimi)" value="1.9s" note="p50" />
        <StatCard label="Documents indexed" value="12" note="Across 3 teams" />
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <div className="font-medium">Recent queries</div>
          <Badge variant="outline">demo</Badge>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium" style={{ background: "color-mix(in_srgb,var(--panel)_70%,transparent)" }}>
            <div className="col-span-7">Query</div>
            <div className="col-span-3">Model</div>
            <div className="col-span-2">When</div>
          </div>
          {rows.map((r, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-2 border-t px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="col-span-7 truncate">{r.q}</div>
              <div className="col-span-3" style={{ color: "var(--foreground-2)" }}>
                {r.model}
              </div>
              <div className="col-span-2" style={{ color: "var(--foreground-2)" }}>
                {r.when}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

