export type Severity = "safe" | "mfa" | "blocked";

export interface FraudAlert {
  id: string;
  customer: string;
  amount: number;
  city: string;
  device: "Trusted" | "New Device" | "Suspicious";
  fraudScore: number;
  reason: string;
  action: "Allow" | "Ask MFA" | "Block";
  status: Severity;
  timestamp: string;
}

export interface ChurnCustomer {
  id: string;
  name: string;
  score: number;
  reason: string;
  action: string;
  plan: string;
  lastActive: string;
}

export const CITIES = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"];

export const formatINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export const formatINRFull = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const FRAUD_ALERTS: FraudAlert[] = [
  { id: "f1", customer: "Rahul Sharma", amount: 95000, city: "Mumbai", device: "New Device", fraudScore: 91, reason: "Failed OTP + High Amount", action: "Block", status: "blocked", timestamp: "2m ago" },
  { id: "f2", customer: "Priya Menon", amount: 12000, city: "Bangalore", device: "Trusted", fraudScore: 12, reason: "Normal behavior", action: "Allow", status: "safe", timestamp: "5m ago" },
  { id: "f3", customer: "Arjun Kapoor", amount: 45000, city: "Delhi", device: "New Device", fraudScore: 62, reason: "New device + Unusual hour", action: "Ask MFA", status: "mfa", timestamp: "8m ago" },
  { id: "f4", customer: "Neha Verma", amount: 8500, city: "Hyderabad", device: "Trusted", fraudScore: 18, reason: "Routine transaction", action: "Allow", status: "safe", timestamp: "12m ago" },
  { id: "f5", customer: "Vikram Singh", amount: 120000, city: "Chennai", device: "Suspicious", fraudScore: 96, reason: "3x Failed OTP attempts", action: "Block", status: "blocked", timestamp: "15m ago" },
  { id: "f6", customer: "Sneha Iyer", amount: 23000, city: "Pune", device: "New Device", fraudScore: 58, reason: "New IP range", action: "Ask MFA", status: "mfa", timestamp: "22m ago" },
  { id: "f7", customer: "Karan Mehta", amount: 67000, city: "Mumbai", device: "Trusted", fraudScore: 24, reason: "Verified merchant", action: "Allow", status: "safe", timestamp: "31m ago" },
  { id: "f8", customer: "Ananya Rao", amount: 210000, city: "Bangalore", device: "New Device", fraudScore: 84, reason: "High value + Location mismatch", action: "Block", status: "blocked", timestamp: "44m ago" },
  { id: "f9", customer: "Rohit Gupta", amount: 15500, city: "Delhi", device: "Trusted", fraudScore: 9, reason: "Recurring bill payment", action: "Allow", status: "safe", timestamp: "1h ago" },
  { id: "f10", customer: "Meera Nair", amount: 38000, city: "Chennai", device: "New Device", fraudScore: 55, reason: "New device first transaction", action: "Ask MFA", status: "mfa", timestamp: "1h ago" },
  { id: "f11", customer: "Aditya Joshi", amount: 175000, city: "Hyderabad", device: "Suspicious", fraudScore: 88, reason: "Velocity anomaly", action: "Block", status: "blocked", timestamp: "2h ago" },
  { id: "f12", customer: "Kavya Reddy", amount: 9200, city: "Pune", device: "Trusted", fraudScore: 14, reason: "Normal behavior", action: "Allow", status: "safe", timestamp: "2h ago" },
  { id: "f13", customer: "Siddharth Bose", amount: 52000, city: "Mumbai", device: "New Device", fraudScore: 66, reason: "Geolocation jump", action: "Ask MFA", status: "mfa", timestamp: "3h ago" },
  { id: "f14", customer: "Isha Patel", amount: 31000, city: "Bangalore", device: "Trusted", fraudScore: 21, reason: "Whitelisted payee", action: "Allow", status: "safe", timestamp: "3h ago" },
  { id: "f15", customer: "Tanvi Desai", amount: 88000, city: "Delhi", device: "Suspicious", fraudScore: 79, reason: "Rapid repeated transfers", action: "Block", status: "blocked", timestamp: "4h ago" },
];

