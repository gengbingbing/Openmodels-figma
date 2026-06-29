import { useState } from "react";
import { WS } from "../lib/type";

const S = {
  sans: "var(--font-sans, 'Geist', system-ui, sans-serif)",
  mono: "var(--font-mono, 'Geist Mono', monospace)",
};
const B = "1px solid #e2e2e2";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Product:     [{ label: "Models", href: "/models" }, { label: "Plans", href: "/plans" }, { label: "Docs", href: "/docs" }, { label: "x402", href: "/x402" }],
  Marketplace: [{ label: "All models", href: "/models" }, { label: "Pricing", href: "/models" }, { label: "x402 Endpoints", href: "/x402" }, { label: "Partner Program", href: "/partners" }, { label: "Become a provider", href: "/provider-console" }],
  Company:     [{ label: "Company", href: "/company" }, { label: "Contact", href: "/contact" }],
  Legal:       [{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }, { label: "Data Policy", href: "/data-policy" }],
};

interface FooterProps { onGetKey?: () => void }

export function Footer({ onGetKey }: FooterProps = {}) {
  const [lang, setLang] = useState("English");

  return (
    <footer style={{ background: "#ffffff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B, borderTop: B }}>

        {/* CTA strip */}
        <div className="footer-cta" style={{
          padding: "40px 28px", borderBottom: B,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 20,
        }}>
          <div>
            <h3 style={{ fontFamily: S.sans, fontSize: 14, fontWeight: 700, letterSpacing: "-0.03em", color: "#0a0a0a", marginBottom: 6 }}>
              Ready to access verified LLM token supply?
            </h3>
            <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#888888", lineHeight: 1.6 }}>
              Verified supply, transparent pricing, one OpenAI-compatible API.
            </p>
          </div>
          <button
            onClick={onGetKey}
            style={{
              fontFamily: S.sans, fontSize: 14, fontWeight: 600,
              color: "#ffffff", background: "#111111",
              border: "none", padding: "11px 24px",
              cursor: "pointer", transition: "background 150ms ease",
              whiteSpace: "nowrap", letterSpacing: "-0.01em",
              borderRadius: 6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1f1f1f")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#111111")}
          >
            Get API key →
          </button>
        </div>

        {/* Links */}
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "36px 28px", borderBottom: B, gap: 24 }}>
          <div>
            <div style={{ fontFamily: S.sans, fontSize: 14, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em", marginBottom: 10 }}>
              <span style={{ color: "#0047FF" }}>Open</span>Models
            </div>
            <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#aaaaaa", lineHeight: 1.65, maxWidth: 200 }}>
              Open marketplace for LLM tokens.
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
              {["GitHub", "X"].map((s) => (
                <a key={s} href="#" style={{
                  fontFamily: S.sans, fontSize: 12, color: "#aaaaaa",
                  textDecoration: "none", border: B, padding: "4px 10px",
                  transition: "all 100ms ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.color = "#555"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e2e2"; e.currentTarget.style.color = "#aaaaaa"; }}
                >{s}</a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#444444", letterSpacing: "0.04em", marginBottom: 14 }}>
                {cat.toUpperCase()}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} style={{ fontFamily: S.sans, fontSize: WS.body, color: "#aaaaaa", textDecoration: "none", transition: "color 100ms ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#333333")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#aaaaaa")}
                    >{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="footer-bottom" style={{ padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontFamily: S.sans, fontSize: 12, color: "#cccccc" }}>OpenModels is operated by Alephant AI LLC. Powered by alephant.io.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: S.sans, fontSize: 11, color: "#666", letterSpacing: "0.04em" }}>Language</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                fontFamily: S.sans, fontSize: 12, color: "#cccccc",
                background: "transparent", border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 2, height: 30, padding: "0 8px",
                cursor: "pointer", outline: "none",
                appearance: "auto",
                transition: "border-color 120ms, color 120ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.36)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "#cccccc"; }}
            >
              {["English", "Chinese", "Japanese", "Arabic"].map((l) => (
                <option key={l} value={l} style={{ background: "#111", color: "#eee" }}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-cta { padding: 28px 20px !important; flex-direction: column; align-items: flex-start !important; }
          .footer-bottom { flex-direction: column; align-items: flex-start !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-grid { padding: 28px 16px !important; }
        }
      `}</style>
    </footer>
  );
}
