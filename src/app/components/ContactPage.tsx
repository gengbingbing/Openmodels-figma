import { useNavigate } from "react-router";
import { Mail, Send, MessageSquare, Building2, ChevronLeft, AtSign } from "lucide-react";
import { SEO } from "../lib/seo";
import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

const S = { sans: "var(--font-sans, 'Geist', system-ui, sans-serif)" };

const contactRows = [
  { Icon: Mail,          label: "Email",    value: "support@openmodels.market", href: "mailto:support@openmodels.market", mono: false },
  { Icon: Send,          label: "Telegram", value: "t.me/openmodels",            href: "https://t.me/openmodels",          mono: false },
  { Icon: MessageSquare, label: "Discord",  value: "discord.gg/openmodels",      href: "https://discord.gg/openmodels",    mono: false },
  { Icon: Building2,     label: "Company",  value: "Alephant AI LLC",            href: null,                               mono: false },
];

export function ContactPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: S.sans }}>
      <SEO
        title="Contact | OpenModels"
        description="Contact the OpenModels team by email, Telegram, or Discord. For API, billing, account, or partnership questions."
        path="/contact"
      />

      {/* Back nav */}
      <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>
        <div style={{ padding: "12px 28px", borderBottom: B }}>
          <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontFamily: S.sans, fontSize: 13, color: "#888", padding: 0, transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            <ChevronLeft size={13} strokeWidth={1.5} />
            OpenModels
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

        {/* Header */}
        <div style={{ padding: "48px 32px 36px", borderBottom: B }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
            <AtSign size={11} color={blue} strokeWidth={2} />
            <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em" }}>CONTACT</span>
          </span>
          <h1 style={{ fontFamily: S.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 14, letterSpacing: 0, lineHeight: 1.2 }}>
            Contact
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
            Questions about OpenModels, billing, credits, API access, provider routes, or partnerships? Contact the team.
          </p>
        </div>

        {/* Contact options */}
        <div style={{ borderBottom: B }}>
          {contactRows.map((row, i) => (
            <div key={row.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "18px 32px", borderBottom: i < contactRows.length - 1 ? Bs : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <row.Icon size={13} color="#A3A3A3" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                  {row.label}
                </span>
              </div>
              {row.href ? (
                <a href={row.href}
                  style={{ fontFamily: S.sans, fontSize: WS.body, color: "#333", textDecoration: "none", transition: "color 100ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = blue)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                >{row.value}</a>
              ) : (
                <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#333" }}>{row.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{ padding: "28px 32px 48px" }}>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#888", lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
            For account, payment, API, or provider-route questions, please include your account email and a short description so we can respond faster.
          </p>
        </div>
      </div>
    </div>
  );
}
