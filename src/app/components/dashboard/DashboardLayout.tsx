import { useState, ReactNode } from "react";
import { Key, CreditCard, BarChart2, Zap, Layers, LogOut, Settings, Gift, GitBranch, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { F, D } from "../../lib/type";

const border     = "1px solid #E5E5E5";
const borderSoft = "1px solid #EFEFEF";
const blue       = "#0047FF";

const QL: React.CSSProperties = {
  fontFamily:    "var(--font-sans, 'Geist', system-ui, sans-serif)",
  fontSize:      D.label,
  fontWeight:    500,
  color:         "#A3A3A3",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const SIDEBAR_W = 240;
const HEADER_H  = 56;

const nav = [
  { id: "api-keys",   label: "API Keys",   Icon: Key },
  { id: "credits",    label: "Credits",    Icon: CreditCard },
  { id: "usage",      label: "Usage",      Icon: BarChart2 },
  { id: "quickstart", label: "Quickstart", Icon: Zap },
  { id: "models",     label: "Models",     Icon: Layers },
  { id: "routes",     label: "Routes",     Icon: GitBranch },
  { id: "referral",   label: "Referral",   Icon: Gift, badge: "$5" },
];

interface Props { activePage: string; onNavigate: (p: string) => void; onBack: () => void; children: ReactNode }

export function DashboardLayout({ activePage, onNavigate, onBack, children }: Props) {
  const activeLabel = nav.find((n) => n.id === activePage)?.label ?? "";
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileMenu(false);
  };

  const Sidebar = () => (
    <aside style={{
      width: SIDEBAR_W, background: "#FAFAFA", borderRight: border,
      display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
      height: "100%",
    }}>
      {/* Balance widget */}
      <div style={{ padding: "14px 16px", borderBottom: border }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={QL}>Balance</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: F.sans, fontSize: D.label, fontWeight: 500,
            color: "#008A3D", background: "#F0FDF4", border: "1px solid #BBF7D0",
            padding: "0 7px", height: 18, borderRadius: 999,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#12B76A", flexShrink: 0 }} />
            Active
          </span>
        </div>
        <div style={{
          fontFamily: F.sans, fontSize: D.numLg, fontWeight: 600,
          color: "#111", letterSpacing: 0, lineHeight: 1, fontVariantNumeric: "tabular-nums",
        }}>$42.30</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <div style={{ flex: 1, height: 2, background: "#EFEFEF", borderRadius: 1 }}>
            <div style={{ height: "100%", width: "21%", background: blue, borderRadius: 1 }} />
          </div>
          <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", fontVariantNumeric: "tabular-nums" }}>21%</span>
        </div>
        <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 3 }}>of $200 monthly limit</div>
        <button style={{
          width: "100%", marginTop: 10,
          fontFamily: F.sans, fontSize: 12, fontWeight: 600,
          color: "#fff", background: blue, border: "none",
          height: 30, borderRadius: 6, cursor: "pointer", transition: "opacity 120ms",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >Add credits</button>
      </div>

      <div style={{ padding: "12px 16px 4px", ...QL }}>Menu</div>

      <nav style={{ padding: "0 8px 8px", flex: 1 }}>
        {nav.map(({ id, label, Icon, badge }) => {
          const active = activePage === id;
          return (
            <button key={id} onClick={() => handleNavigate(id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "0 10px", height: 34, marginBottom: 1,
              background: active ? "#EAF1FF" : "transparent",
              border: "none", borderRadius: 6,
              borderLeft: `2px solid ${active ? blue : "transparent"}`,
              cursor: "pointer", textAlign: "left",
              transition: "background 80ms, color 80ms",
              color: active ? blue : "#555",
            }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#F0F0F0"; e.currentTarget.style.color = "#111"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}
            >
              <Icon size={14} strokeWidth={active ? 1.75 : 1.5} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: active ? 500 : 400 }}>{label}</span>
              {badge && !active && (
                <span style={{
                  marginLeft: "auto", fontFamily: F.sans, fontSize: D.label, fontWeight: 500,
                  color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0",
                  padding: "1px 5px", borderRadius: 999,
                }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ borderTop: borderSoft, margin: "0 8px" }} />

      <div style={{ padding: "6px 8px 12px" }}>
        {[
          { label: "Settings", Icon: Settings, action: () => handleNavigate("settings") },
          { label: "Sign out", Icon: LogOut,   action: () => {} },
        ].map(({ label, Icon, action }) => (
          <button key={label} onClick={action} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "0 10px", height: 34,
            background: "none", border: "none", borderRadius: 6,
            cursor: "pointer", color: "#B0B0B0", fontFamily: F.sans, fontSize: D.body,
            transition: "background 80ms, color 80ms",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F0F0F0"; e.currentTarget.style.color = "#444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#B0B0B0"; }}
          >
            <Icon size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F7F7F7", fontFamily: F.sans, overflow: "hidden" }}>

      {/* ─── Header ─── */}
      <header style={{
        height: HEADER_H, background: "#FFFFFF", borderBottom: border,
        display: "flex", alignItems: "center", flexShrink: 0, zIndex: 20,
      }}>
        {/* Logo zone — desktop: fixed width, mobile: auto */}
        <div className="dash-logo-zone" style={{
          width: SIDEBAR_W, height: "100%", borderRight: border,
          display: "flex", alignItems: "center", padding: "0 18px", flexShrink: 0, gap: 8,
        }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", padding: 4,
            color: "#C0C0C0", borderRadius: 4, transition: "color 100ms, background 100ms",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#111"; e.currentTarget.style.background = "#F0F0F0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#C0C0C0"; e.currentTarget.style.background = "none"; }}
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
          <span style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, letterSpacing: "-0.02em", color: "#111" }}>
            <span style={{ color: blue }}>Open</span>Models
          </span>
        </div>

        {/* Breadcrumb */}
        <div style={{ flex: 1, padding: "0 20px", display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
          <span className="dash-breadcrumb-prefix" style={{ fontFamily: F.sans, fontSize: D.body, color: "#B0B0B0", whiteSpace: "nowrap" }}>Dashboard</span>
          <ChevronRight size={11} color="#D5D5D5" className="dash-breadcrumb-prefix" />
          <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activeLabel}</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="dash-menu-btn"
          onClick={() => setMobileMenu((v) => !v)}
          style={{
            display: "none", background: "none", border: "none", cursor: "pointer",
            padding: "0 18px", height: "100%", color: "#555",
            alignItems: "center", borderLeft: border, flexShrink: 0,
          }}
        >
          {mobileMenu ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* User — hidden on mobile */}
        <div className="dash-user" style={{
          height: "100%", borderLeft: border,
          display: "flex", alignItems: "center", padding: "0 18px", gap: 9,
          cursor: "pointer", transition: "background 100ms", flexShrink: 0,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F7F7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 26, height: 26, borderRadius: "50%", background: "#111",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#fff" }}>T</span>
          </div>
          <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#555" }}>team@example.com</span>
        </div>
      </header>

      {/* ─── Body ─── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* Mobile backdrop */}
        {mobileMenu && (
          <div
            onClick={() => setMobileMenu(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 38,
              background: "rgba(0,0,0,0.2)",
              top: HEADER_H,
            }}
          />
        )}

        {/* ─── Sidebar — desktop: normal flow, mobile: fixed overlay ─── */}
        <div className={`dash-sidebar${mobileMenu ? " dash-sidebar-open" : ""}`} style={{ display: "flex", flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* ─── Main content ─── */}
        <main style={{ flex: 1, overflowY: "auto", background: "#F7F7F7", minWidth: 0 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          /* Logo zone: no fixed width, no right border */
          .dash-logo-zone {
            width: auto !important;
            border-right: none !important;
            padding: 0 14px !important;
          }
          /* Hide desktop breadcrumb "Dashboard /" prefix */
          .dash-breadcrumb-prefix { display: none !important; }
          /* Show hamburger */
          .dash-menu-btn { display: flex !important; }
          /* Hide email/avatar */
          .dash-user { display: none !important; }

          /* Sidebar becomes fixed overlay, hidden by default */
          .dash-sidebar {
            position: fixed !important;
            top: ${HEADER_H}px !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 39 !important;
            transform: translateX(-100%);
            transition: transform 220ms cubic-bezier(0.22,1,0.36,1);
            box-shadow: 4px 0 24px rgba(0,0,0,0.08);
          }
          .dash-sidebar-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  );
}
