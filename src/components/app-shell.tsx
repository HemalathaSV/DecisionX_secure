import { ReactNode, useState, useEffect } from "react";
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
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="text-base font-semibold tracking-tight">Secure<span className="gradient-text">AI</span></div>
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
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (item: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    
    // Only open customer modal for names (not for alerts/transactions starting with TXN or High Risk)
    if (!item.startsWith("TXN-") && !item.includes("High Risk") && !item.includes("Failed Login")) {
      setSelectedCustomer(item);
    } else {
      toast.success(`Action: ${item}`);
    }
  };

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
        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-foreground transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search by name, ID, or alerts...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Type a name to search..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {searchQuery ? (
              <div 
                className="flex cursor-pointer items-center justify-center p-4 text-sm text-primary hover:bg-white/[0.02] transition-colors"
                onClick={() => handleSelect(searchQuery)}
              >
                <UserCircle2 className="mr-2 h-4 w-4" />
                Querying external database for "{searchQuery}"...
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>
          
          {searchQuery.trim().length > 0 && (
            <CommandGroup heading="Global Directory">
              <CommandItem value={searchQuery} onSelect={() => handleSelect(searchQuery)}>
                <UserCircle2 className="mr-2 h-4 w-4 text-primary" />
                <span><span className="font-semibold text-foreground">{searchQuery}</span> <span className="text-muted-foreground">(ID: CUS-{Math.floor(Math.random() * 9000) + 1000})</span></span>
              </CommandItem>
            </CommandGroup>
          )}

          <CommandGroup heading="Customers">
            <CommandItem value="Rahul Sharma" onSelect={() => handleSelect("Rahul Sharma")}>
              <UserCircle2 className="mr-2 h-4 w-4" />
              <span>Rahul Sharma (ID: CUS-8921)</span>
            </CommandItem>
            <CommandItem value="Priya Desai" onSelect={() => handleSelect("Priya Desai")}>
              <UserCircle2 className="mr-2 h-4 w-4" />
              <span>Priya Desai (ID: CUS-4432)</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recent Alerts">
            <CommandItem value="High Risk Transfer" onSelect={() => handleSelect("High Risk Transfer")}>
              <ShieldAlert className="mr-2 h-4 w-4 text-destructive" />
              <span>High Risk Transfer - ₹95,000</span>
            </CommandItem>
            <CommandItem value="Failed Login Attempts" onSelect={() => handleSelect("Failed Login Attempts")}>
              <AlertTriangle className="mr-2 h-4 w-4 text-warning" />
              <span>Multiple failed logins (192.168.1.104)</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Transactions">
            <CommandItem value="TXN-998231" onSelect={() => handleSelect("TXN-998231")}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>TXN-998231 - ₹4,500 to Amazon</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedCustomer(null)} />
          <div className="relative w-full max-w-md glass-strong rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-brand text-3xl font-bold text-primary-foreground shadow-glow mb-4">
                {selectedCustomer.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-foreground">{selectedCustomer}</h2>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Username: @{selectedCustomer.toLowerCase().replace(/[^a-z0-9]/g, '_')}
              </div>
            </div>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
                <span className="text-sm text-muted-foreground">Trust Score</span>
                <span className="text-sm font-medium text-foreground">92/100 (Low Risk)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="text-sm font-medium text-foreground">₹4.2 Lakhs</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-xl bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors" onClick={() => {toast.info("Report downloaded"); setSelectedCustomer(null);}}>
                Export Report
              </button>
              <button className="flex-1 rounded-xl gradient-brand py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition-opacity" onClick={() => {toast.success("Profile reviewed"); setSelectedCustomer(null);}}>
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass border-border/50 p-0">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-medium text-destructive">
                3 New
              </span>
            </div>
            <div className="flex max-h-[300px] flex-col overflow-y-auto py-1">
              {/* Notification 1 */}
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-border/30 last:border-0">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground leading-tight">Multiple failed logins detected</span>
                  <span className="text-xs text-muted-foreground leading-snug">3 failed attempts from IP 192.168.1.104 targeting admin account.</span>
                  <span className="text-[10px] text-muted-foreground/70">2 mins ago</span>
                </div>
              </div>
              {/* Notification 2 */}
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-border/30 last:border-0">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground leading-tight">High risk transaction blocked</span>
                  <span className="text-xs text-muted-foreground leading-snug">₹95,000 transfer to unrecognized device automatically halted.</span>
                  <span className="text-[10px] text-muted-foreground/70">15 mins ago</span>
                </div>
              </div>
              {/* Notification 3 */}
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-border/30 last:border-0">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Database className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground leading-tight">Model retrained successfully</span>
                  <span className="text-xs text-muted-foreground leading-snug">Fraud detection model v2.4 deployment complete.</span>
                  <span className="text-[10px] text-muted-foreground/70">1 hr ago</span>
                </div>
              </div>
            </div>
            <div className="border-t border-border/50 p-2 text-center">
              <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                View all activity
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] py-1.5 pl-1.5 pr-3 hover:bg-white/[0.05] transition-colors focus:outline-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand text-xs font-semibold text-primary-foreground">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <div className="text-sm font-medium">{user?.username || 'Admin Das'}</div>
                <div className="text-[11px] text-muted-foreground">Risk Ops · SecureAI</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass border-border/50 p-2">
            <DropdownMenuLabel className="font-normal mb-2">
              <div className="flex flex-col space-y-1">
                <p className="text-base font-semibold leading-none text-foreground">{user?.username || 'Admin Das'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@secureai.dev
                </p>
              </div>
            </DropdownMenuLabel>
            
            <div className="rounded-lg bg-white/5 p-3 space-y-2 mb-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium text-foreground">Super Admin</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium text-foreground">Risk Operations</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">ID</span>
                <span className="font-medium text-foreground">ADM-9402</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Clearance</span>
                <span className="font-medium text-success">Level 5</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-success flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Active
                </span>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
              onClick={logout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer mt-1 rounded-md"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
