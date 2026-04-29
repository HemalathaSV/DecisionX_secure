import { createFileRoute } from "@tanstack/react-router";
import { LogIn, ArrowRightLeft, ShieldAlert, KeyRound, Smartphone, MapPin, Calendar, Sparkles } from "lucide-react";
import { GlassCard, ScoreRing, Avatar } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { safeGetDocs } from "@/lib/db-service";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customer-360")({
  head: () => ({
    meta: [
      { title: "Customer 360 — SecureAI" },
      { name: "description", content: "Unified customer profile with trust, fraud and churn scores plus explainable AI decisions." },
      { property: "og:title", content: "Customer 360 — SecureAI" },
      { property: "og:description", content: "Unified customer profile with explainable AI." },
    ],
  }),
  component: Customer360Page,
});

const TIMELINE = [
  { icon: LogIn, title: "Logged in from Bangalore", meta: "10:42 AM · IP 103.22.x.x", tone: "info" },
  { icon: ArrowRightLeft, title: "Attempted ₹45,000 transfer", meta: "10:44 AM · Payee: new beneficiary", tone: "warning" },
  { icon: KeyRound, title: "OTP failed twice", meta: "10:45 AM · Wrong OTP x2", tone: "danger" },
  { icon: ShieldAlert, title: "Risk engine triggered MFA", meta: "10:46 AM · Rule: DEV_NEW + OTP_FAIL", tone: "primary" },
] as const;

const EXPLAIN = [
  { label: "New Device", weight: 28 },
  { label: "High Transaction Amount", weight: 22 },
  { label: "Failed OTP Attempts", weight: 19 },
  { label: "Location Anomaly", weight: 8 },
  { label: "Velocity (txn/min)", weight: 5 },
];

