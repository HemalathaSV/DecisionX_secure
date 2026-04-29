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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (type: "customer" | "page" | "alert" | "transaction", name: string, id?: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    
    if (type === "customer") {
      // In a real app, we would pass the ID. For the demo, navigating cleanly to Customer 360 page.
      navigate({ to: "/customer-360" });
      toast.success(`Navigated to profile: ${name}`);
    } else if (type === "page") {
      navigate({ to: `/${id}` as any });
    } else {
      toast.success(`Selected ${type}: ${name}`);
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    setSearchOpen(false);
  };

  const CUSTOMERS = [
    { name: "Arjun Reddy", id: "CUS-1201" },
    { name: "Arjun Bose", id: "CUS-4491" },
    { name: "Ananya Bose", id: "CUS-8921" },
    { name: "Priya Desai", id: "CUS-4432" },
  ];

  // Simple client-side filtering for the mock
  const filteredCustomers = CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      
      <div className="relative hidden w-full max-w-lg md:block">
        <div 
          className={cn(
            "relative flex h-10 w-full items-center gap-2 rounded-xl border bg-white/[0.03] px-3 transition-colors",
            searchOpen ? "border-primary/50 ring-2 ring-primary/20" : "border-border hover:bg-white/[0.05]"
          )}
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search customers, alerts, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
          {searchQuery ? (
            <button onClick={clearSearch} className="shrink-0 p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          ) : (
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>

        {searchOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
            <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-border/50 glass-strong shadow-2xl animate-in fade-in slide-in-from-top-2">
              <Command className="bg-transparent" shouldFilter={false}>
                <CommandList className="max-h-[400px] overflow-y-auto p-1 scrollbar-thin">
                  {searchQuery && filteredCustomers.length === 0 && (
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                      No results found for "{searchQuery}"
                    </CommandEmpty>
                  )}
                  
                  {(!searchQuery || filteredCustomers.length > 0) && (
                    <CommandGroup heading="Customers">
                      {(searchQuery ? filteredCustomers : CUSTOMERS.slice(0, 2)).map((c) => (
                        <CommandItem key={c.id} onSelect={() => handleSelect("customer", c.name, c.id)} className="cursor-pointer">
                          <UserCircle2 className="mr-2 h-4 w-4 text-primary" />
                          <span>{c.name} <span className="text-muted-foreground ml-1">({c.id})</span></span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {(!searchQuery || "high risk transfer".includes(searchQuery.toLowerCase())) && (
                    <CommandGroup heading="Alerts">
                      <CommandItem onSelect={() => handleSelect("alert", "High Risk Transfer")} className="cursor-pointer">
                        <ShieldAlert className="mr-2 h-4 w-4 text-destructive" />
                        <span>High Risk Transfer - <span className="font-semibold">₹95,000</span></span>
                      </CommandItem>
                    </CommandGroup>
                  )}

                  {(!searchQuery || "txn-99231".includes(searchQuery.toLowerCase())) && (
                    <CommandGroup heading="Transactions">
                      <CommandItem onSelect={() => handleSelect("transaction", "TXN-99231")} className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4 text-accent" />
                        <span>TXN-99231 - <span className="font-semibold">₹4,500</span> to Amazon</span>
                      </CommandItem>
                    </CommandGroup>
                  )}

                  {(!searchQuery || "customer 360".includes(searchQuery.toLowerCase()) || "fraud alerts".includes(searchQuery.toLowerCase())) && (
                    <CommandGroup heading="Pages">
                      {(!searchQuery || "customer 360".includes(searchQuery.toLowerCase())) && (
                        <CommandItem onSelect={() => handleSelect("page", "Customer 360", "customer-360")} className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Customer 360</span>
                        </CommandItem>
                      )}
                      {(!searchQuery || "fraud alerts".includes(searchQuery.toLowerCase())) && (
                        <CommandItem onSelect={() => handleSelect("page", "Fraud Alerts", "fraud-alerts")} className="cursor-pointer">
                          <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Fraud Alerts</span>
                        </CommandItem>
                      )}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </div>
          </>
        )}
      </div>
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
