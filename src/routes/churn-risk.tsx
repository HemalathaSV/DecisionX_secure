import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Sparkles, Gift, Crown, Percent, HeartHandshake } from "lucide-react";
import { GlassCard, ScoreRing, Avatar } from "@/components/primitives";
import { safeGetDocs } from "@/lib/db-service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/churn-risk")({
  head: () => ({
    meta: [
      { title: "Churn Risk — SecureAI" },
      { name: "description", content: "Identify customers at risk of churning and trigger AI-recommended retention actions." },
      { property: "og:title", content: "Churn Risk — SecureAI" },
      { property: "og:description", content: "AI-driven churn prediction and retention playbook." },
    ],
  }),
  component: ChurnRiskPage,
});

function ChurnRiskPage() {
  const [sort, setSort] = useState<"score" | "name">("score");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await safeGetDocs("churn_users");
      setCustomers(data);
      setLoading(false);
    };
    load();
  }, []);
  const sorted = useMemo(() => {
    const copy = [...customers];
    if (sort === "score") copy.sort((a, b) => b.score - a.score);
    else copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [sort]);

  const buckets = {
    high: customers.filter((c) => c.score >= 80).length,
    medium: customers.filter((c) => c.score >= 50 && c.score < 80).length,
    low: customers.filter((c) => c.score < 50).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Retention Intelligence</div>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">Churn Risk</h1>
        <p className="mt-1 text-sm text-muted-foreground">Predicted churn with tailored retention actions per customer.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryPill label="At Risk" value={customers.length} tone="primary" />
        <SummaryPill label="High (80+)" value={buckets.high} tone="danger" />
        <SummaryPill label="Medium" value={buckets.medium} tone="warning" />
        <SummaryPill label="Low" value={buckets.low} tone="success" />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{sorted.length} customers</div>
        <div className="flex gap-2">
          {(["score","name"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium",
                sort === s ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-white/[0.03] text-muted-foreground"
              )}
            >
              Sort: {s === "score" ? "Churn Score" : "Name"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground">Loading churn data...</div>
        ) : sorted.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground">No churn data available. Generate it in Dataset Manager.</div>
        ) : (
          sorted.map((c, i) => (
            <ChurnCard key={c.id} c={c} delay={i * 50} />
          ))
        )}
      </div>
    </div>
  );
}

function SummaryPill({ label, value, tone }: { label: string; value: number; tone: "primary" | "danger" | "warning" | "success" }) {
  const cls = {
    primary: "from-primary/20 to-accent/10",
    danger: "from-destructive/25 to-destructive/5",
    warning: "from-warning/25 to-warning/5",
    success: "from-success/25 to-success/5",
  }[tone];
  return (
    <div className={cn("rounded-2xl border border-border bg-gradient-to-br p-4", cls)}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function ChurnCard({ c, delay }: { c: any; delay: number }) {
  const tone = c.score >= 80 ? "danger" : c.score >= 50 ? "warning" : "success";
  const actionIcon = c.action.includes("Cashback") ? Gift
    : c.action.includes("VIP") ? Crown
    : c.action.includes("Discount") ? Percent
    : HeartHandshake;
  const Icon = actionIcon;
  return (
    <GlassCard hover className="animate-slide-up" >
      <div style={{ animationDelay: `${delay}ms` }} className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={c.name} className="h-12 w-12" />
          <div>
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.plan} · Last active {c.lastActive}</div>
          </div>
        </div>
        <ScoreRing value={c.score} size={76} tone={tone} />
      </div>
      <div className="mt-4 rounded-xl border border-border/60 bg-white/[0.03] p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reason</div>
        <div className="mt-0.5 text-sm">{c.reason}</div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Suggestion
        </div>
        <Button
          size="sm"
          className="gradient-brand shadow-glow"
          onClick={() => toast.success(`${c.action} sent to ${c.name.split(" ")[0]}`)}
        >
          <Icon className="mr-1.5 h-3.5 w-3.5" />
          {c.action}
        </Button>
      </div>
    </GlassCard>
  );
}
