import { useNavigate } from "react-router";
import { Building2, ChevronLeft } from "lucide-react";
import { SEO } from "../lib/seo";
import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

const S = { sans: "var(--font-sans, 'Geist', system-ui, sans-serif)" };

const positioningItems = [
  "Open marketplace for LLM tokens",
  "Verified provider supply",
  "Transparent input and output token pricing",
  "No opaque proxy chains",
  "One API key for supported models and routes",
];

const companyInfo = [
  { label: "Company",      value: "Alephant AI LLC",           href: null },
  { label: "Product",      value: "OpenModels",                 href: null },
  { label: "Website",      value: "openmodels.market",          href: "https://openmodels.market" },
  { label: "API Base URL", value: "api.getopenmodels.com/v1",   href: null, mono: true },
];

export function CompanyPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: S.sans }}>
      <SEO
        title="Company | OpenModels"
        description="OpenModels is operated by Alephant AI LLC, building an open marketplace for LLM tokens with verified supply, transparent pricing, and one API for developers."
        path="/company"
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
            <Building2 size={11} color={blue} strokeWidth={2} />
            <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em" }}>COMPANY</span>
          </span>
          <h1 style={{ fontFamily: S.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 14, letterSpacing: 0, lineHeight: 1.2 }}>
            Company
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            OpenModels is operated by Alephant AI LLC, building an open marketplace for LLM tokens with verified supply, transparent pricing, and one API for developers.
          </p>
        </div>

        {/* What OpenModels does */}
        <div style={{ padding: "32px 32px 28px", borderBottom: B }}>
          <h2 style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#0a0a0a", marginBottom: 14, letterSpacing: "-0.01em" }}>
            What OpenModels does
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 600 }}>
            <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.7, margin: 0 }}>
              OpenModels gives developers access to verified LLM token supply through one OpenAI-compatible API.
            </p>
            <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.7, margin: 0 }}>
              We focus on transparent token pricing, reliable provider routes, prepaid credits, and usage visibility.
            </p>
          </div>
        </div>

        {/* Positioning */}
        <div style={{ padding: "32px 32px 28px", borderBottom: B }}>
          <h2 style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#0a0a0a", marginBottom: 16, letterSpacing: "-0.01em" }}>
            Our positioning
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {positioningItems.map((item, i) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < positioningItems.length - 1 ? Bs : "none" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A", flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#333" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Company information */}
        <div style={{ padding: "32px 32px 48px" }}>
          <h2 style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#0a0a0a", marginBottom: 16, letterSpacing: "-0.01em" }}>
            Company information
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {companyInfo.map((row, i) => (
              <div key={row.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "12px 0", borderBottom: i < companyInfo.length - 1 ? Bs : "none", alignItems: "center" }}>
                <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                  {row.label}
                </span>
                {row.href ? (
                  <a href={row.href} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: (row as any).mono ? F.mono : S.sans, fontSize: WS.body, color: "#333", textDecoration: "none", transition: "color 100ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = blue)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                  >{row.value}</a>
                ) : (
                  <span style={{ fontFamily: (row as any).mono ? F.mono : S.sans, fontSize: WS.body, color: "#333" }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
