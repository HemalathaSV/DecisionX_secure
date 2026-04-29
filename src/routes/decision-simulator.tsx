import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, ShieldAlert, TrendingDown, RefreshCw, Zap, Clock, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/decision-simulator")({
  component: DecisionSimulator,
});

type SimulationResult = {
  id: string;
  timestamp: string;
  customerName: string;
  amount: number;
  fraudScore: number;
  churnScore: number;
  trustScore: number;
  recommendation: "Allow" | "Ask MFA" | "Block" | "Offer Cashback";
  reasons: string[];
};

function DecisionSimulator() {
  // Form State
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [otpFailures, setOtpFailures] = useState<number | "">("");
  const [inactiveDays, setInactiveDays] = useState<number | "">("");
  const [complaints, setComplaints] = useState<number | "">("");
  const [tier, setTier] = useState("");
  const [fraudHistory, setFraudHistory] = useState("");

  // Result State
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<SimulationResult[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("simulator_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveHistory = (newResult: SimulationResult) => {
    const updated = [newResult, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("simulator_history", JSON.stringify(updated));
  };

  const handleDemo = () => {
    setCustomerName("Rahul Sharma");
    setAmount(95000);
    setCity("Mumbai");
    setDeviceType("New Device");
    setOtpFailures(3);
    setInactiveDays(2);
    setComplaints(0);
    setTier("Gold");
    setFraudHistory("No");
    setResult(null);
    toast.success("Demo scenario loaded successfully");
  };

  const handleReset = () => {
    setCustomerName("");
    setAmount("");
    setCity("");
    setDeviceType("");
    setOtpFailures("");
    setInactiveDays("");
    setComplaints("");
    setTier("");
    setFraudHistory("");
    setResult(null);
    toast.info("Form reset");
  };

  const handleAnalyze = () => {
    if (!customerName || amount === "" || !city || !deviceType || otpFailures === "" || inactiveDays === "" || complaints === "" || !tier || !fraudHistory) {
      toast.error("Please fill all fields before analyzing");
      return;
    }

    let fraudScore = 15; // Base score
    let churnScore = 10;
    let trustScore = 50;
    const reasons: string[] = [];

    const numAmount = Number(amount);
    const numOtp = Number(otpFailures);
    const numInactive = Number(inactiveDays);
    const numComplaints = Number(complaints);

    // Fraud Logic
    if (numAmount > 50000) {
      fraudScore += 35;
      reasons.push("High transaction amount detected (> ₹50,000)");
    }
    if (deviceType === "New Device") {
      fraudScore += 25;
      reasons.push("Login from a new device");
    }
    if (deviceType === "Unknown Device") {
      fraudScore += 40;
      reasons.push("Login from an unknown/untrusted device");
    }
    if (numOtp > 2) {
      fraudScore += 30;
      reasons.push("Multiple failed OTP attempts");
    }
    if (fraudHistory === "Yes") {
      fraudScore += 45;
      reasons.push("Previous history of fraudulent activity");
    }

    // Churn Logic
    if (numInactive > 30) {
      churnScore += 40;
      reasons.push("High number of inactive days");
    }
    if (numComplaints > 2) {
      churnScore += 35;
      reasons.push("Multiple recent complaints");
    }
    if (tier === "Bronze") {
      churnScore += 15;
      reasons.push("Low-tier customer segment");
    }

    // Trust Logic
    if (tier === "Gold" || tier === "Platinum") {
      trustScore += 30;
      reasons.push("Premium customer status");
    }
    if (fraudHistory === "No") {
      trustScore += 20;
    }
    if (numComplaints === 0) {
      trustScore += 10;
    }
    if (deviceType === "Trusted Device") {
      trustScore += 20;
      reasons.push("Using a trusted device");
    }

    // Cap scores
    fraudScore = Math.min(Math.max(fraudScore, 0), 100);
    churnScore = Math.min(Math.max(churnScore, 0), 100);
    trustScore = Math.min(Math.max(trustScore, 0), 100);

    // Recommendation Rules
    let recommendation: SimulationResult["recommendation"] = "Allow";
    if (fraudScore > 80) {
      recommendation = "Block";
    } else if (fraudScore > 55) {
      recommendation = "Ask MFA";
    } else if (churnScore > 75) {
      recommendation = "Offer Cashback";
    }

    const newResult: SimulationResult = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleString(),
      customerName,
      amount: numAmount,
      fraudScore,
      churnScore,
      trustScore,
      recommendation,
      reasons,
    };

    setResult(newResult);
    saveHistory(newResult);
    toast.success("Decision analyzed successfully");
  };

  const getBadgeColor = (rec: string) => {
    switch (rec) {
      case "Allow": return "bg-success/20 text-success border-success/50";
      case "Ask MFA": return "bg-warning/20 text-warning border-warning/50";
      case "Block": return "bg-destructive/20 text-destructive border-destructive/50";
      case "Offer Cashback": return "bg-primary/20 text-primary border-primary/50";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number, type: "fraud" | "churn" | "trust") => {
    if (type === "fraud" || type === "churn") {
      if (score > 70) return "text-destructive";
      if (score > 40) return "text-warning";
      return "text-success";
    } else {
      if (score > 70) return "text-success";
      if (score > 40) return "text-warning";
      return "text-destructive";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          Decision Simulator
        </h1>
        <p className="text-muted-foreground">
          Live AI testing console. Enter customer and transaction details to see dynamic SecureAI decisions instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE: INPUT FORM */}
        <Card className="glass border-border/50 shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl">Simulation Inputs</CardTitle>
            <CardDescription>Configure the scenario parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="space-y-2">
                <Label>Transaction Amount (₹)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value !== "" ? Number(e.target.value) : "")} placeholder="e.g. 95000" />
              </div>
              
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Device Type</Label>
                <Select value={deviceType} onValueChange={setDeviceType}>
                  <SelectTrigger><SelectValue placeholder="Select Device" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trusted Device">Trusted Device</SelectItem>
                    <SelectItem value="New Device">New Device</SelectItem>
                    <SelectItem value="Unknown Device">Unknown Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Failed OTP Attempts</Label>
                <Input type="number" value={otpFailures} onChange={(e) => setOtpFailures(e.target.value !== "" ? Number(e.target.value) : "")} placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label>Inactive Days</Label>
                <Input type="number" value={inactiveDays} onChange={(e) => setInactiveDays(e.target.value !== "" ? Number(e.target.value) : "")} placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label>Complaints Count</Label>
                <Input type="number" value={complaints} onChange={(e) => setComplaints(e.target.value !== "" ? Number(e.target.value) : "")} placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label>Customer Tier</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger><SelectValue placeholder="Select Tier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Previous Fraud History</Label>
                <Select value={fraudHistory} onValueChange={setFraudHistory}>
                  <SelectTrigger><SelectValue placeholder="Select History" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
              <Button onClick={handleAnalyze} className="flex-1 gradient-brand shadow-glow">
                <Zap className="mr-2 h-4 w-4" /> Analyze Decision
              </Button>
              <Button onClick={handleDemo} variant="secondary" className="flex-1">
                <Info className="mr-2 h-4 w-4" /> Load Demo Scenario
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE: OUTPUT PANEL */}
        <div className="space-y-6">
          <Card className="glass border-border/50 shadow-glow overflow-hidden h-full">
            <CardHeader className="bg-white/[0.02] border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Live AI Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!result ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse" />
                    <Zap className="h-12 w-12 text-primary/50 relative z-10" />
                  </div>
                  <p>Run a simulation to see AI intelligence in action</p>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Final Recommendation Badge */}
                  <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-2xl bg-black/20 border border-white/5">
                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Final Recommendation</span>
                    <div className={cn("px-6 py-2 rounded-full border-2 text-xl font-bold flex items-center gap-2", getBadgeColor(result.recommendation))}>
                      {result.recommendation === "Allow" && <ShieldCheck className="h-6 w-6" />}
                      {result.recommendation === "Ask MFA" && <ShieldAlert className="h-6 w-6" />}
                      {result.recommendation === "Block" && <AlertTriangle className="h-6 w-6" />}
                      {result.recommendation === "Offer Cashback" && <TrendingDown className="h-6 w-6" />}
                      {result.recommendation}
                    </div>
                  </div>

                  {/* Scores Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Fraud Score</span>
                      <span className={cn("text-3xl font-bold font-mono", getScoreColor(result.fraudScore, "fraud"))}>
                        {result.fraudScore}%
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Churn Score</span>
                      <span className={cn("text-3xl font-bold font-mono", getScoreColor(result.churnScore, "churn"))}>
                        {result.churnScore}%
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Trust Score</span>
                      <span className={cn("text-3xl font-bold font-mono", getScoreColor(result.trustScore, "trust"))}>
                        {result.trustScore}%
                      </span>
                    </div>
                  </div>

                  {/* Explainable AI Box */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Explainable AI Insights
                    </h3>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                      {result.reasons.length > 0 ? (
                        <ul className="space-y-2">
                          {result.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Normal transaction pattern detected. No significant risk factors.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Simulations */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" /> Recent Simulations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {history.map((item) => (
              <Card key={item.id} className="glass border-white/5 hover:bg-white/[0.02] transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm text-foreground truncate max-w-[120px]">{item.customerName}</div>
                      <div className="text-xs text-muted-foreground">{item.timestamp}</div>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getBadgeColor(item.recommendation))}>
                      {item.recommendation}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
                    <span className="text-muted-foreground">₹{item.amount.toLocaleString()}</span>
                    <span className={cn("font-mono font-medium", getScoreColor(item.fraudScore, "fraud"))}>
                      F:{item.fraudScore}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
