import { F, WS } from "../lib/type";

const B  = "1px solid #E5E5E5";
const BS = "1px solid #EFEFEF";

const rows = [
  { model: "glm-5.2",        rank: "#1", requests: "512K", tokens: "224M", route: "Z.ai",        trend: "+24%" },
  { model: "deepseek-v3",    rank: "#2", requests: "428K", tokens: "186M", route: "DeepSeek",    trend: "+18%" },
  { model: "qwen-2.5-72b",  rank: "#3", requests: "351K", tokens: "142M", route: "Novita",      trend: "+14%" },
  { model: "llama-3.1-70b", rank: "#4", requests: "286K", tokens: "118M", route: "Together AI", trend: "+9%"  },
  { model: "deepseek-r1",   rank: "#5", requests: "214K", tokens: "96M",  route: "DeepSeek",    trend: "+22%" },
];

export function Leaderboard() {
  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Section header — mirrors Marketplace */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#0047FF", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>LEADERBOARD</span>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#111", marginBottom: 8 }}>
            Most used models on OpenModels
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: 0 }}>
            See which models are being used most across OpenModels.
          </p>
        </div>

        {/* Summary bar — mirrors Marketplace summary bar */}
        <div style={{ padding: "9px 32px", background: "#FAFAFA", borderBottom: B, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 600, color: "#333" }}>1.84M</span>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: "#888" }}>total requests</span>
          <span style={{ color: "#ccc", margin: "0 4px" }}>·</span>
          <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 600, color: "#333" }}>642M</span>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: "#888" }}>tokens processed</span>
          <span style={{ color: "#ccc", margin: "0 4px" }}>·</span>
          <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 600, color: "#333" }}>18</span>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: "#888" }}>active models</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr style={{ background: "#FAFAFA" }}>
                {["Model", "Requests", "Tokens", "Top route", "Trend"].map((h) => (
                  <th key={h} style={{
                    fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: "#A3A3A3",
                    textTransform: "uppercase", letterSpacing: "0.04em",
                    padding: "12px 24px", textAlign: "left", borderBottom: B,
                    whiteSpace: "nowrap", height: 44,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.model} style={{ borderBottom: i < rows.length - 1 ? BS : "none", transition: "background 80ms", height: 64 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "0 24px", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                    <span style={{ fontFamily: F.mono, fontSize: 12, color: "#C0C0C0", fontWeight: 400, marginRight: 8 }}>{row.rank}</span>
                    <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#111", fontWeight: 600 }}>{row.model}</span>
                  </td>
                  <td style={{ padding: "0 24px", fontFamily: F.mono, fontSize: WS.body, color: "#333", fontVariantNumeric: "tabular-nums", verticalAlign: "middle" }}>{row.requests}</td>
                  <td style={{ padding: "0 24px", fontFamily: F.mono, fontSize: WS.body, color: "#555", fontVariantNumeric: "tabular-nums", verticalAlign: "middle" }}>{row.tokens}</td>
                  <td style={{ padding: "0 24px", fontFamily: F.sans, fontSize: WS.body, color: "#888", verticalAlign: "middle" }}>{row.route}</td>
                  <td style={{ padding: "0 24px", fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: "#16A34A", textAlign: "right", verticalAlign: "middle" }}>{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "11px 32px", borderTop: B, background: "#FAFAFA" }}>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: "#A3A3A3" }}>
            Sample usage data shown for preview.
          </span>
        </div>

      </div>
    </section>
  );
}
