import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Gift, Crown, Percent, HeartHandshake, X, CheckCircle2 } from "lucide-react";
import { GlassCard, ScoreRing, Avatar } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

const STATIC_CUSTOMERS = [
  { id: "1", name: "Ananya Bose", plan: "Pro Plan", lastActive: "2 days ago", score: 99, reason: "Multiple support tickets unresolved", action: "Cashback Offer" },
  { id: "2", name: "Arjun Reddy", plan: "Enterprise", lastActive: "1 week ago", score: 95, reason: "Usage dropped by 80%", action: "Engagement Nudge" },
  { id: "3", name: "Divya Gupta", plan: "Basic Plan", lastActive: "3 days ago", score: 91, reason: "Failed payment", action: "Discount Plan" },
  { id: "4", name: "Neha Sharma", plan: "Pro Plan", lastActive: "Yesterday", score: 88, reason: "Competitor mention in chat", action: "VIP Support" },
  { id: "5", name: "Rahul Verma", plan: "Enterprise", lastActive: "5 days ago", score: 84, reason: "Contract expiring soon", action: "Loyalty Upgrade" },
  { id: "6", name: "Amit Kumar", plan: "Basic Plan", lastActive: "2 weeks ago", score: 80, reason: "Low engagement", action: "Engagement Nudge" },
  { id: "7", name: "Priya Singh", plan: "Pro Plan", lastActive: "1 day ago", score: 75, reason: "Feature requests ignored", action: "VIP Support" },
  { id: "8", name: "Vikram Shah", plan: "Enterprise", lastActive: "Today", score: 71, reason: "Price sensitivity", action: "Discount Plan" },
  { id: "9", name: "Riya Patel", plan: "Pro Plan", lastActive: "3 weeks ago", score: 60, reason: "Inactive", action: "Engagement Nudge" },
  { id: "10", name: "Sanjay Das", plan: "Basic Plan", lastActive: "Yesterday", score: 50, reason: "Occasional usage", action: "Loyalty Upgrade" },
  { id: "11", name: "Kiran Rao", plan: "Enterprise", lastActive: "Today", score: 44, reason: "Stable", action: "Loyalty Upgrade" },
  { id: "12", name: "Rohan Nair", plan: "Pro Plan", lastActive: "Today", score: 33, reason: "High engagement", action: "Cashback Offer" },
  { id: "13", name: "Meera Joshi", plan: "Enterprise", lastActive: "Today", score: 12, reason: "Brand advocate", action: "Loyalty Upgrade" }
];

function ChurnRiskPage() {
  const [sortKey, setSortKey] = useState<"score" | "name">("score");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const customers = STATIC_CUSTOMERS;

  const sorted = useMemo(() => {
    const copy = [...customers];
    if (sortKey === "score") {
      copy.sort((a, b) => sortDir === "desc" ? b.score - a.score : a.score - b.score);
    } else {
      copy.sort((a, b) => sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    }
    return copy;
  }, [customers, sortKey, sortDir]);

  const handleSort = (key: "score" | "name") => {
    if (sortKey === key) {
      const newDir = sortDir === "asc" ? "desc" : "asc";
      setSortDir(newDir);
      
      if (key === "score") toast.success(newDir === "desc" ? "Sorted by Highest Churn" : "Sorted by Lowest Churn");
      if (key === "name") toast.success(newDir === "asc" ? "Sorted A-Z" : "Sorted Z-A");
    } else {
      setSortKey(key);
      const newDir = key === "score" ? "desc" : "asc";
      setSortDir(newDir);
      
      if (key === "score") toast.success("Sorted by Highest Churn");
      if (key === "name") toast.success("Sorted A-Z");
    }
  };

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
            <button
              onClick={() => handleSort("score")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                sortKey === "score" ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-white/[0.03] text-muted-foreground hover:bg-white/[0.05]"
              )}
            >
              Sort: Churn Score {sortKey === "score" ? (sortDir === "desc" ? "↓" : "↑") : "↓"}
            </button>
            <button
              onClick={() => handleSort("name")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                sortKey === "name" ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-white/[0.03] text-muted-foreground hover:bg-white/[0.05]"
              )}
            >
              Sort: Name {sortKey === "name" ? (sortDir === "asc" ? "A-Z" : "Z-A") : "A-Z"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((c) => (
          <ChurnCard key={c.id} c={c} />
        ))}
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

const ACTION_MAP = {
  "Cashback Offer": { title: "Cashback Sent", message: "Retention cashback offer successfully sent to this customer." },
  "Engagement Nudge": { title: "Engagement Triggered", message: "Email / push notification reminder has been sent." },
  "Discount Plan": { title: "Discount Activated", message: "Special discount plan has been offered." },
  "VIP Support": { title: "VIP Support Assigned", message: "Priority customer support assigned." },
  "Loyalty Upgrade": { title: "Loyalty Benefits Upgraded", message: "Customer tier upgraded successfully." }
} as Record<string, { title: string; message: string }>;

function ChurnCard({ c }: { c: any }) {
  const tone = c.score >= 80 ? "danger" : c.score >= 50 ? "warning" : "success";
  const actionIcon = c.action.includes("Cashback") ? Gift
    : c.action.includes("VIP") ? Crown
    : c.action.includes("Discount") ? Percent
    : HeartHandshake;
  const Icon = actionIcon;

  const [isActionSent, setIsActionSent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAction = () => {
    setIsActionSent(true);
    setIsDisabled(true);
    setModalOpen(true);
    toast.success("Action Sent Successfully");
    
    setTimeout(() => {
      setIsDisabled(false);
    }, 3000);
  };

  return (
    <>
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <GlassCard hover className="h-full" >
          <div className="flex items-start justify-between gap-4">
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
              disabled={isDisabled}
              className={cn(
                "shadow-glow transition-all",
                isActionSent 
                  ? "bg-success/20 text-success hover:bg-success/30 border border-success/30" 
                  : "gradient-brand"
              )}
              onClick={handleAction}
            >
              {isActionSent ? (
                <>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Action Sent
                </>
              ) : (
                <>
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  {c.action}
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {modalOpen && (
        <PremiumActionModal 
          action={c.action} 
          customerName={c.name} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </>
  );
}

function PremiumActionModal({ action, customerName, onClose }: { action: string; customerName: string; onClose: () => void }) {
  const content = ACTION_MAP[action] || { title: "Action Successful", message: "Customer action has been completed." };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm glass-strong rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success shadow-[0_0_30px_oklch(0.6_0.2_140/0.3)]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground mb-1">{content.title}</h2>
        <div className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-primary mb-4">
          {customerName}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content.message}
        </p>
        
        <Button 
          className="mt-6 w-full gradient-brand shadow-glow" 
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
