import { ShieldCheck } from "lucide-react";
import { T, F, WS } from "../lib/type";

const B = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";

const points = [
  {
    title: "Transparent token pricing",
    desc: "Compare input and output prices before routing traffic.",
  },
  {
    title: "Provider route visibility",
    desc: "See which provider route is used and compare alternatives in model details.",
  },
  {
    title: "One credits balance",
    desc: "Add credits once and spend across supported models and routes.",
  },
];

export function WhyOpenModels() {
  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <ShieldCheck size={11} color="#0047FF" strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#0047FF", letterSpacing: "0.04em" }}>WHY OPENMODELS</span>
          </span>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 6 }}>
            Buy LLM tokens without proxy-chain uncertainty
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: 0, maxWidth: 540 }}>
            OpenModels gives developers access to verified provider routes, transparent pricing, prepaid credits, and one OpenAI-compatible API.
          </p>
        </div>

        {/* 3 points */}
        <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {points.map((pt, i) => (
            <div key={pt.title} style={{
              padding: "28px 32px",
              borderRight: i < points.length - 1 ? Bs : "none",
            }}>
              <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 8 }}>
                {pt.title}
              </div>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: 0 }}>
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .why-grid > div { border-right: none !important; border-bottom: 1px solid #eeeeee; }
          .why-grid > div:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}
