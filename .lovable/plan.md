# TrustGuard AI — Frontend Build Plan

A premium dark-themed fintech SaaS dashboard for fraud detection, churn prediction, and trust scoring. Frontend-only with realistic mock data.

## Brand & Design System

- **Logo**: "TrustGuard AI" with shield icon, tagline "Protect Revenue. Retain Customers. Build Trust."
- **Theme**: Deep navy/black background (`#0A0A1A`), glassmorphism cards with backdrop blur
- **Accent gradient**: Blue (`#3B82F6`) → Purple (`#8B5CF6`) for CTAs, highlights, chart strokes
- **Typography**: Inter font, generous sizing, tight tracking on headings
- **Components**: Rounded-xl, soft shadows, subtle borders (`white/10`), hover lift + glow
- **Animations**: Fade-in on mount, animated counters (KPIs), pulse on live alerts, smooth page transitions, hover scale on cards

## Layout Shell

- **Left Sidebar** (collapsible on mobile): Logo at top, nav items with lucide icons (LayoutDashboard, ShieldAlert, TrendingDown, UserCircle, FileBarChart), active state with gradient background
- **Top Navbar**: Global search bar, notification bell (with red dot badge), admin avatar with dropdown
- **Main content area**: Animated outlet for page transitions

## Routes (TanStack Start file-based)

```
src/routes/
  __root.tsx        → shared sidebar + navbar layout, Outlet
  index.tsx         → Dashboard
  fraud-alerts.tsx  → Fraud Alerts
  churn-risk.tsx    → Churn Risk
  customer-360.tsx  → Customer 360
  reports.tsx       → Reports
```

Each route sets its own `head()` metadata (title, description, og tags).

## Page 1 — Dashboard

- **KPI cards row** (5 cards, animated counters): Transactions Today (₹4.2Cr / 18,432), Fraud Prevented (247), Churn Risk Customers (89), Revenue Saved (₹1.8Cr), Avg Trust Score (78/100). Each with delta chip (▲/▼) and sparkline.
- **Charts grid** (recharts):
  - Fraud trend line chart (last 30 days, gradient area)
  - Churn distribution pie/donut (Low/Medium/High/Critical)
  - Risk heatmap (7-day × hour-of-day grid of intensity)
  - Monthly savings bar chart (12 months)
- **Live Alerts panel** (right side, sticky): animated list with pulse dot, sample alerts for Rahul / Priya / Vikram; new alert slides in every ~8s from a rotating pool
- **Demo Simulation button** (gradient CTA): triggers modal showing ₹95,000 from new device, Fraud Risk 91% with animated gauge, recommended action "Block Transaction", Allow/Block/Ask MFA buttons

## Page 2 — Fraud Alerts

- **Filter tabs**: Today | High Risk | Blocked | All with counts
- **Search bar** + severity/city dropdowns
- **Glass table** with columns: Customer, Amount, City, Device Status, Fraud Score (progress bar), Reason, Recommended Action, Status badge (green Safe / yellow Ask MFA / red Blocked)
- **Sample rows**: Rahul/Priya/Arjun plus 12+ realistic Indian entries across Mumbai, Bangalore, Delhi, Hyderabad, Chennai, Pune
- Row click → side drawer with full details
- Pagination + row count

## Page 3 — Churn Risk

- **Summary strip**: Total at risk, High risk, Medium, Low
- **Customer cards grid** (3-col responsive): Avatar, Name, circular churn % ring (color graded), reason chip, suggested retention action button (Cashback / VIP Support / Discount Plan), hover lift + glow
- **Sample cards**: Priya 88%, Arjun 94%, Neha 55% + Karan, Sneha, Vikram, etc.
- Filter: sort by score, by reason

## Page 4 — Customer 360

- **Header card**: Avatar, Name (Rahul Sharma), account meta, three big score rings side-by-side (Trust 72, Fraud 62%, Churn 24%)
- **Left column**: Profile details (last login, device trust, location, account age)
- **Middle column**: Activity Timeline (vertical with colored dots): Logged in from Bangalore → ₹45,000 transfer → OTP failed twice → Risk engine triggered MFA, each with timestamp
- **Right column (sticky)**: AI Recommendation card "Ask MFA Verification" with confidence %, action buttons (Allow / Ask MFA / Block / Offer Cashback)
- **Explainable AI section** (bottom): Feature contribution bars — New Device (+28), High Amount (+22), Failed OTP (+19), Location Anomaly (+8)

## Page 5 — Reports

- **Date range picker** + Export Report button (gradient, triggers mock toast)
- **Chart grid** (2×2): Monthly Fraud Prevented (bar), Revenue Saved (area), Customer Retention Success (line with goal line), False Positive Reduction (line trending down)
- **Report cards list**: downloadable mock reports (PDF icons)

## Mock Data

Single `src/lib/mock-data.ts` with:
- Customers array (Rahul, Priya, Arjun, Neha, Vikram, Sneha, Karan, + more)
- Cities: Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune
- Fraud alerts, churn records, transactions, time series for charts
- INR formatter helper (`₹` with Indian lakh/crore grouping)

## UX Polish

- Animated number counters on KPIs (count-up on mount)
- Skeleton loaders on first render (300–600ms simulated)
- Toast notifications (sonner) for actions (Block, Allow, Export)
- Card hover: translate-y + shadow glow
- Consistent button variants (primary gradient, ghost, destructive)
- Fully responsive: sidebar collapses to drawer on mobile, tables become card lists on small screens

## Technical Notes

- Stack: TanStack Start (existing), Tailwind v4 tokens in `src/styles.css`, shadcn/ui (already installed), recharts for charts, lucide-react for icons, sonner for toasts
- Extend `styles.css` with dark theme tokens (navy background, glass surface, gradient variables) and glass utility class
- Shared components: `AppSidebar`, `TopNavbar`, `KpiCard`, `GlassCard`, `StatusBadge`, `ScoreRing`, `LiveAlertItem`, `DemoSimulationModal`
- No backend / no auth — pure frontend with mock data
