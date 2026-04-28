import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, Filter, MapPin, Smartphone, ShieldCheck, ShieldAlert, Key } from "lucide-react";
import { GlassCard, StatusBadge } from "@/components/primitives";
import { formatINRFull, type Severity } from "@/lib/mock-data";
import { safeGetDocs, safeSetDoc } from "@/lib/db-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fraud-alerts")({
  head: () => ({
    meta: [
      { title: "Fraud Alerts — TrustGuard AI" },
      { name: "description", content: "Review, filter and act on real-time fraud alerts flagged by the TrustGuard risk engine." },
      { property: "og:title", content: "Fraud Alerts — TrustGuard AI" },
      { property: "og:description", content: "Real-time fraud alert review and action center." },
    ],
  }),
  component: FraudAlertsPage,
});

type Filter = "today" | "high" | "blocked" | "all";

function FraudAlertsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await safeGetDocs("fraud_alerts");
      setAlerts(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleAction = async (id: string, actionStr: string, status: string) => {
    const alertList = [...alerts];
    const index = alertList.findIndex(a => a.id === id);
    if (index >= 0) {
      alertList[index] = { ...alertList[index], action: actionStr, status };
      setAlerts(alertList);
      toast.success(`Action applied: ${actionStr}`);
      await safeSetDoc("fraud_alerts", id, alertList[index]);
    }
  };

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (filter === "high" && a.fraudScore < 70) return false;
      if (filter === "blocked" && a.status !== "blocked") return false;
      if (filter === "today" && a.timestamp.includes("h") && parseInt(a.timestamp) > 3) return false;
      if (query && !`${a.customer} ${a.city} ${a.reason}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query, alerts]);

  const counts = {
    today: alerts.filter((a) => !a.timestamp.includes("h") || parseInt(a.timestamp) <= 3).length,
    high: alerts.filter((a) => a.fraudScore >= 70).length,
    blocked: alerts.filter((a) => a.status === "blocked").length,
    all: alerts.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Operations</div>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">Fraud Alerts</h1>
        <p className="mt-1 text-sm text-muted-foreground">All flagged transactions with explainable AI reasoning.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["today","high","blocked","all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all",
                filter === f
                  ? "border-transparent gradient-brand text-primary-foreground shadow-glow"
                  : "border-border bg-white/[0.03] text-muted-foreground hover:text-foreground"
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              {f === "today" ? "Today" : f === "high" ? "High Risk" : f === "blocked" ? "Blocked" : "All"}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", filter === f ? "bg-black/20" : "bg-white/10")}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer, city, reason…"
            className="h-10 w-full rounded-xl border border-border bg-white/[0.03] pl-10 pr-4 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Device</th>
                <th className="px-5 py-3 font-medium">Fraud Score</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
              {loading && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">Loading alerts...</td></tr>
              )}
              {!loading && filtered.map((a, i) => (
                <tr key={a.id} className="border-b border-border/50 transition-colors hover:bg-white/[0.03]" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-5 py-4">
                    <div className="font-medium">{a.customer}</div>
                    <div className="text-xs text-muted-foreground">{a.timestamp || 'Just now'}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{formatINRFull(a.amount)}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {a.city}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
                      a.device === "Trusted" && "border-success/30 bg-success/10 text-success",
                      a.device === "New Device" && "border-warning/30 bg-warning/10 text-warning",
                      a.device === "Suspicious" && "border-destructive/30 bg-destructive/10 text-destructive",
                    )}>
                      <Smartphone className="h-3 w-3" /> {a.device}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ScoreBar value={a.fraudScore} />
                  </td>
                  <td className="px-5 py-4 max-w-[220px] text-muted-foreground">{a.reason}</td>
                  <td className="px-5 py-4 min-w-[200px]">
                    <div className="flex gap-1.5">
                      <button onClick={() => handleAction(a.id, "Allow", "safe")} className="p-1.5 rounded-md hover:bg-success/20 text-success transition-colors" title="Allow"><ShieldCheck className="w-4 h-4" /></button>
                      <button onClick={() => handleAction(a.id, "Ask MFA", "mfa")} className="p-1.5 rounded-md hover:bg-warning/20 text-warning transition-colors" title="Ask MFA"><Key className="w-4 h-4" /></button>
                      <button onClick={() => handleAction(a.id, "Block", "blocked")} className="p-1.5 rounded-md hover:bg-destructive/20 text-destructive transition-colors" title="Block"><ShieldAlert className="w-4 h-4" /></button>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={a.status as Severity} /></td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No alerts match your filters.</td></tr>
              )}
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>Showing <span className="text-foreground font-medium">{filtered.length}</span> alerts</span>
          <span>Updated just now</span>
        </div>
      </GlassCard>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  const tone = value >= 70 ? "destructive" : value >= 40 ? "warning" : "success";
  const color = {
    destructive: "oklch(0.62 0.24 20)",
    warning: "oklch(0.78 0.18 85)",
    success: "oklch(0.72 0.2 170)",
  }[tone];
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, oklch(0.65 0.22 275))` }} />
      </div>
      <span className="tabular-nums text-xs font-semibold">{value}%</span>
    </div>
  );
}
