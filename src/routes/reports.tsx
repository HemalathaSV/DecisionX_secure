import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Calendar } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { GlassCard } from "@/components/primitives";
import { MONTHLY_SAVINGS, RETENTION_SUCCESS, FALSE_POSITIVE } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — TrustGuard AI" },
      { name: "description", content: "Monthly performance reports: fraud prevented, revenue saved, retention success and false positive reduction." },
      { property: "og:title", content: "Reports — TrustGuard AI" },
      { property: "og:description", content: "Analytics reports with exportable insights." },
    ],
  }),
  component: ReportsPage,
});

const tooltipStyle = {
  background: "oklch(0.2 0.035 270)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
} as const;

const FRAUD_MONTHLY = MONTHLY_SAVINGS.map((m, i) => ({ month: m.month, prevented: 20 + i * 3 + Math.round(Math.random() * 10) }));

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Analytics</div>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Executive-ready snapshots of TrustGuard AI performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Calendar className="h-4 w-4" /> Last 12 months
          </button>
          <Button className="gradient-brand shadow-glow" onClick={() => toast.success("Report export queued · PDF")}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader title="Monthly Fraud Prevented" subtitle="Count of blocked attempts" trailing="+38% YoY" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FRAUD_MONTHLY}>
                <defs>
                  <linearGradient id="rf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.24 20)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 330)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "oklch(1 0 0 / 0.04)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="prevented" fill="url(#rf)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Revenue Saved" subtitle="₹ in Lakhs" trailing="₹1.3Cr+" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SAVINGS}>
                <defs>
                  <linearGradient id="rs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="saved" stroke="oklch(0.65 0.22 275)" strokeWidth={2} fill="url(#rs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Customer Retention Success" subtitle="Customers saved by retention actions" trailing="Target 80" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RETENTION_SUCCESS}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={80} stroke="oklch(0.78 0.18 85)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="saved" stroke="oklch(0.72 0.2 170)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.72 0.2 170)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title="False Positive Reduction" subtitle="% false alarms over time" trailing="-68%" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FALSE_POSITIVE}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke="oklch(0.7 0.2 230)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.7 0.2 230)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-3 text-sm font-semibold">Saved Reports</div>
        <div className="divide-y divide-border/60">
          {[
            { name: "Q3 Risk & Fraud Summary", date: "Oct 2025", size: "1.2 MB" },
            { name: "Retention Playbook — Sep", date: "Sep 2025", size: "860 KB" },
            { name: "Monthly Executive Brief", date: "Aug 2025", size: "2.4 MB" },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.date} · {r.size}</div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success(`Downloading ${r.name}`)}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function CardHeader({ title, subtitle, trailing }: { title: string; subtitle: string; trailing?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      {trailing && <span className="rounded-full border border-border bg-white/[0.03] px-2.5 py-1 text-xs font-medium">{trailing}</span>}
    </div>
  );
}
