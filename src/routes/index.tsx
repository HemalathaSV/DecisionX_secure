import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, ShieldAlert, UserMinus, Wallet, Gauge,
  TrendingUp, TrendingDown, Zap, AlertTriangle, CheckCircle2, Info, X, PlayCircle,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { GlassCard, AnimatedCounter, ScoreRing } from "@/components/primitives";
import {
  FRAUD_TREND, CHURN_DISTRIBUTION, MONTHLY_SAVINGS, RISK_HEATMAP, LIVE_ALERT_POOL, formatINR,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AskMFAModal } from "@/components/ask-mfa-modal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SecureAI" },
      { name: "description", content: "Real-time fraud, churn and trust analytics across your customer base." },
      { property: "og:title", content: "Dashboard — SecureAI" },
      { property: "og:description", content: "Real-time fraud, churn and trust analytics." },
    ],
  }),
  component: Dashboard,
});

const KPIS = [
  { label: "Transactions Today", value: 18432, prefix: "", suffix: "", delta: 12.4, icon: Activity, tone: "primary" as const },
  { label: "Fraud Prevented", value: 247, delta: 8.2, icon: ShieldAlert, tone: "danger" as const },
  { label: "Customers at Churn Risk", value: 89, delta: -4.1, icon: UserMinus, tone: "warning" as const },
  { label: "Revenue Saved", value: 180, prefix: "₹", suffix: "L", delta: 22.7, icon: Wallet, tone: "success" as const },
  { label: "Avg Trust Score", value: 78, suffix: "/100", delta: 2.3, icon: Gauge, tone: "primary" as const },
];

const toneMap = {
  primary: "from-primary/30 to-accent/20 text-primary",
  danger: "from-destructive/30 to-destructive/10 text-destructive",
  warning: "from-warning/30 to-warning/10 text-warning",
  success: "from-success/30 to-success/10 text-success",
};

function Dashboard() {
  const [simOpen, setSimOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Overview</div>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">
            Welcome back, <span className="gradient-text">Admin</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening across your risk and trust signals today.</p>
        </div>
        <Button
          size="lg"
          onClick={() => setSimOpen(true)}
          className="gradient-brand shadow-glow hover:opacity-95"
        >
          <PlayCircle className="mr-2 h-4 w-4" /> Run Demo Simulation
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPIS.map((k, i) => {
          const Icon = k.icon;
          const up = k.delta >= 0;
          return (
            <GlassCard key={k.label} hover className="animate-slide-up" >
              <div style={{ animationDelay: `${i * 60}ms` }} className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
                    toneMap[k.tone]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                    up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  )}
                >
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(k.delta)}%
                </span>
              </div>
              <div className="mt-5 text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className="mt-1 text-2xl font-semibold">
                <AnimatedCounter value={k.value} prefix={k.prefix} suffix={k.suffix} />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Fraud Trend</div>
              <div className="text-xs text-muted-foreground">Attempts vs Prevented · last 30 days</div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs">
              <Zap className="h-3 w-3 text-primary" /> Live
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FRAUD_TREND}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.2 170)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.72 0.2 170)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.2 0.035 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "oklch(0.98 0.005 250)" }}
                />
                <Area type="monotone" dataKey="attempts" stroke="oklch(0.65 0.22 275)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="prevented" stroke="oklch(0.72 0.2 170)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-sm font-semibold">Churn Distribution</div>
            <div className="text-xs text-muted-foreground">Segmented by risk band</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHURN_DISTRIBUTION} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={4} stroke="none">
                  {CHURN_DISTRIBUTION.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.2 0.035 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {CHURN_DISTRIBUTION.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Monthly Revenue Saved</div>
              <div className="text-xs text-muted-foreground">In ₹ Lakhs · trailing 12 months</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold gradient-text">₹1.3Cr+</div>
              <div className="text-[11px] text-muted-foreground">YTD savings</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SAVINGS}>
                <defs>
                  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.22 300)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 260)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
                  contentStyle={{ background: "oklch(0.2 0.035 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="saved" fill="url(#gb)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-sm font-semibold">Risk Heatmap</div>
            <div className="text-xs text-muted-foreground">Day × hour-band intensity</div>
          </div>
          <Heatmap />
        </GlassCard>
      </div>

      {/* Live alerts */}
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Live Alerts</div>
            <div className="text-xs text-muted-foreground">Streaming from risk engine</div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Streaming
          </span>
        </div>
        <LiveAlerts />
      </GlassCard>

      {simOpen && <SimulationModal onClose={() => setSimOpen(false)} />}
    </div>
  );
}

function Heatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 12 }, (_, i) => i * 2);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[360px]">
        <div className="flex gap-1 pl-10 text-[10px] text-muted-foreground">
          {hours.map((h) => (
            <div key={h} className="w-5 text-center">{h}</div>
          ))}
        </div>
        {days.map((d) => (
          <div key={d} className="mt-1 flex items-center gap-1">
            <div className="w-10 text-[10px] text-muted-foreground">{d}</div>
            {hours.map((h) => {
              const cell = RISK_HEATMAP.find((c) => c.day === d && c.hour === h);
              const v = cell?.intensity ?? 0;
              const alpha = Math.min(1, v / 100);
              return (
                <div
                  key={h}
                  className="h-5 w-5 rounded-[5px] transition-transform hover:scale-125"
                  style={{ background: `oklch(0.65 0.22 ${265 + alpha * 45} / ${0.12 + alpha * 0.85})` }}
                  title={`${d} ${h}:00 — ${v}`}
                />
              );
            })}
          </div>
        ))}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Low</span>
          <div className="h-1.5 w-24 rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.65 0.22 265 / 0.15), oklch(0.62 0.24 310))" }} />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

