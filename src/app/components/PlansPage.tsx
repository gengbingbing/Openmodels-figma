import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { SEO, JsonLd, breadcrumbLd, faqLd } from "../lib/seo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { F, WS } from "../lib/type";

const blue = "#0047FF";
const B    = "1px solid #e2e2e2";
const Bs   = "1px solid #eeeeee";

/* ─── Plan data ──────────────────────────────────────────── */
interface PlanData {
  id:          string;
  eyebrow:     string;
  label:       string;
  price:       number;
  credits:     number;
  extra:       string;
  recommended: boolean;
  note:        string;
}

const plans: PlanData[] = [
  { id: "go",      eyebrow: "GO",      label: "Entry plan",           price: 5,   credits: 6,   extra: "20% extra credits", recommended: false, note: "Credits are added to your balance every billing cycle." },
  { id: "starter", eyebrow: "STARTER", label: "Light usage",          price: 20,  credits: 22,  extra: "10% extra credits", recommended: false, note: "Credits are added to your balance every billing cycle." },
  { id: "builder", eyebrow: "BUILDER", label: "Regular development",  price: 100, credits: 110, extra: "10% extra credits", recommended: true,  note: "Best for developers with recurring API usage." },
  { id: "scale",   eyebrow: "SCALE",   label: "Production usage",     price: 200, credits: 230, extra: "15% extra credits", recommended: false, note: "For teams running production traffic on OpenModels." },
];

const sharedBenefits = [
  "Verified provider routes",
  "One OpenAI-compatible API key",
  "Single credits balance",
  "Transparent usage billing",
  "Credits never expire",
  "Provider-route cost visibility",
];

const faqs = [
  { q: "How do credits work?",         a: "Credits are added to your OpenModels balance each billing cycle and can be spent across all supported models and provider routes." },
  { q: "Do credits expire?",           a: "No. Credits never expire and roll over month to month." },
  { q: "Can I cancel anytime?",        a: "Yes. You can cancel a monthly plan at any time. Credits already added remain in your balance." },
  { q: "Can I pay with crypto?",       a: "Yes. OpenModels supports USDC payments for one-time credit top-ups via MoonPay." },
  { q: "What counts as one request?",  a: "Each API call counts as one request. Token usage is billed based on the selected provider route's input and output price per 1M tokens." },
];

/* ─── Component ──────────────────────────────────────────── */
export function PlansPage() {
  const navigate  = useNavigate();
  const goAuth    = () => navigate("/", { state: { openAuth: true } });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
      <SEO
        title="Plans | OpenModels Monthly Credits"
        description="Subscribe to monthly credit plans for OpenModels. Credits are added to one balance and spent across supported LLM token routes."
        path="/plans"
      />
      <JsonLd id="breadcrumb-plans" data={breadcrumbLd([{name:"OpenModels",url:"https://openmodels.market"},{name:"Plans",url:"https://openmodels.market/plans"}])} />
      <JsonLd id="faq-plans" data={faqLd(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

          {/* ── Page header ── */}
          <div style={{ padding: "28px 32px 24px", borderBottom: B }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>
              PLANS
            </span>
            <h1 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 8, letterSpacing: 0 }}>
              Monthly credit plans
            </h1>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: "0 0 14px", maxWidth: 520 }}>
              Subscribe monthly and receive credits to spend across verified and community provider routes. Usage is billed per token based on the selected route.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>Pay with card or USDC</span>
              <span style={{ color: "#D5D5D5" }}>·</span>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>Credits never expire</span>
              <span style={{ color: "#D5D5D5" }}>·</span>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>Cancel anytime</span>
            </div>
          </div>

          {/* ── Plan cards ── */}
          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: B }}>
            {plans.map((plan, idx) => (
              <div key={plan.id} style={{
                borderRight: idx < plans.length - 1 ? Bs : "none",
                display: "flex", flexDirection: "column",
                position: "relative",
              }}>
                {plan.recommended && <div style={{ height: 3, background: blue }} />}
                <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Eyebrow + badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>{plan.eyebrow}</span>
                    {plan.recommended && (
                      <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 7px", borderRadius: 999 }}>Recommended</span>
                    )}
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555", marginBottom: 16 }}>{plan.label}</div>

                  {/* Price */}
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 28, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.03em" }}>${plan.price}</span>
                    <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3", marginLeft: 3 }}>/month</span>
                  </div>
                  <div style={{ fontFamily: F.mono, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 3 }}>
                    Adds ${plan.credits} credits monthly
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#16A34A", marginBottom: 16 }}>{plan.extra}</div>

                  {/* CTA */}
                  <button onClick={goAuth} style={{
                    width: "100%", height: 36,
                    fontFamily: F.sans, fontSize: WS.body, fontWeight: 600,
                    color: "#fff",
                    background: plan.recommended ? blue : "#111",
                    border: "none", borderRadius: 6,
                    cursor: "pointer", transition: "opacity 120ms", marginTop: "auto",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >Subscribe</button>

                  {/* Note */}
                  <div style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3", marginTop: 10, lineHeight: 1.5 }}>
                    {plan.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── All plans include ── */}
          <div style={{ borderBottom: B }}>
            <div style={{ padding: "14px 20px 10px" }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>ALL PLANS INCLUDE</span>
            </div>
            <div className="shared-benefits" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "0 20px 18px", gap: "8px 32px" }}>
              {sharedBenefits.map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={12} style={{ color: "#16A34A", flexShrink: 0 }} strokeWidth={2.5} />
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555" }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 20px 16px", borderTop: Bs }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3" }}>
                Plans add credits to your OpenModels balance. Usage is charged by actual token cost based on the selected provider route.
              </span>
            </div>
          </div>

          {/* ── One-time top-up note ── */}
          <div style={{ padding: "20px 32px", borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111", marginBottom: 3 }}>Need a one-time top-up?</div>
              <div style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>Add credits without a subscription. Available by card or USDC.</div>
            </div>
            <button onClick={goAuth} style={{
              fontFamily: F.sans, fontSize: WS.body, fontWeight: 500,
              color: "#555", background: "#fff", border: B,
              height: 36, padding: "0 16px", borderRadius: 6, cursor: "pointer",
              transition: "all 100ms", flexShrink: 0,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#111"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#555"; }}
            >Add credits →</button>
          </div>

          {/* ── FAQ ── */}
          <div style={{ padding: "32px 32px 40px" }}>
            <div style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 20 }}>FAQ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? Bs : "none" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}
                  >
                    <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>{faq.q}</span>
                    <ChevronRight size={13} color="#C0C0C0" strokeWidth={2} style={{ transform: openFaq === i ? "rotate(90deg)" : "none", transition: "transform 150ms", flexShrink: 0 }} />
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 0 14px", fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7, maxWidth: 640 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer onGetKey={goAuth} />

      <style>{`
        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: 1fr 1fr !important; }
          .shared-benefits { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .plans-grid { grid-template-columns: 1fr !important; }
          .shared-benefits { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
