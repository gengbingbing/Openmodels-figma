import { useState } from "react";
import { Menu, X } from "lucide-react";

const S = {
  sans: "var(--font-sans, 'Geist', system-ui, sans-serif)",
  mono: "var(--font-mono, 'Geist Mono', monospace)",
};

interface HeaderProps { onDashboard?: () => void }

export function Header({ onDashboard }: HeaderProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home",   href: "/",       badge: null },
    { label: "Models", href: "/models", badge: null },
    { label: "x402",   href: "/x402",   badge: null },
    { label: "Plans",  href: "/plans",  badge: null },
    { label: "Docs",   href: "/docs",   badge: null },
  ];

  return (
    <>
    <header style={{
      position: "fixed", top: 36, left: 0, right: 0, zIndex: 50,
      height: 48, borderBottom: "1px solid #e2e2e2",
      background: "rgba(250,250,250,0.86)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto", height: "100%",
        display: "flex", alignItems: "center",
        borderLeft: "1px solid #e2e2e2", borderRight: "1px solid #e2e2e2",
      }}>
        {/* Logo */}
        <a href="#" style={{
          display: "flex", alignItems: "center", textDecoration: "none",
          padding: "0 20px", height: "100%", borderRight: "1px solid #e2e2e2",
        }}>
          <span style={{ fontFamily: S.sans, fontSize: 14, fontWeight: 700, color: "#111111", letterSpacing: "-0.03em" }}>
            <span style={{ color: "#0047FF" }}>Open</span>Models
          </span>
        </a>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", height: "100%", flex: 1 }} className="nav-desktop">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} style={{
              fontFamily: S.sans, fontSize: 14, color: "#777777",
              textDecoration: "none", padding: "0 14px", height: "100%",
              display: "flex", alignItems: "center", gap: 5, transition: "color 120ms ease",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#777777")}
            >
              {link.label}
              {link.badge && (
                <span style={{
                  fontFamily: S.sans, fontSize: 10, fontWeight: 700,
                  color: "#0047FF", border: "1px solid #0047FF",
                  padding: "1px 4px", letterSpacing: "0.06em", lineHeight: 1.4,
                }}>{link.badge}</span>
              )}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", height: "100%", marginLeft: "auto" }}>
          <a href="#" className="nav-desktop" style={{
            fontFamily: S.sans, fontSize: 14, color: "#777777", textDecoration: "none",
            padding: "0 16px", height: "100%", display: "flex", alignItems: "center",
            borderLeft: "1px solid #e2e2e2", transition: "color 120ms ease",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#777777")}
          >Sign in</a>

          <button
            onClick={onDashboard}
            className="header-cta"
            style={{
              fontFamily: S.sans, fontSize: 13, fontWeight: 600,
              color: "#ffffff", background: "#111111",
              padding: "0 22px", height: "100%",
              border: "none", borderLeft: "1px solid #111111",
              cursor: "pointer", transition: "background 150ms ease",
              whiteSpace: "nowrap", borderRadius: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#222222")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#111111")}
          >Get API key</button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-mobile-btn"
            style={{
              display: "none", background: "none", border: "none",
              borderLeft: "1px solid #e2e2e2", cursor: "pointer",
              padding: "0 16px", height: "100%", color: "#555555", alignItems: "center",
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ background: "rgba(250,250,250,0.97)", borderBottom: "1px solid #e2e2e2" }}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "12px 20px", fontFamily: S.sans, fontSize: 14, color: "#333333", textDecoration: "none", borderBottom: "1px solid #eeeeee" }}>
              {link.label}
            </a>
          ))}
          <div style={{ padding: "12px 20px" }}>
            <button onClick={onDashboard} style={{
              display: "block", width: "100%", textAlign: "center", padding: "10px",
              fontFamily: S.sans, fontSize: 14, fontWeight: 600,
              background: "#111111", color: "#ffffff", border: "none", cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
            }}>
              Get API key
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          /* Hide header CTA — accessible via mobile menu */
          .header-cta { display: none !important; }
        }
        @media (max-width: 540px) {
          .banner-extra { display: none !important; }
          /* Banner becomes single compact line */
          .launch-banner { gap: 8px !important; padding: 0 12px !important; }
          .banner-cta { display: none !important; }
        }
      `}</style>
    </header>

    {/* Launch notice — light blue info bar */}
    <div className="launch-banner" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
      minHeight: 36, background: "#F4F7FF", borderBottom: "1px solid #DCE6FF",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 12, padding: "0 16px", flexWrap: "wrap",
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontFamily: S.sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          color: "#0047FF", background: "#EAF1FF", border: "1px solid #BFD2FF",
          padding: "1px 6px", flexShrink: 0,
        }}>LAUNCH</span>
        <span style={{ fontFamily: S.sans, fontSize: 12, color: "#222" }}>
          Deposit{" "}
          <span style={{ fontFamily: S.mono, fontWeight: 600, color: "#222" }}>$10</span>
          , get{" "}
          <span style={{ fontFamily: S.mono, fontWeight: 600, color: "#0047FF" }}>$10 credits</span>
          <span className="banner-extra"> · verified LLM tokens</span>
        </span>
      </span>
      <a className="banner-cta" href="#" style={{
        fontFamily: S.sans, fontSize: 12, fontWeight: 600,
        color: "#0047FF", textDecoration: "none",
        border: "1px solid #0047FF", padding: "2px 10px",
        transition: "opacity 120ms", flexShrink: 0,
      }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >Claim →</a>
    </div>
    </>
  );
}
