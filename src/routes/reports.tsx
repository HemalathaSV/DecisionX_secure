import { createFileRoute } from '@tanstack/react-router';
import { useState } from "react";
import { Download, FileText, Calendar, Filter } from "lucide-react";
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
  const [filter, setFilter] = useState("12_months");

  const getFilteredData = (data: any[], count: number) => {
    return data.slice(Math.max(data.length - count, 0));
  };

  const currentFraud = filter === "3_months" ? getFilteredData(FRAUD_MONTHLY, 3) : filter === "6_months" ? getFilteredData(FRAUD_MONTHLY, 6) : FRAUD_MONTHLY;
  const currentSavings = filter === "3_months" ? getFilteredData(MONTHLY_SAVINGS, 3) : filter === "6_months" ? getFilteredData(MONTHLY_SAVINGS, 6) : MONTHLY_SAVINGS;
  const currentRetention = filter === "3_months" ? getFilteredData(RETENTION_SUCCESS, 3) : filter === "6_months" ? getFilteredData(RETENTION_SUCCESS, 6) : RETENTION_SUCCESS;
  const currentFP = filter === "3_months" ? getFilteredData(FALSE_POSITIVE, 3) : filter === "6_months" ? getFilteredData(FALSE_POSITIVE, 6) : FALSE_POSITIVE;

  const handleExportCSV = () => {
    const csv = currentFraud.map((d, i) => `${d.month},${d.prevented},${currentSavings[i]?.saved},${currentRetention[i]?.saved},${currentFP[i]?.rate}`).join("\\n");
    const header = "Month,Fraud_Prevented,Savings,Retention,FalsePositives\\n";
    downloadFile("report.csv", header + csv);
    toast.success("CSV Downloaded");
  };

  const handleExportPDF = () => {
    toast.success("PDF Downloaded (simulated)");
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Analytics</div>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Executive-ready snapshots of TrustGuard AI performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-border bg-white/[0.03] px-3.5 py-2 text-sm text-foreground focus:outline-none"
          >
            <option value="12_months">Last 12 months</option>
            <option value="6_months">Last 6 months</option>
            <option value="3_months">Last 3 months</option>
          </select>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="gradient-brand shadow-glow gap-2" onClick={handleExportPDF}>
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader title="Monthly Fraud Prevented" subtitle="Count of blocked attempts" trailing="+38% YoY" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentFraud}>
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
              <AreaChart data={currentSavings}>
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
              <LineChart data={currentRetention}>
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
              <LineChart data={currentFP}>
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
              <Button size="sm" variant="outline" onClick={() => downloadFile(`${r.name}.csv`, "Simulated data")}>
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
