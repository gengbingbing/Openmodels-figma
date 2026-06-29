import { Activity } from "lucide-react";
import { T, F } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #f0f0f0";

type StatusType = "Operational" | "Degraded" | "Down";
const statusPill: Record<StatusType, { bg: string; border: string; text: string; dot: string }> = {
  Operational: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#16A34A" },
  Degraded:    { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#D97706" },
  Down:        { bg: "#FEF2F2", border: "#FECACA", text: "#B91C1C", dot: "#DC2626" },
};

function StatusPill({ status }: { status: string }) {
  const s = statusPill[status as StatusType] ?? statusPill.Operational;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 999, padding: "2px 8px",
      fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: s.text,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0, display: "inline-block" }} />
      {status}
    </span>
  );
}

const rows = [
  { model: "Llama 3.1 70B", id: "llama-3.1-70b", supply: "Direct",   availability: "99.9%", latency: "820ms",  status: "Operational" },
  { model: "Qwen 2.5 72B",  id: "qwen-2.5-72b",  supply: "Verified", availability: "99.8%", latency: "760ms",  status: "Operational" },
  { model: "DeepSeek V3",   id: "deepseek-v3",    supply: "Direct",   availability: "99.7%", latency: "910ms",  status: "Operational" },
  { model: "Mistral Large", id: "mistral-large",  supply: "Verified", availability: "99.6%", latency: "880ms",  status: "Operational" },
  { model: "Gemma 2 27B",   id: "gemma-2-27b",    supply: "Verified", availability: "99.5%", latency: "640ms",  status: "Operational" },
  { model: "DeepSeek R1",   id: "deepseek-r1",    supply: "Direct",   availability: "99.2%", latency: "1240ms", status: "Degraded"    },
];

export function StatusSection() {
  return (
    <section id="status">
      <div style={{ maxWidth: 960, margin: "0 auto", borderLeft: B, borderRight: B, borderTop: B }}>
        {/* Header */}
        <div style={{ padding: "32px 28px 22px", borderBottom: B, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <Activity size={11} color="#0047FF" strokeWidth={2} />
              <span style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#0047FF", letterSpacing: "0.1em" }}>RELIABILITY</span>
            </span>
            <h2 style={{ fontFamily: F.sans, fontSize: T.lg, fontWeight: 700, letterSpacing: "-0.035em", color: "#0a0a0a", marginBottom: 8 }}>Know what's available before you buy</h2>
            <p style={{ fontFamily: F.sans, fontSize: T.sm, color: "#666" }}>Track model availability, supply status, and uptime before routing production traffic.</p>
          </div>
          <a href="#" style={{ fontFamily: F.sans, fontSize: T.sm, color: "#555", textDecoration: "none", border: B, padding: "7px 14px", transition: "border-color 100ms", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
          >View full status →</a>
        </div>

        {/* Live indicator bar */}
        <div style={{ padding: "9px 28px", borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f7f7f7", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#16A34A",
              boxShadow: "0 0 0 2px rgba(22,163,74,0.18)", flexShrink: 0, display: "inline-block",
            }} />
            <span style={{ fontFamily: F.sans, fontSize: T.sm, color: "#444" }}>All systems operational</span>
          </div>
          <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#aaa" }}>Last updated 2 min ago · Monitored continuously</span>
        </div>

        {/* Table header */}
        <div className="status-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 80px 110px 80px 120px", padding: "8px 28px", background: "#f3f3f3", borderBottom: B }}>
          {["Model", "Model ID", "Supply", "Availability", "Latency", "Status"].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: "#9a9a9a", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {rows.map((row, i) => (
          <div key={row.id} className="status-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 80px 110px 80px 120px", padding: "10px 28px", borderBottom: i < rows.length - 1 ? Bs : "none", alignItems: "center", transition: "background 80ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 500, color: "#0a0a0a" }}>{row.model}</span>
            <span style={{ fontFamily: F.mono, fontSize: T.xs, color: "#aaaaaa" }}>{row.id}</span>
            <span style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 500, color: row.supply === "Direct" ? "#15803D" : "#1D4ED8" }}>{row.supply}</span>
            <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#333" }}>{row.availability}</span>
            <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#777" }}>{row.latency}</span>
            <StatusPill status={row.status} />
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .status-row { grid-template-columns: 1fr 80px 90px 100px !important; }
          .status-row > *:nth-child(2), .status-row > *:nth-child(5) { display: none; }
        }
      `}</style>
    </section>
  );
}
