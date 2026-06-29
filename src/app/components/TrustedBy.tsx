import { T, F, WS } from "../lib/type";

const B = "1px solid #e2e2e2";

const quotes = [
  {
    text: "OpenModels makes open-source model access predictable. We can compare prices, top up credits, and route requests with one API key.",
    team: "AI application team",
    role: "Production inference",
  },
  {
    text: "The biggest value is transparency. We know the token price, supply status, and verified route before sending traffic.",
    team: "Developer tools team",
    role: "Model API integration",
  },
  {
    text: "We moved away from unstable proxy routes and started using verified LLM token supply with clearer billing.",
    team: "Agent startup",
    role: "Open-source LLM usage",
  },
];

export function TrustedBy() {
  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#0047FF", letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>TRUSTED BY BUILDERS</span>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 8 }}>
            Teams use OpenModels to lower LLM token costs
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, marginBottom: 16, maxWidth: 560 }}>
            Developers and AI teams use OpenModels to buy verified LLM token supply with transparent pricing, prepaid credits, and one API key.
          </p>
          {/* Proof chips — inline in header, no extra divider */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["AI application teams", "Agent builders", "Developer tools teams", "Production inference"].map((chip) => (
              <span key={chip} style={{
                fontFamily: F.sans, fontSize: 10, fontWeight: 500,
                color: "#666", background: "#F5F5F5", border: "1px solid #E5E5E5",
                padding: "3px 10px", borderRadius: 999,
              }}>{chip}</span>
            ))}
          </div>
        </div>

        {/* Quote cards */}
        <div className="trusted-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {quotes.map((q, i) => (
            <div key={i} style={{
              padding: "24px 24px",
              borderRight: i < quotes.length - 1 ? "1px solid #eeeeee" : "none",
              display: "flex", flexDirection: "column", gap: 0,
            }}>
              {/* Quote mark */}
              <div style={{ fontFamily: F.sans, fontSize: 28, color: "#e5e5e5", lineHeight: 1, marginBottom: 12, fontWeight: 700 }}>"</div>
              <p style={{ fontFamily: F.sans, fontSize: 13, color: "#444", lineHeight: 1.75, margin: "0 0 20px", flex: 1 }}>
                {q.text}
              </p>
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                <div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 2 }}>{q.team}</div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: "#aaa" }}>{q.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .trusted-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) {
          .trusted-grid { grid-template-columns: 1fr !important; }
          .trusted-grid > * { border-right: none !important; border-bottom: 1px solid #eeeeee; }
          .trusted-header { padding: 24px 16px 20px !important; }
        }
      `}</style>
    </section>
  );
}
