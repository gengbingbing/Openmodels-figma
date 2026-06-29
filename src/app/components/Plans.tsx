import { Check } from "lucide-react";
import { F, WS } from "../lib/type";

const blue = "#0047FF";
const B    = "1px solid #E5E5E5";
const BS   = "1px solid #EFEFEF";

interface PlanData {
  id:          string;
  eyebrow:     string;
  label:       string;
  price:       number;
  priceUnit:   string;
  creditsLine: string;
  extra?:      string;
  cta:         string;
  ctaStyle:    "black" | "blue";
  recommended: boolean;
  smallPrint:  string;
}

const plans: PlanData[] = [
  {
    id:          "go",
    eyebrow:     "GO",
    label:       "Entry plan",
    price:       5,
    priceUnit:   "/month",
    creditsLine: "Adds $6 credits monthly",
    extra:       "20% extra credits",
    cta:         "Subscribe",
    ctaStyle:    "black",
    recommended: false,
    smallPrint:  "Credits are added to your balance every billing cycle.",
  },
  {
    id:          "starter",
    eyebrow:     "STARTER",
    label:       "Light usage",
    price:       20,
    priceUnit:   "/month",
    creditsLine: "Adds $22 credits monthly",
    extra:       "10% extra credits",
    cta:         "Subscribe",
    ctaStyle:    "black",
    recommended: false,
    smallPrint:  "Credits are added to your balance every billing cycle.",
  },
  {
    id:          "builder",
    eyebrow:     "BUILDER",
    label:       "Regular development",
    price:       100,
    priceUnit:   "/month",
    creditsLine: "Adds $110 credits monthly",
    extra:       "10% extra credits",
    cta:         "Subscribe",
    ctaStyle:    "blue",
    recommended: true,
    smallPrint:  "Best for developers with recurring API usage.",
  },
  {
    id:          "scale",
    eyebrow:     "SCALE",
    label:       "Production usage",
    price:       200,
    priceUnit:   "/month",
    creditsLine: "Adds $230 credits monthly",
    extra:       "15% extra credits",
    cta:         "Subscribe",
    ctaStyle:    "black",
    recommended: false,
    smallPrint:  "For teams running production traffic on OpenModels.",
  },
];

const sharedBenefits = [
  "Verified provider routes",
  "One OpenAI-compatible API key",
  "Single credits balance",
  "Transparent usage billing",
  "Credits never expire",
  "Provider-route cost visibility",
];


interface PlansProps { onGetKey?: () => void }

export function Plans({ onGetKey }: PlansProps = {}) {
  return (
    <section id="plans">
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Section header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#0047FF", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
            MONTHLY CREDIT PLANS
          </span>
          <h2 style={{ fontFamily: F.sans, fontSize: 18, fontWeight: 600, letterSpacing: 0, color: "#111", marginBottom: 8 }}>
            Monthly credit plans
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, maxWidth: 560, margin: 0 }}>
            Subscribe monthly and receive credits to spend across verified LLM token routes. Usage is billed transparently per token.
          </p>
        </div>

        {/* Unified pricing container */}
        <div style={{ margin: "32px 32px 0", border: B, borderRadius: 8, overflow: "hidden" }}>

          {/* Cards row */}
          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {plans.map((plan, idx) => (
              <div key={plan.id} style={{
                background: "#fff",
                borderRight: idx < plans.length - 1 ? B : "none",
                display: "flex", flexDirection: "column",
                position: "relative",
              }}>
                {/* Builder blue top accent */}
                {plan.recommended && (
                  <div style={{ height: 3, background: blue, flexShrink: 0 }} />
                )}

                <div style={{ padding: "20px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Eyebrow + badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>{plan.eyebrow}</span>
                    {plan.recommended && (
                      <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: blue, background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 7px", borderRadius: 999 }}>Recommended</span>
                    )}
                  </div>

                  {/* Label */}
                  <div style={{ fontFamily: F.sans, fontSize: 13, color: "#777", marginBottom: 18 }}>{plan.label}</div>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 36, fontWeight: 650, color: "#111", letterSpacing: "-0.03em", lineHeight: 1 }}>
                      ${plan.price}
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: 13, color: "#999" }}>{plan.priceUnit}</span>
                  </div>

                  {/* Credits line */}
                  <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: blue, marginBottom: plan.extra ? 4 : 20 }}>
                    {plan.creditsLine}
                  </div>

                  {/* Extra credits badge */}
                  {plan.extra && (
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "inline-block", padding: "1px 8px", borderRadius: 999, marginBottom: 20, width: "fit-content" }}>
                      {plan.extra}
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={onGetKey}
                    style={{
                      width: "100%", height: 40, borderRadius: 6,
                      fontFamily: F.sans, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", transition: "opacity 120ms",
                      ...(plan.ctaStyle === "blue"
                        ? { background: blue, color: "#fff", border: `1px solid ${blue}` }
                        : { background: "#111", color: "#fff", border: "1px solid #111" }),
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >{plan.cta}</button>
                </div>

                {/* Small print */}
                <div style={{ padding: "12px 20px", marginTop: 16, borderTop: BS, background: "#FAFAFA" }}>
                  <p style={{ fontFamily: F.sans, fontSize: 11, color: "#A3A3A3", lineHeight: 1.55, margin: 0 }}>{plan.smallPrint}</p>
                </div>
              </div>
            ))}
          </div>

          {/* All plans include — container footer */}
          <div style={{ borderTop: B, background: "#FAFAFA" }}>
            <div style={{ padding: "12px 20px 10px" }}>
              <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>ALL PLANS INCLUDE</span>
            </div>
            <div className="shared-benefits" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "0 20px 16px", gap: "8px 32px" }}>
              {sharedBenefits.map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={12} style={{ color: "#16A34A", flexShrink: 0 }} strokeWidth={2.5} />
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555" }}>{b}</span>
                </div>
              ))}
            </div>
            {/* Bottom note */}
            <div style={{ padding: "12px 20px", borderTop: B, background: "#F7F7F7" }}>
              <p style={{ fontFamily: F.sans, fontSize: 12, color: "#A3A3A3", margin: 0 }}>
                Plans add credits to your OpenModels balance. Usage is charged by actual token cost based on the selected provider route.
              </p>
            </div>
          </div>

        </div>
        <div style={{ height: 32 }} />

        {/* Footer note */}
        <div style={{ padding: "14px 32px", borderTop: B, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: "#A3A3A3" }}>
            Pay with card or USDC. Credits never expire.
          </span>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: "#ccc" }}>Powered by Alephant infrastructure</span>
        </div>


      </div>

      <style>{`
        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .shared-benefits { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .plans-grid { grid-template-columns: 1fr !important; padding: 16px !important; }
          .shared-benefits { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
