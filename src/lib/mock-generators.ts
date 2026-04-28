import { FraudAlert, ChurnCustomer } from "./mock-data";

const NAMES = ["Rahul", "Priya", "Arjun", "Neha", "Vikram", "Sneha", "Karan", "Rohit", "Divya", "Ananya"];
const CITIES = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata"];
const DEVICES = ["Trusted", "New Device", "Suspicious"];

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const generateMockCustomers = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const name = randomElement(NAMES) + " " + randomElement(["Sharma", "Verma", "Iyer", "Rao", "Gupta", "Nair", "Reddy", "Patel", "Bose"]);
    const loyaltyDays = randomInt(10, 1500);
    const lowFraud = Math.random() > 0.2;
    // Trust score based on: loyalty, low fraud, long relationship
    let trustScore = Math.min(100, Math.round((loyaltyDays / 1500) * 50 + (lowFraud ? 50 : 10)));
    
    return {
      id: `c${i + 1}`,
      name,
      city: randomElement(CITIES),
      tier: randomElement(["Silver", "Gold", "Platinum", "Bronze"]),
      loyaltyDays,
      trustScore,
      lastLogin: `${randomInt(1, 30)} days ago`,
    };
  });
};

export const generateMockFraudAlerts = (count: number, customers: any[]): FraudAlert[] => {
  return Array.from({ length: count }).map((_, i) => {
    const c = customers.length ? randomElement(customers) : { name: "Unknown", city: "Mumbai" };
    const amount = randomInt(500, 500000);
    const device = randomElement(DEVICES);
    const failedOtp = Math.random() > 0.7;
    
    // Fraud score based on: amount, new device, failed otp
    let score = 10;
    if (amount > 100000) score += 30;
    if (device === "New Device") score += 20;
    else if (device === "Suspicious") score += 40;
    if (failedOtp) score += 30;
    
    score = Math.min(99, score);
    
    let action: "Allow" | "Ask MFA" | "Block" = "Allow";
    let status: "safe" | "mfa" | "blocked" = "safe";
    
    if (score > 80) { action = "Block"; status = "blocked"; }
    else if (score > 50) { action = "Ask MFA"; status = "mfa"; }

    let reason = "Normal transaction";
    if (failedOtp) reason = "Failed OTP";
    else if (device === "Suspicious") reason = "Suspicious Device / IP";
    else if (amount > 100000 && device === "New Device") reason = "High Amount + New Device";
    
    return {
      id: `f${i + 1}`,
      customer: c.name,
      amount,
      city: c.city,
      device: device as any,
      fraudScore: score,
      reason,
      action,
      status,
      timestamp: `${randomInt(1, 59)}m ago`,
    };
  });
};

export const generateMockChurnCustomers = (count: number, customers: any[]): ChurnCustomer[] => {
  return Array.from({ length: count }).map((_, i) => {
    const c = customers.length ? randomElement(customers) : { id: `c${i}`, name: "Unknown", tier: "Bronze" };
    
    const inactivityDays = randomInt(5, 90);
    const complaints = randomInt(0, 5);
    
    // Churn score based on: inactivity, complaints
    let score = Math.min(99, Math.round((inactivityDays / 90) * 60 + (complaints * 10)));
    
    let reason = "Unknown";
    if (inactivityDays > 30) reason = `Inactive ${inactivityDays} days`;
    else if (complaints > 2) reason = "Multiple support escalations";
    else reason = "Dropped engagement";

    let action = "Engagement Nudge";
    if (score > 80) action = "Cashback Offer";
    else if (score > 50) action = "Discount Plan";

    return {
      id: c.id,
      name: c.name,
      score,
      reason,
      action,
      plan: c.tier,
      lastActive: `${inactivityDays} days ago`,
    };
  });
};