function Customer360Page() {
  const [customer, setCustomer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const custs = await safeGetDocs("customers");
      const frauds = await safeGetDocs("fraud_alerts");
      
      const targetId = localStorage.getItem("selected_customer_id");
      const targetName = localStorage.getItem("selected_customer_name");
      
      let matchedCust = custs.find((c: any) => c.id === targetId);
      
      // Fallback: If search triggered a custom customer not in the randomly generated DB
      if (!matchedCust && targetId && targetName) {
        matchedCust = {
          ...custs[0], 
          id: targetId, 
          name: targetName,
          tier: "Premium",
          city: "New Delhi",
          trustScore: 92
        };
      }
      
      // Final fallback to the first one in the DB
      if (!matchedCust && custs.length > 0) {
        matchedCust = custs[0];
      }

      if (matchedCust) {
        setCustomer(matchedCust);
        setTransactions(frauds.filter((f: any) => f.customer === matchedCust.name).slice(0, 5));
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading Customer 360...</div>;
  if (!customer) return <div className="py-12 text-center text-muted-foreground">No customer data. Generate in Dataset Manager.</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Unified Customer Profile</div>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">Customer 360</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything the AI knows — in one explainable view.</p>
      </div>

      {/* Header card */}
      <GlassCard>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={customer.name} className="h-16 w-16 text-lg" />
            <div>
              <div className="text-xl font-semibold">{customer.name}</div>
              <div className="text-xs text-muted-foreground">Customer ID · {customer.id} · Tier: {customer.tier}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                <Chip icon={MapPin} text={customer.city} />
                <Chip icon={Calendar} text={`Last login: ${customer.lastLogin || 'Today'}`} />
                <Chip icon={Smartphone} text="Verified Device" tone="warning" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-around gap-6 lg:gap-10">
            <ScoreRing value={customer.trustScore} label="Trust" tone="success" />
            <ScoreRing value={12} label="Fraud" tone="danger" />
            <ScoreRing value={24} label="Churn" tone="warning" />
          </div>
        </div>
      </GlassCard>

      <div className="flex border-b border-border">
        {["Profile", "Transactions", "Risk History", "Recommendations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              "px-4 py-2 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.toLowerCase() ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-3", activeTab !== "profile" && "hidden")}>
        {/* Timeline */}
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Recent Activity</div>
              <div className="text-xs text-muted-foreground">Session-scoped event timeline</div>
            </div>
          </div>
          <div className="relative pl-4">
            <div className="absolute bottom-2 left-[18px] top-2 w-px bg-border" />
            <div className="space-y-4">
              {TIMELINE.map((e, i) => {
                const Icon = e.icon;
                return (
                  <div key={i} className="relative flex gap-4 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className={cn(
                      "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border",
                      e.tone === "info" && "bg-info/15 text-info",
                      e.tone === "warning" && "bg-warning/15 text-warning",
                      e.tone === "danger" && "bg-destructive/15 text-destructive animate-pulse-ring",
                      e.tone === "primary" && "bg-primary/15 text-primary",
                    )}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 rounded-xl border border-border/60 bg-white/[0.02] p-3">
                      <div className="text-sm font-medium">{e.title}</div>
                      <div className="text-xs text-muted-foreground">{e.meta}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* AI Recommendation panel */}
        <GlassCard className="lg:sticky lg:top-20 h-fit">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
          </div>
          <div className="mt-2 text-2xl font-bold">Ask MFA Verification</div>
          <div className="mt-1 text-xs text-muted-foreground">Confidence 87% · Based on 4 signals</div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => toast.success("Allowed")}>Allow</Button>
            <Button className="gradient-brand" onClick={() => toast.message("MFA challenge sent")}>Ask MFA</Button>
            <Button variant="outline" onClick={() => toast.error("Blocked")}>Block</Button>
            <Button variant="outline" onClick={() => toast.success("Cashback offered")}>Offer Cashback</Button>
          </div>
          <div className="mt-5 rounded-xl border border-border/60 bg-white/[0.03] p-3 text-xs text-muted-foreground">
            Outcome is logged, reviewable, and feeds back into the SecureAI model daily.
          </div>
        </GlassCard>
      </div>

      {activeTab === "transactions" && (
        <GlassCard>
          <h2 className="font-semibold mb-4 text-lg">Transaction History</h2>
          {transactions.length === 0 ? <p className="text-muted-foreground">No recent transactions flagged.</p> : (
            <div className="space-y-2">
              {transactions.map(t => (
                <div key={t.id} className="p-3 border border-border/50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-medium">₹{t.amount}</div>
                    <div className="text-xs text-muted-foreground">{t.device} · {t.city} · {t.timestamp || "Just now"}</div>
                  </div>
                  <div className={cn("text-xs px-2 py-1 rounded-lg", t.status === "blocked" ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success")}>
                    {t.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Explainable AI */}
      <GlassCard className={cn(activeTab !== "recommendations" && activeTab !== "risk history" && "hidden")}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Explainable AI · Decision Breakdown</div>
            <div className="text-xs text-muted-foreground">Feature contribution to the current risk score</div>
          </div>
          <span className="rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs">Model v2.4 · SHAP-based</span>
        </div>
        <div className="space-y-3">
          {EXPLAIN.map((e, i) => (
            <div key={e.label} className="grid grid-cols-12 items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="col-span-4 truncate text-sm">{e.label}</div>
              <div className="col-span-7">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, e.weight * 3)}%`,
                      background: "linear-gradient(90deg, oklch(0.65 0.22 275), oklch(0.62 0.24 310))",
                    }}
                  />
                </div>
              </div>
              <div className="col-span-1 text-right text-sm font-semibold tabular-nums">+{e.weight}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function Chip({ icon: Icon, text, tone }: { icon: React.ComponentType<{ className?: string }>; text: string; tone?: "warning" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5",
      tone === "warning" ? "border-warning/30 bg-warning/10 text-warning" : "border-border bg-white/[0.03] text-muted-foreground"
    )}>
      <Icon className="h-3 w-3" /> {text}
    </span>
  );
}
