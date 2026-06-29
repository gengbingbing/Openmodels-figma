import { ArrowRight } from "lucide-react";

const S = {
  sans: "var(--font-sans, 'Geist', system-ui, sans-serif)",
  mono: "var(--font-mono, 'Geist Mono', monospace)",
};
const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";

const badges = [
  "Provider route visibility",
  "No proxy chains",
  "Credit-based billing",
];

const stats = [
  { value: "333",   label: "Models",              accent: false },
  { value: "24+",   label: "Providers",           accent: false },
  { value: "300+",  label: "Community routes",    accent: false },
  { value: "12.4M", label: "Tokens routed daily", accent: true  },
];

interface HeroProps { onGetKey?: () => void }

export function Hero({ onGetKey }: HeroProps = {}) {
  return (
    <div style={{ paddingTop: 84 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>

        {/* ── Hero body: left content + right checkout panel ── */}
        <div className="hero-body" style={{
          display: "flex", alignItems: "flex-end", gap: 48,
          padding: "80px 52px 72px", borderBottom: B,
        }}>

          {/* Left: main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 22 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A", flexShrink: 0, boxShadow: "0 0 0 2px rgba(22,163,74,0.18)" }} />
              <span style={{ fontFamily: S.sans, fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: "0.01em" }}>
                Open provider routes · Transparent pricing · One API
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: S.sans, fontSize: 60, fontWeight: 700,
              letterSpacing: "-0.03em", lineHeight: 1.06,
              color: "#0a0a0a", marginBottom: 20, maxWidth: 700,
            }} className="hero-h1">
              The open marketplace for LLM tokens
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: S.sans, fontSize: 16, color: "#555",
              lineHeight: 1.65, marginBottom: 28, maxWidth: 540,
            }} className="hero-sub">
              Buy LLM tokens across verified and community provider routes with transparent pricing, route visibility, and one OpenAI-compatible API.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
              <button onClick={onGetKey} style={{
                fontFamily: S.sans, display: "inline-flex", alignItems: "center", gap: 7,
                height: 40, padding: "0 18px",
                background: "#111111", color: "#fff", fontSize: 13, fontWeight: 600,
                border: "1px solid #111111", cursor: "pointer", borderRadius: 4,
                transition: "background 120ms",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2A2A2A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#111111")}
              >
                Get API key <ArrowRight size={13} strokeWidth={1.75} />
              </button>
              <a href="#models" style={{
                fontFamily: S.sans, display: "inline-flex", alignItems: "center",
                height: 40, padding: "0 18px",
                background: "#FFFFFF", color: "#444",
                border: B, fontSize: 13, fontWeight: 500, textDecoration: "none",
                borderRadius: 4, transition: "all 120ms",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.borderColor = "#C0C0C0"; e.currentTarget.style.color = "#111"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#e2e2e2"; e.currentTarget.style.color = "#444"; }}
              >
                Explore models
              </a>
            </div>

            {/* Badges — below CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {badges.map((b) => (
                <span key={b} style={{
                  fontFamily: S.sans, fontSize: 12, fontWeight: 500,
                  color: "#666", background: "#F5F5F5", border: B,
                  padding: "3px 10px", borderRadius: 999,
                }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Right: Supported payments — lightweight trust signal */}
          <div className="hero-checkout" style={{ flexShrink: 0 }}>
            <div style={{
              fontFamily: S.sans, fontSize: 10, fontWeight: 600,
              color: "#A3A3A3", letterSpacing: "0.04em",
              textTransform: "uppercase" as const, marginBottom: 8,
            }}>Supported payments</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {["Stripe", "MoonPay", "USDC"].map((name, i) => (
                <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: S.sans, fontSize: 13, color: "#555" }}>{name}</span>
                  {i < 2 && <span style={{ color: "#D0D0D0" }}>·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats bar — ~96px tall ── */}
        <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              minHeight: 96,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 28px",
              borderRight: i < stats.length - 1 ? Bs : "none",
            }}>
              {/* inner: left-aligned content, centered in cell */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{
                  fontFamily: S.mono, fontSize: 26, fontWeight: 700,
                  color: s.accent ? "#0047FF" : "#0a0a0a",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 5,
                }}>{s.value}</div>
                <div style={{ fontFamily: S.sans, fontSize: 12, color: "#777" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-body     { flex-direction: column !important; align-items: flex-start !important; padding: 56px 36px 48px !important; gap: 32px !important; }
          .hero-checkout { width: 100% !important; }
          .hero-h1       { font-size: 44px !important; }
          .hero-sub      { font-size: 15px !important; }
        }
        @media (max-width: 640px) {
          .hero-body  { padding: 40px 20px 36px !important; gap: 28px !important; }
          .hero-h1    { font-size: 32px !important; letter-spacing: -0.02em !important; }
          .hero-sub   { font-size: 14px !important; }
          .hero-stats { grid-template-columns: 1fr 1fr !important; }
          .hero-stats > div { border-right: none !important; border-bottom: 1px solid #eeeeee; }
        }
        @media (max-width: 400px) {
          .hero-h1    { font-size: 26px !important; }
          .hero-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
