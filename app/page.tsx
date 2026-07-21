"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings2,
  TrendingUp,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BCStage = "Live" | "Enrolling" | "Pitched" | "Not started" | "N/A";
type CTVStage = "Live" | "Enabling" | "Eligible" | "Not started";
type Account = { name: string; mrr: number; merch: number; days: number; bc: BCStage; ctv: CTVStage };
type FocusFilter = "All" | "Business Capital" | "Customer Token Vault";
type Preferences = { rowCount: 20 | 30 | 50; focusFilter: FocusFilter; colorByActivity: boolean; amberDays: number; redDays: number };

const seededAccounts: Account[] = [
  { name: "Alternative Horizons Group", mrr: 29513, merch: 34, days: 0, bc: "Enrolling", ctv: "Eligible" },
  { name: "Direct Pay Net", mrr: 14277, merch: 74, days: 61, bc: "Pitched", ctv: "Enabling" },
  { name: "Platinum Business Solutions", mrr: 10491, merch: 24, days: 53, bc: "Live", ctv: "Live" },
  { name: "Clay Pay Solutions", mrr: 9716, merch: 3, days: 1, bc: "Pitched", ctv: "Eligible" },
  { name: "Lonestar Technologies", mrr: 9304, merch: 92, days: 53, bc: "Pitched", ctv: "Enabling" },
  { name: "Bryte Payment Solutions", mrr: 7334, merch: 3, days: 20, bc: "Not started", ctv: "Eligible" },
  { name: "Pinnacle Business Products", mrr: 6597, merch: 43, days: 8, bc: "Live", ctv: "Live" },
  { name: "MLS Direct / Titanium Payments", mrr: 4973, merch: 16, days: 59, bc: "Pitched", ctv: "Not started" },
  { name: "Delta Payment Cooperative", mrr: 4835, merch: 41, days: 53, bc: "Enrolling", ctv: "Enabling" },
  { name: "Green Payment Solutions", mrr: 4728, merch: 88, days: 53, bc: "Not started", ctv: "Eligible" },
  { name: "Motivated Merchant Mgmt", mrr: 4474, merch: 4, days: 145, bc: "Not started", ctv: "Not started" },
  { name: "Nock Payments", mrr: 4173, merch: 21, days: 57, bc: "Pitched", ctv: "Enabling" },
  { name: "SweetBling, Inc", mrr: 3939, merch: 35, days: 78, bc: "Not started", ctv: "Eligible" },
  { name: "CareValidate", mrr: 3816, merch: 2, days: 4, bc: "N/A", ctv: "Live" },
  { name: "BH International", mrr: 3547, merch: 6, days: 53, bc: "Pitched", ctv: "Eligible" },
  { name: "Symmetric Technologies", mrr: 3540, merch: 175, days: 53, bc: "Not started", ctv: "Enabling" },
  { name: "Merchant Account (Mertzco)", mrr: 3131, merch: 248, days: 13, bc: "Not started", ctv: "Enabling" },
  { name: "Concordia Merchant Services", mrr: 3106, merch: 36, days: 97, bc: "Not started", ctv: "Not started" },
  { name: "Commerce Bank", mrr: 3082, merch: 119, days: 1, bc: "Live", ctv: "Live" },
  { name: "EroNet LLC", mrr: 3058, merch: 75, days: 199, bc: "Not started", ctv: "Not started" },
];

const tailRows = [
  ["Level III Transactions LLC", 2963, 0, 95], ["Acumen Business Connections", 2915, 38, 83],
  ["Boom Town, LLC", 2799, 8, 186], ["Higher Standards", 2728, 64, 97],
  ["Simple Processing Solutions", 2694, 116, 7], ["Payhub (First Global Merchants)", 2629, 112, 82],
  ["Polynias / Integrated Payments", 2597, 50, 67], ["LP Group Consulting Inc", 2579, 3, 169],
  ["SET Marketing, LLC", 2557, 86, 53], ["Allied Platforms LLC", 2488, 20, 208],
  ["Paidon Inc", 2338, 7, 57], ["Vital Merchant Solutions", 2295, 119, 56],
  ["CoreTranz Business Services", 2197, 50, 42], ["Kizzle Inc DBA CK Solutions", 2041, 10, 203],
  ["Altrupay", 2017, 32, 8], ["NRRM LLC dba CarShield", 1987, 6, 0],
  ["Transaction Resources (Tower Payments)", 1968, 12, 57], ["BASYS Processing, Inc.", 1956, 80, 8],
  ["First Financial USA", 1822, 57, 179], ["Paynuity Corporation", 1801, 23, 0],
  ["Merchant Data Solutions, LLC.", 1689, 29, 78], ["Cobalt Payments, Inc.", 1662, 93, 139],
  ["Payment Processing Technologies", 1591, 133, 47], ["Altiras Advisors", 1557, 236, 78],
  ["Electronic Commerce", 1497, 167, 57], ["FigPay", 1491, 15, 132],
  ["Telecom Partners (Tachht, Inc.)", 1468, 8, 197], ["Swiped Unlimited", 1452, 15, 195],
  ["Blue Valley (PayFlock - SURGEify)", 1434, 20, 69], ["Stacked Payments, Inc.", 1403, 37, 208],
] as const;

