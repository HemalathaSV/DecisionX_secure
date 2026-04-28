import { ReactNode, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShieldAlert,
  TrendingDown,
  UserCircle2,
  FileBarChart2,
  Search,
  Bell,
  ShieldCheck,
  Menu,
  X,
  Database,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fraud-alerts", label: "Fraud Alerts", icon: ShieldAlert },
  { to: "/churn-risk", label: "Churn Risk", icon: TrendingDown },
  { to: "/customer-360", label: "Customer 360", icon: UserCircle2 },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/dataset-manager", label: "Dataset Manager", icon: Database },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-glow">
        <ShieldCheck className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="leading-tight">
        <div className="text-base font-semibold tracking-tight">TrustGuard <span className="gradient-text">AI</span></div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fintech Intelligence</div>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { location } = useRouterState();
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Brand />
      </div>
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-[image:var(--gradient-brand-soft)] text-foreground shadow-[inset_0_0_0_1px_oklch(1_0_0/0.08)]"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  active ? "gradient-brand text-primary-foreground shadow-glow" : "bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl glass p-4">
        <div className="text-xs font-medium text-foreground">Protect Revenue.</div>
        <div className="text-xs text-muted-foreground">Retain Customers. Build Trust.</div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            AI Engine live
          </span>
          <span>v2.4</span>
        </div>
      </div>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative hidden w-full max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search customers, transactions, alerts…"
          className="h-10 w-full rounded-xl border border-border bg-white/[0.03] pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/[0.03] text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] py-1.5 pl-1.5 pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand text-xs font-semibold text-primary-foreground">
            AD
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <div className="text-sm font-medium">Admin Das</div>
            <div className="text-[11px] text-muted-foreground">Risk Ops · TrustGuard</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl md:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-sidebar-border bg-sidebar animate-slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main key={typeof window !== "undefined" ? window.location.pathname : ""} className="flex-1 animate-fade-in px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