export const CHURN_CUSTOMERS: ChurnCustomer[] = [
  { id: "c1", name: "Priya Menon", score: 88, reason: "Inactive 24 days", action: "Cashback Offer", plan: "Silver", lastActive: "24 days ago" },
  { id: "c2", name: "Arjun Kapoor", score: 94, reason: "Negative Feedback", action: "VIP Support", plan: "Gold", lastActive: "3 days ago" },
  { id: "c3", name: "Neha Verma", score: 55, reason: "Lower Usage", action: "Discount Plan", plan: "Silver", lastActive: "7 days ago" },
  { id: "c4", name: "Karan Mehta", score: 72, reason: "Downgraded plan", action: "Loyalty Rewards", plan: "Bronze", lastActive: "10 days ago" },
  { id: "c5", name: "Sneha Iyer", score: 41, reason: "Reduced transactions", action: "Discount Plan", plan: "Silver", lastActive: "5 days ago" },
  { id: "c6", name: "Vikram Singh", score: 81, reason: "Support ticket unresolved", action: "VIP Support", plan: "Gold", lastActive: "12 days ago" },
  { id: "c7", name: "Ananya Rao", score: 63, reason: "Competitor app usage", action: "Cashback Offer", plan: "Gold", lastActive: "6 days ago" },
  { id: "c8", name: "Rohit Gupta", score: 36, reason: "Seasonal drop", action: "Engagement Nudge", plan: "Bronze", lastActive: "4 days ago" },
  { id: "c9", name: "Meera Nair", score: 77, reason: "Failed transaction history", action: "Priority Resolution", plan: "Silver", lastActive: "9 days ago" },
];

// Last 30 days fraud trend
export const FRAUD_TREND = Array.from({ length: 30 }, (_, i) => {
  const base = 40 + Math.sin(i / 3) * 15 + Math.random() * 20;
  return {
    day: `D${i + 1}`,
    attempts: Math.round(base + i * 1.2),
    prevented: Math.round(base * 0.85 + i * 1.1),
  };
});

export const CHURN_DISTRIBUTION = [
  { name: "Low", value: 412, color: "oklch(0.72 0.2 170)" },
  { name: "Medium", value: 186, color: "oklch(0.78 0.18 85)" },
  { name: "High", value: 89, color: "oklch(0.7 0.22 30)" },
  { name: "Critical", value: 34, color: "oklch(0.62 0.24 20)" },
];

export const MONTHLY_SAVINGS = [
  { month: "Jan", saved: 42 }, { month: "Feb", saved: 58 }, { month: "Mar", saved: 71 },
  { month: "Apr", saved: 64 }, { month: "May", saved: 89 }, { month: "Jun", saved: 102 },
  { month: "Jul", saved: 118 }, { month: "Aug", saved: 134 }, { month: "Sep", saved: 127 },
  { month: "Oct", saved: 152 }, { month: "Nov", saved: 168 }, { month: "Dec", saved: 184 },
];

// 7 days x 12 buckets (every 2 hours)
export const RISK_HEATMAP = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 12 }, (_, h) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d],
    hour: h * 2,
    intensity: Math.round(Math.abs(Math.sin((d + 1) * (h + 1) / 5) * 80) + Math.random() * 20),
  }))
).flat();

export const LIVE_ALERT_POOL = [
  { name: "Rahul", text: "attempted ₹95,000 from new device", type: "danger" as const },
  { name: "Priya", text: "churn risk increased to 88%", type: "warning" as const },
  { name: "Vikram", text: "blocked due to failed OTP attempts", type: "danger" as const },
  { name: "Arjun", text: "triggered MFA on ₹45,000 transfer", type: "info" as const },
  { name: "Neha", text: "login from new location: Hyderabad", type: "info" as const },
  { name: "Sneha", text: "unusual velocity detected (8 txns/min)", type: "warning" as const },
  { name: "Karan", text: "completed high-value transfer safely", type: "success" as const },
  { name: "Ananya", text: "flagged for geo-mismatch, action pending", type: "warning" as const },
];

export const RETENTION_SUCCESS = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  saved: 40 + i * 5 + Math.round(Math.random() * 8),
  target: 80,
}));

export const FALSE_POSITIVE = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  rate: Math.max(2, 18 - i * 1.2 + Math.random() * 1.5),
}));