const allAccounts: Account[] = [
  ...seededAccounts,
  ...tailRows.map(([name, mrr, merch, days]) => ({
    name,
    mrr,
    merch,
    days,
    bc: (days >= 120 ? "Not started" : merch >= 60 && days < 60 ? "Enrolling" : days < 30 ? "Pitched" : merch >= 15 ? "Pitched" : "Not started") as BCStage,
    ctv: (days >= 150 ? "Not started" : merch >= 100 ? "Enabling" : merch >= 30 ? "Eligible" : days < 30 ? "Eligible" : "Not started") as CTVStage,
  })),
];

const defaultPreferences: Preferences = { rowCount: 20, focusFilter: "All", colorByActivity: true, amberDays: 30, redDays: 60 };

const navItems = [
  { label: "Daily Focus", icon: Home, active: true },
  { label: "Partners", icon: Users, badge: "20" },
  { label: "Interactions", icon: MessageSquare },
  { label: "Threads", icon: Workflow, badge: "6" },
];
const insightItems = [
  { label: "Trends", icon: TrendingUp },
  { label: "Reports", icon: FileText },
  { label: "Playbook", icon: BookOpen },
];

function money(value: number) {
  return value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2)}M` : `$${(value / 1000).toFixed(1)}K`;
}

function Mark() {
  return (
    <svg viewBox="0 0 60 56" className="brand-mark" aria-label="NMI">
      <defs>
        <linearGradient id="nmi-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#D2FF97" />
          <stop offset="50%" stopColor="#85F39B" />
          <stop offset="100%" stopColor="#5CD5A5" />
        </linearGradient>
      </defs>
      <rect x="6" y="9" width="8" height="38" rx="1.5" fill="url(#nmi-gradient)" />
      <rect x="44" y="9" width="8" height="38" rx="1.5" fill="url(#nmi-gradient)" />
      <path d="M45.5 9.2 53 16.5 14 47 6.5 39.7Z" fill="url(#nmi-gradient)" />
      <circle cx="56.5" cy="13" r="4.5" fill="#5CDDAD" />
    </svg>
  );
}

function Avatar({ small = false }: { small?: boolean }) {
  return <span className={`avatar ${small ? "small" : ""}`}>DR</span>;
}

function Sidebar({ open, close, notify }: { open: boolean; close: () => void; notify: (v: string) => void }) {
  return (
    <>
      <button className={`nav-scrim ${open ? "show" : ""}`} onClick={close} aria-label="Close navigation" />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand"><Mark /><div><strong>CAM Intelligence</strong><span>Partner OS</span></div><button className="sidebar-close" onClick={close} aria-label="Close navigation"><X /></button></div>
        <div className="log-wrap"><button className="primary-button" onClick={() => notify("Interaction form opened")}><Plus />Log Interaction</button></div>
        <nav className="nav-list" aria-label="Primary navigation">
          <p className="nav-section">Workspace</p>
          {navItems.map(({ label, icon: Icon, badge, active }) => (
            <button key={label} className={`nav-item ${active ? "active" : ""}`} onClick={() => notify(`${label} selected`)}>
              <Icon /><span>{label}</span>{badge && <b>{badge}</b>}
            </button>
          ))}
          <p className="nav-section second">Insights</p>
          {insightItems.map(({ label, icon: Icon }) => (
            <button key={label} className="nav-item" onClick={() => notify(`${label} selected`)}><Icon /><span>{label}</span></button>
          ))}
        </nav>
        <div className="sidebar-profile"><Avatar small /><div><strong>Darryn Rooza</strong><span>CAM Lead</span></div></div>
      </aside>
    </>
  );
}

type FocusPanelProps = {
  kind: "bc" | "ctv";
  counts: { live: number; middle: number; early: number; inactive: number; total: number; eligible?: number };
  notify: (v: string) => void;
};

function FocusPanel({ kind, counts, notify }: FocusPanelProps) {
  const bc = kind === "bc";
  const actions = bc
    ? [
        ["8:30p", "Business Capital sync — Tony Kuttner", "Task Force Payments · NMI/Parafin BC · Gong call · today", "purple"],
        ["Thu", "Log partner feedback to the GA Launch tab", "Before the BC Omni Success Check-In · Fri Jul 24", "amber"],
        ["9:00p", "Float BC to Alternative Horizons", "Top account · $29.5K MRR · Ism Shovan sync today", "green"],
      ]
    : [
        ["Now", "Unblock CTV re-enrollment on parent moves", "PEX4-134 · Dale Smith (Omni) · hits sub-merchant re-parenting", "red"],
        ["This wk", "Push network-token enablement — Symmetric & Mertzco", "175 + 248 merchants · highest volume in the book", "purple"],
        ["This wk", "Confirm CardEase network-token billing is live", "BIL4-217 · unblocks EU / CardEase partners", "blue"],
      ];
  const denominator = bc ? counts.eligible ?? counts.total : counts.total;
  const motion = counts.live + counts.middle + counts.early;
  const segments = [
    { value: counts.live, className: "live" },
    { value: counts.middle, className: bc ? "enrolling" : "enabling" },
    { value: counts.early, className: bc ? "pitched" : "eligible" },
  ];
  const legend = bc
    ? [["Live", counts.live, "live"], ["Enrolling", counts.middle, "enrolling"], ["Pitched", counts.early, "pitched"], ["Not started", counts.inactive, "inactive"]]
    : [["Live", counts.live, "live"], ["Enabling", counts.middle, "enabling"], ["Eligible", counts.early, "eligible"], ["Not started", counts.inactive, "inactive"]];

  return (
    <article className={`focus-panel card enter ${kind}`}>
      <div className="focus-head">
        <span className="focus-icon"><i /></span>
        <div><h2>{bc ? "Business Capital" : "Customer Token Vault"}</h2><p>{bc ? "NMI / Parafin merchant lending · GA rollout" : "Network tokens · security + auth-rate uplift"}</p></div>
        <span className="status-pill">{bc ? "GA launch" : "In enablement"}</span>
      </div>
      <div className="progress-copy"><span>{bc ? `Adoption across ${denominator} eligible partners` : "Network-token attach across the book"}</span><strong>{motion} of {denominator} {bc ? "engaged" : "in motion"}</strong></div>
      <div className="adoption-bar" aria-label={`${motion} of ${denominator} in motion`}>
        {segments.map((segment) => <i key={segment.className} className={segment.className} style={{ width: `${(segment.value / counts.total) * 100}%` }} />)}
      </div>
      <div className="legend-row">{legend.map(([label, value, className]) => <span key={String(label)}><i className={String(className)} />{label} {value}</span>)}</div>
      <p className="eyebrow">Next actions</p>
      <div className="actions">
        {actions.map(([when, title, meta, tone]) => (
          <button key={title} className="action-row" onClick={() => notify(`${title}`)}>
            <span className={`when ${tone}`}>{when}</span><span><strong>{title}</strong><small>{meta}</small></span>
          </button>
        ))}
      </div>
      <div className="blocker">
        <div><span>!</span><b>{bc ? "Open question" : "Blocker · in dev"}</b></div>
        <p>{bc ? "Commission flow between parent and sub is unclear when the merchant sits under the sub — residuals may bypass the affiliate and route straight to the parent. Confirm before the Task Force call." : "Moving a merchant to a new parent affiliate does not re-enroll the Customer Token Vault in Omni — network tokens drop on re-parenting. Fix is in progress."}</p>
        <small>{bc ? "Raised in #cam-talk and DM to Angela Luu · V shared partial insight" : "PEX4-134 · Dale Smith · ties directly to the BC parent/sub question"}</small>
      </div>
      <div className="signals">
        {(bc ? [
          ["“Omni real-time boosting” one-time pop-up shipping", "Product", "purple"],
          ["BC Starter Loans backend resolved (CRM4-301)", "Eng ✓", "green"],
        ] : [
          ["FDMS DLHost network-token + recurring in testing", "Eng", "purple"],
          ["CardEase billing NT feature branch open (BIL4-217)", "Billing", "blue"],
        ]).map(([text, tag, tone]) => <button key={text} onClick={() => notify(text)}><i className={tone} /><span>{text}</span><b className={tone}>{tag}</b></button>)}
      </div>
    </article>
  );
}

function StageChip({ value, area }: { value: BCStage | CTVStage; area: "bc" | "ctv" }) {
  const slug = value.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  return <span className={`stage-chip ${area} ${slug}`}>{value}</span>;
}

function BookTable({ accounts, preferences, selectAccount }: { accounts: Account[]; preferences: Preferences; selectAccount: (account: Account) => void }) {
  return (
    <article className="card book-card enter">
      <div className="section-head"><h3>Top {preferences.rowCount} book — focus coverage</h3><span>ranked by monthly revenue</span></div>
      <div className="rag-legend"><span>Last touch:</span><span><i className="fresh" />0–{preferences.amberDays - 1}d</span><span><i className="amber" />{preferences.amberDays}–{preferences.redDays - 1}d</span><span><i className="red" />{preferences.redDays}d+ / never</span></div>
      <div className="book-scroll">
        <div className="book-head"><span>Account</span><span>MRR</span><span>Merch</span><span>Last touch</span><span>Bus. Capital</span><span>Token Vault</span></div>
        <div className="book-rows">
          {accounts.map((account) => {
            const band = account.days >= preferences.redDays ? "red" : account.days >= preferences.amberDays ? "amber" : "fresh";
            return (
              <button key={account.name} className={`book-row ${preferences.colorByActivity ? `shade-${band}` : ""}`} onClick={() => selectAccount(account)}>
                <strong title={account.name}>{account.name}</strong><span>{money(account.mrr)}</span><span>{account.merch}</span><span className="last-touch"><i className={band} />{account.days}d</span><span><StageChip value={account.bc} area="bc" /></span><span><StageChip value={account.ctv} area="ctv" /></span>
              </button>
            );
          })}
          {accounts.length === 0 && <div className="empty-state"><Search /><strong>No matching accounts</strong><span>Try changing your search or focus filter.</span></div>}
        </div>
      </div>
      <p className="provenance">Revenue, merchant counts &amp; last-touch are modeled on Salesforce data owned by Darryn Rooza. Row shading and thresholds mirror the Salesforce activity dashboard. Focus-area stages are CAM-tracked, not SFDC fields. Last touch reflects <em>logged</em> activity only.</p>
    </article>
  );
}

const meetings = [
  { day: "Today", time: "8:30p", title: "Business Capital Sync — Tony Kuttner", tone: "bc", tag: "BC", who: "Task Force Payments" },
  { day: "Today", time: "9:00p", title: "NMI & Alternative Horizons — Darryn & Ism", tone: "account", tag: "Account", who: "Top-1 by revenue" },
  { day: "Today", time: "10:00p", title: "CAM — Team Meeting", tone: "internal", tag: "", who: "J. Cox + CAM team" },
  { day: "Wed", time: "12:30a", title: "DH Group Holdings & NMI — Darryn & Colleen", tone: "account", tag: "Account", who: "Solvipay" },
  { day: "Thu", time: "6:00p", title: "Team Pipeline review / discussion", tone: "internal", tag: "", who: "J. Cox" },
  { day: "Fri", time: "4:30p", title: "BC Omni Success Check-In", tone: "bc", tag: "BC", who: "Angela Luu · log to GA tab" },
  { day: "Fri", time: "7:30p", title: "CAM Weekly Meeting — Snake", tone: "internal", tag: "", who: "D. Snakenborg" },
];

function WeekCard({ notify }: { notify: (message: string) => void }) {
  return (
    <article className="card week-card enter">
      <div className="section-head"><h3>This week</h3><span>from your calendar</span></div>
      <div className="meeting-list">
        {meetings.map((meeting) => (
          <button key={`${meeting.day}-${meeting.time}-${meeting.title}`} className="meeting" onClick={() => notify(`${meeting.title} opened`)}>
            <span className="meeting-time"><strong>{meeting.day}</strong><small>{meeting.time}</small></span><i className={`meeting-spine ${meeting.tone}`} /><span className="meeting-copy"><strong>{meeting.title}</strong><small>{meeting.tag && <b className={meeting.tone}>{meeting.tag}</b>}{meeting.who}</small></span><ChevronRight />
          </button>
        ))}
      </div>
      <button className="calendar-button" onClick={() => notify("Calendar view selected")}><CalendarDays />Open full calendar</button>
    </article>
  );
}

function SettingsDialog({ preferences, setPreferences, close }: { preferences: Preferences; setPreferences: (value: Preferences) => void; close: () => void }) {
  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => setPreferences({ ...preferences, [key]: value });
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && close()}>
      <section className="modal settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-head"><div><span>Daily Focus</span><h2 id="settings-title">View settings</h2></div><button onClick={close} aria-label="Close settings"><X /></button></div>
        <div className="setting-group"><label htmlFor="row-count">Accounts shown</label><p>Controls the book, KPIs and adoption funnels.</p><select id="row-count" value={preferences.rowCount} onChange={(event) => update("rowCount", Number(event.target.value) as Preferences["rowCount"])}><option value="20">Top 20</option><option value="30">Top 30</option><option value="50">Top 50</option></select></div>
        <div className="setting-group"><label htmlFor="focus-filter">Filter table by</label><p>Show all partners or only accounts engaged in one focus area.</p><select id="focus-filter" value={preferences.focusFilter} onChange={(event) => update("focusFilter", event.target.value as FocusFilter)}><option>All</option><option>Business Capital</option><option>Customer Token Vault</option></select></div>
        <div className="setting-split"><div className="setting-group"><label htmlFor="amber-days">Amber at</label><div className="number-field"><input id="amber-days" type="number" min="7" max={Math.min(90, preferences.redDays - 1)} value={preferences.amberDays} onChange={(event) => update("amberDays", Math.min(90, preferences.redDays - 1, Math.max(7, Number(event.target.value))))} /><span>days</span></div></div><div className="setting-group"><label htmlFor="red-days">Red at</label><div className="number-field"><input id="red-days" type="number" min={Math.max(30, preferences.amberDays + 1)} max="240" value={preferences.redDays} onChange={(event) => update("redDays", Math.min(240, Math.max(30, preferences.amberDays + 1, Number(event.target.value))))} /><span>days</span></div></div></div>
        <label className="toggle-row"><span><strong>Shade rows by last activity</strong><small>Use red, amber and white activity bands.</small></span><input type="checkbox" checked={preferences.colorByActivity} onChange={(event) => update("colorByActivity", event.target.checked)} /><i /></label>
        <div className="modal-actions"><button className="secondary-button" onClick={() => setPreferences(defaultPreferences)}>Reset defaults</button><button className="primary-button compact" onClick={close}>Done</button></div>
      </section>
    </div>
  );
}

function AccountDialog({ account, close, notify }: { account: Account; close: () => void; notify: (message: string) => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && close()}>
      <section className="modal account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <div className="modal-head"><div><span>Partner detail</span><h2 id="account-title">{account.name}</h2></div><button onClick={close} aria-label="Close partner detail"><X /></button></div>
        <div className="account-stats"><div><span>Monthly revenue</span><strong>{money(account.mrr)}</strong></div><div><span>Active merchants</span><strong>{account.merch}</strong></div><div><span>Last logged touch</span><strong>{account.days} days</strong></div></div>
        <div className="account-focus"><div><span>Business Capital</span><StageChip value={account.bc} area="bc" /></div><div><span>Customer Token Vault</span><StageChip value={account.ctv} area="ctv" /></div></div>
        <div className="account-note"><strong>Account focus</strong><p>{account.days >= 60 ? "This partner is outside the preferred touch window. Re-establish contact and confirm both focus-area stages." : "Activity is current. Use the next interaction to validate the partner’s focus-area stage and capture any new blockers."}</p></div>
        <div className="modal-actions"><button className="secondary-button" onClick={() => notify(`Interaction logged for ${account.name}`)}>Log interaction</button><button className="primary-button compact" onClick={() => notify(`${account.name} opened in Partners`)}>Open partner</button></div>
      </section>
    </div>
  );
}

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cam-focus-preferences");
      if (saved) setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
    } catch { /* retain safe defaults */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("cam-focus-preferences", JSON.stringify(preferences));
  }, [preferences, hydrated]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSettingsOpen(false); setSelectedAccount(null); setNavOpen(false); }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const book = useMemo(() => allAccounts.slice(0, preferences.rowCount), [preferences.rowCount]);
  const derived = useMemo(() => {
    const bcLive = book.filter((a) => a.bc === "Live").length;
    const bcMiddle = book.filter((a) => a.bc === "Enrolling").length;
    const bcEarly = book.filter((a) => a.bc === "Pitched").length;
    const bcNA = book.filter((a) => a.bc === "N/A").length;
    const ctvLive = book.filter((a) => a.ctv === "Live").length;
    const ctvMiddle = book.filter((a) => a.ctv === "Enabling").length;
    const ctvEarly = book.filter((a) => a.ctv === "Eligible").length;
    return {
      mrr: book.reduce((sum, a) => sum + a.mrr, 0),
      stale: book.filter((a) => a.days >= preferences.redDays).length,
      bcFunnel: book.filter((a) => a.bc === "Enrolling" || a.bc === "Pitched").reduce((sum, a) => sum + a.mrr, 0),
      bc: { live: bcLive, middle: bcMiddle, early: bcEarly, inactive: book.length - bcLive - bcMiddle - bcEarly - bcNA, total: book.length, eligible: book.length - bcNA },
      ctv: { live: ctvLive, middle: ctvMiddle, early: ctvEarly, inactive: book.length - ctvLive - ctvMiddle - ctvEarly, total: book.length },
    };
  }, [book, preferences.redDays]);

  const displayedAccounts = useMemo(() => book.filter((account) => {
    const focusMatch = preferences.focusFilter === "All" || (preferences.focusFilter === "Business Capital" ? account.bc !== "Not started" && account.bc !== "N/A" : account.ctv !== "Not started");
    const searchMatch = !query.trim() || account.name.toLowerCase().includes(query.trim().toLowerCase());
    return focusMatch && searchMatch;
  }), [book, preferences.focusFilter, query]);

  return (
    <div className="app-shell">
      <Sidebar open={navOpen} close={() => setNavOpen(false)} notify={notify} />
      <main className="main-shell">
        <header className="topbar">
          <button className="menu-button" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu /></button>
          <label className="search-box"><Search /><input aria-label="Search" placeholder="Search partners, threads, interactions…" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X /></button>}</label>
          <div className="topbar-spacer" />
          <button className="icon-button" onClick={() => notify("You have 4 notifications")} aria-label="Notifications"><Bell /><span>4</span></button>
          <button className="avatar-button" onClick={() => notify("Profile selected")} aria-label="Open profile"><Avatar /></button>
        </header>
        <div className="page-wrap">
          <section className="page-intro enter">
            <p>Tuesday, July 21, 2026</p>
            <div className="title-line"><div><h1>Good morning, Darryn</h1><p>Two focus areas on your plate today — <strong className="success">Business Capital</strong> and <strong className="discovery">Customer Token Vault</strong>. <strong className="warning">{derived.stale} accounts going cold</strong> · <strong className="discovery">3 meetings today</strong>.</p></div><button className="settings-button" onClick={() => setSettingsOpen(true)}><Settings2 />View settings</button></div>
          </section>
          <section className="kpi-grid enter">
            <article className="card kpi"><p>Top-{preferences.rowCount} book · MRR</p><strong>{money(derived.mrr)}</strong><small>monthly recurring · top {preferences.rowCount} accounts</small></article>
            <article className="card kpi bc"><p>Business Capital</p><strong>{derived.bc.live} live · {derived.bc.live + derived.bc.middle + derived.bc.early} engaged</strong><small>{money(derived.bcFunnel)} of book MRR in the funnel</small></article>
            <article className="card kpi ctv"><p>Customer Token Vault</p><strong>{derived.ctv.live} live · {derived.ctv.middle + derived.ctv.early} enabling</strong><small>{derived.ctv.live + derived.ctv.middle + derived.ctv.early} of {preferences.rowCount} accounts in motion</small></article>
            <article className="card kpi attention"><p>Needs attention</p><strong>{derived.stale} going cold</strong><small>{preferences.redDays}+ days since a logged touch</small></article>
          </section>
          <section className="focus-grid"><FocusPanel kind="bc" counts={derived.bc} notify={notify} /><FocusPanel kind="ctv" counts={derived.ctv} notify={notify} /></section>
          <section className="bottom-grid"><BookTable accounts={displayedAccounts} preferences={preferences} selectAccount={setSelectedAccount} /><WeekCard notify={notify} /></section>
        </div>
      </main>
      {settingsOpen && <SettingsDialog preferences={preferences} setPreferences={setPreferences} close={() => setSettingsOpen(false)} />}
      {selectedAccount && <AccountDialog account={selectedAccount} close={() => setSelectedAccount(null)} notify={notify} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