function LiveAlerts() {
  const [items, setItems] = useState(() =>
    LIVE_ALERT_POOL.slice(0, 4).map((a, i) => ({ ...a, id: `${Date.now()}-${i}` }))
  );

  // rotate every 6s
  useState(() => {
    if (typeof window === "undefined") return;
    const iv = setInterval(() => {
      setItems((prev) => {
        const pick = LIVE_ALERT_POOL[Math.floor(Math.random() * LIVE_ALERT_POOL.length)];
        return [{ ...pick, id: `${Date.now()}` }, ...prev].slice(0, 5);
      });
    }, 6000);
    return () => clearInterval(iv);
  });

  const iconFor = (t: string) => {
    if (t === "danger") return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (t === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />;
    if (t === "success") return <CheckCircle2 className="h-4 w-4 text-success" />;
    return <Info className="h-4 w-4 text-info" />;
  };

  return (
    <div className="space-y-2">
      {items.map((a) => (
        <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] px-4 py-3 animate-slide-up">
          <span className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            a.type === "danger" && "bg-destructive/15 animate-pulse-ring",
            a.type === "warning" && "bg-warning/15",
            a.type === "success" && "bg-success/15",
            a.type === "info" && "bg-info/15",
          )}>
            {iconFor(a.type)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm"><span className="font-semibold">{a.name}</span> <span className="text-muted-foreground">{a.text}</span></div>
            <div className="text-[11px] text-muted-foreground">Just now · risk-engine</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SimulationModal({ onClose }: { onClose: () => void }) {
  const [mfaOpen, setMfaOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-strong rounded-3xl p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-destructive">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" /> Simulation · Suspicious Transaction
        </div>
        <div className="mt-2 text-2xl font-bold">{formatINR(95000)} from new device</div>
        <div className="text-sm text-muted-foreground">Customer: Rahul Sharma · Mumbai · New Device</div>

        <div className="mt-6 flex items-center gap-6">
          <ScoreRing value={91} label="Fraud Risk" tone="danger" size={130} />
          <div className="flex-1 space-y-2">
            <Row label="Device" value="Unseen fingerprint" tone="danger" />
            <Row label="OTP" value="2 failed attempts" tone="danger" />
            <Row label="Amount" value="3.2× customer avg" tone="warning" />
            <Row label="Location" value="Mumbai (match)" tone="success" />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <div className="text-xs uppercase tracking-wider text-destructive">AI Recommended Action</div>
          <div className="mt-1 text-lg font-semibold">Block Transaction</div>
          <div className="text-xs text-muted-foreground">Confidence 96% · Based on 4 explainable signals</div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => { toast.success("Transaction allowed"); onClose(); }}>Allow</Button>
          <Button variant="outline" onClick={() => setMfaOpen(true)}>Ask MFA</Button>
          <Button className="gradient-brand" onClick={() => { toast.error("Transaction blocked"); onClose(); }}>Block</Button>
        </div>
      </div>
      {mfaOpen && (
        <AskMFAModal
          customerName="Rahul Sharma"
          onClose={() => setMfaOpen(false)}
          onSuccess={() => {
            // Update decision to allowed
            toast.success("Transaction allowed");
            onClose();
          }}
          onBlocked={() => {
            // Update decision to blocked
            toast.error("Transaction blocked");
            onClose();
          }}
        />
      )}
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: "danger" | "warning" | "success" }) {
  const cls = {
    danger: "text-destructive bg-destructive/10",
    warning: "text-warning bg-warning/10",
    success: "text-success bg-success/10",
  }[tone];
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", cls)}>{value}</span>
    </div>
  );
}
