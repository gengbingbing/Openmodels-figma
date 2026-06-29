import { ShieldCheck, Activity, DollarSign } from "lucide-react";
import { T, F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";

const pillars = [
  {
    Icon: ShieldCheck,
    title: "Verified routes",
    desc: "Supply routes are checked and labeled so buyers know what they are using.",
  },
  {
    Icon: Activity,
    title: "Live availability",
    desc: "Model availability and route status are monitored before production traffic.",
  },
  {
    Icon: DollarSign,
    title: "Transparent pricing",
    desc: "Input and output token prices are shown clearly before purchase.",
  },
];

export function SupplyNetwork() {
  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#0047FF", letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>SUPPLY NETWORK</span>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 8 }}>
            Verified supply behind every token
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: 0, maxWidth: 560 }}>
            OpenModels works with reviewed providers so developers can buy LLM tokens with clearer pricing, availability, and route-level billing.
          </p>
        </div>

        {/* Verification note — full-width row, no side margins */}
        <div style={{
          padding: "10px 28px", borderBottom: B,
          background: "#FAFAFA",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <ShieldCheck size={12} color="#0047FF" strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: F.sans, fontSize: 12, color: "#777", lineHeight: 1.5 }}>
            Verified routes are checked for provider identity, model availability, token pricing, and route stability before being listed.
          </span>
        </div>

        {/* Three columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="supply-cols">
          {pillars.map(({ Icon, title, desc }, i) => (
            <div key={title} style={{
              padding: "28px 28px",
              borderRight: i < pillars.length - 1 ? Bs : "none",
              transition: "background 80ms",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 32, height: 32, border: "1px solid #e5e5e5", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16, borderRadius: 6,
              }}>
                <Icon size={15} color="#0047FF" strokeWidth={1.75} />
              </div>
              <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#0a0a0a", marginBottom: 8, letterSpacing: "-0.01em" }}>
                {title}
              </div>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) { .supply-cols { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) {
          .supply-cols { grid-template-columns: 1fr !important; }
          .supply-cols > * { border-right: none !important; border-bottom: 1px solid #eeeeee; padding: 20px 20px !important; }
          .supply-note { padding: 10px 16px !important; }
          .supply-header { padding: 24px 16px 18px !important; }
        }
      `}</style>
    </section>
  );
}
