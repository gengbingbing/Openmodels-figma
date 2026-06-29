import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

const verifiedPoints = [
  "Reviewed for production usage",
  "Shown by default for lowest-price routing",
  "Listed with provider identity and route details",
];

const communityPoints = [
  "Fast onboarding for community providers",
  "Visible in model detail pages",
  "Available when users opt into community supply",
];

export function ProviderNetwork() {
  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>
            PROVIDER NETWORK
          </span>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 6 }}>
            Verified and community provider routes
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
            OpenModels separates reviewed provider routes from community-submitted routes, so users can choose the trust level before sending traffic.
          </p>
        </div>

        {/* Two columns */}
        <div className="pn-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

          {/* Verified */}
          <div style={{ padding: "28px 32px", borderRight: Bs }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#2563EB", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 999, padding: "2px 8px" }}>
                Verified routes
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {verifiedPoints.map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#2563EB", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555", lineHeight: 1.55 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community */}
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#92400E", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 999, padding: "2px 8px" }}>
                Community routes
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {communityPoints.map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D97706", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555", lineHeight: 1.55 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Provider CTA */}
        <div style={{ padding: "16px 32px", borderTop: B }}>
          <a
            href="/providers/apply"
            style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "opacity 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Become a provider →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .pn-grid { grid-template-columns: 1fr !important; }
          .pn-grid > div:first-child { border-right: none !important; border-bottom: 1px solid #eeeeee; }
        }
      `}</style>
    </section>
  );
}
