import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Severity } from "@/lib/mock-data";

export function GlassCard({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5",
        hover && "hover-lift",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: Severity }) {
  const map = {
    safe: { label: "Safe", cls: "bg-success/15 text-success border-success/30" },
    mfa: { label: "Ask MFA", cls: "bg-warning/15 text-warning border-warning/30" },
    blocked: { label: "Blocked", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  } as const;
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", s.cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span className="tabular-nums">
      {prefix}
      {display.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function ScoreRing({
  value,
  label,
  size = 120,
  tone = "primary",
}: {
  value: number;
  label?: string;
  size?: number;
  tone?: "primary" | "danger" | "warning" | "success";
}) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const stroke = {
    primary: "oklch(0.65 0.22 275)",
    danger: "oklch(0.62 0.24 20)",
    warning: "oklch(0.78 0.18 85)",
    success: "oklch(0.72 0.2 170)",
  }[tone];
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="8" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold tabular-nums">
          <AnimatedCounter value={value} />
          <span className="text-muted-foreground text-sm">%</span>
        </div>
        {label && <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>}
      </div>
    </div>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const hues = [265, 230, 170, 310, 20, 85];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className={cn("flex items-center justify-center rounded-full text-sm font-semibold text-primary-foreground", className)}
      style={{ background: `linear-gradient(135deg, oklch(0.62 0.22 ${hue}), oklch(0.55 0.24 ${(hue + 40) % 360}))` }}
    >
      {initials}
    </div>
  );
}
