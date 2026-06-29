import { Layers } from "lucide-react";
import { T, F } from "../lib/type";
const B = "1px solid #e2e2e2";

const cases = [
  { label: "AI coding tools",       desc: "Autocomplete, code review, and generation pipelines" },
  { label: "Agent workflows",       desc: "Multi-step reasoning and tool-use pipelines" },
  { label: "Customer support",      desc: "Automated triage and first-line response bots" },
  { label: "Internal copilots",     desc: "Search, summarization, and knowledge retrieval" },
  { label: "Data extraction",       desc: "Structured output from documents and web pages" },
  { label: "Research & evaluation", desc: "Model comparison, benchmarking, prompt testing" },
];

export function UseCases() {
  return (
    <section>
      <div style={{ maxWidth: 960, margin: "0 auto", borderLeft: B, borderRight: B, borderTop: B }}>
        <div style={{ padding: "32px 28px 22px", borderBottom: B }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <Layers size={11} color="#0047FF" strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#0047FF", letterSpacing: "0.1em" }}>USE CASES</span>
          </span>
          <h2 style={{ fontFamily: F.sans, fontSize: T.lg, fontWeight: 700, letterSpacing: "-0.035em", color: "#0a0a0a" }}>Built for high-volume open model usage</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }} className="use-grid">
          {cases.map((uc, i) => (
            <div key={uc.label} style={{ padding: "22px 28px", borderRight: i % 3 !== 2 ? B : "none", borderBottom: i < 3 ? B : "none", transition: "background 80ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111", marginBottom: 5, letterSpacing: "-0.01em" }}>{uc.label}</div>
              <div style={{ fontFamily: F.sans, fontSize: T.sm, color: "#999", lineHeight: 1.6 }}>{uc.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .use-grid { grid-template-columns: 1fr 1fr !important; } .use-grid > *:nth-child(even) { border-right: none !important; } }
        @media (max-width: 480px) { .use-grid { grid-template-columns: 1fr !important; } .use-grid > * { border-right: none !important; border-bottom: 1px solid #e2e2e2 !important; } }
      `}</style>
    </section>
  );
}
