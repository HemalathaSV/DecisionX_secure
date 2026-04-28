import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Database, Download, RefreshCw, Upload, Users, ShieldAlert, TrendingDown, CheckCircle2 } from "lucide-react";
import { initializeFakeDatasets, safeGetDocs } from "@/lib/db-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/dataset-manager")({
  component: DatasetManagerPage,
});

function DatasetManagerPage() {
  const [activeTab, setActiveTab] = useState<"customers" | "fraud" | "churn">("customers");
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any>({ customers: [], fraud: [], churn: [] });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const customers = await safeGetDocs("customers");
      const fraud = await safeGetDocs("fraud_alerts");
      const churn = await safeGetDocs("churn_users");
      setData({ customers, fraud, churn });
    } catch(e) {
      toast.error("Failed to load dataset");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Generating realistic datasets...");
    try {
      const res = await initializeFakeDatasets();
      await loadData();
      if (res.localOnly) {
        toast.success("Datasets saved locally (Firebase config pending).");
      } else {
        toast.success("Datasets saved to Firebase Firestore!");
      }
    } catch (e) {
      toast.error("Failed to generate data.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    if (activeTab === "customers") {
      const csv = "ID,Name,City,Tier,TrustScore,LoyaltyDays\n" + data.customers.map((c:any) => `${c.id},${c.name},${c.city},${c.tier},${c.trustScore},${c.loyaltyDays}`).join("\n");
      downloadCSV("customers_export.csv", csv);
    } else if (activeTab === "fraud") {
      const csv = "ID,Customer,Amount,City,Device,FraudScore,Action\n" + data.fraud.map((f:any) => `${f.id},${f.customer},${f.amount},${f.city},${f.device},${f.fraudScore},${f.action}`).join("\n");
      downloadCSV("fraud_export.csv", csv);
    } else {
      const csv = "ID,Name,Score,Reason,Action\n" + data.churn.map((c:any) => `${c.id},${c.name},${c.score},${c.reason},${c.action}`).join("\n");
      downloadCSV("churn_export.csv", csv);
    }
    toast.success(`${activeTab} CSV downloaded`);
  };

  const TABS = [
    { id: "customers", label: "Customers", icon: Users, count: data.customers.length },
    { id: "fraud", label: "Fraud Transactions", icon: ShieldAlert, count: data.fraud.length },
    { id: "churn", label: "Churn Users", icon: TrendingDown, count: data.churn.length },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dataset Manager</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create, manage, and export AI datasets to Firebase.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.02] px-4 py-2 text-sm font-medium hover:bg-white/[0.05] transition-colors"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            <Database className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Fake Data"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-border">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className="ml-1.5 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => toast.info("CSV Upload simulated successfully")}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-white/[0.05]"
          >
            <Upload className="h-3 w-3" /> Upload CSV
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-white/[0.05]"
          >
            <Download className="h-3 w-3" /> Download CSV
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "customers" && (
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Customer ID</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">City</th>
                    <th className="px-6 py-3 font-medium">Tier</th>
                    <th className="px-6 py-3 font-medium">Trust Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.customers.slice(0, 50).map((c: any) => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-6 py-3">{c.id}</td>
                      <td className="px-6 py-3 font-medium">{c.name}</td>
                      <td className="px-6 py-3">{c.city}</td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-white/5 px-2 py-1 text-xs border border-white/10">{c.tier}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full bg-primary" style={{ width: `${c.trustScore}%` }} />
                          </div>
                          <span className="text-xs">{c.trustScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.customers.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No data. Generate some!</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "fraud" && (
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Alert ID</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Risk Score</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.fraud.slice(0, 50).map((f: any) => (
                    <tr key={f.id} className="hover:bg-muted/30">
                      <td className="px-6 py-3">{f.id}</td>
                      <td className="px-6 py-3">{f.customer}</td>
                      <td className="px-6 py-3">{formatINR(f.amount)}</td>
                      <td className="px-6 py-3 text-destructive">{f.fraudScore}%</td>
                      <td className="px-6 py-3">{f.action}</td>
                    </tr>
                  ))}
                  {data.fraud.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No data. Generate some!</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "churn" && (
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium">Reason</th>
                    <th className="px-6 py-3 font-medium">Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.churn.slice(0, 50).map((c: any) => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-6 py-3">{c.name}</td>
                      <td className="px-6 py-3 text-warning">{c.score}%</td>
                      <td className="px-6 py-3">{c.reason}</td>
                      <td className="px-6 py-3">{c.action}</td>
                    </tr>
                  ))}
                  {data.churn.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No data. Generate some!</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
