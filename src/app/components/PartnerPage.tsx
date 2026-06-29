import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SEO, JsonLd, breadcrumbLd, faqLd } from "../lib/seo";
import { F, WS } from "../lib/type";

const blue = "#0047FF";
const B    = "1px solid #e2e2e2";
const Bs   = "1px solid #eeeeee";

/* ─── Data ───────────────────────────────────────────────── */
const plans = [
  {
    id: "launch", eyebrow: "LAUNCH", price: 29, label: "For creators and small communities", recommended: false,
    cta: "Start with Launch", href: "/partner/overview?plan=launch",
    features: ["Up to 10 models", "Hosted marketplace page", "Basic SEO settings", "Auto pricing markup", "Usage dashboard"],
  },
  {
    id: "growth", eyebrow: "GROWTH", price: 99, label: "For agencies and developer communities", recommended: true,
    cta: "Start with Growth", href: "/partner/overview?plan=growth",
    features: ["Up to 50 models", "Custom domain", "Advanced SEO settings", "Custom pricing rules", "Partner analytics"],
  },
  {
    id: "scale", eyebrow: "SCALE", price: 299, label: "For teams running a token marketplace", recommended: false,
    cta: "Start with Scale", href: "/partner/overview?plan=scale",
    features: ["Up to 200 models", "Custom domain", "Bulk pricing", "Route controls", "Priority support"],
  },
];

const benefits = [
  { title: "Earn from token usage",         desc: "Set markup above OpenModels base token costs and earn from qualified usage." },
  { title: "No infrastructure required",    desc: "OpenModels handles model routes, credits, billing, API access, and usage accounting." },
  { title: "Choose your catalog",           desc: "Select the models that fit your audience or niche." },
  { title: "Control pricing",               desc: "Use auto markup or custom pricing rules depending on your plan." },
  { title: "Publish SEO pages",             desc: "Create searchable marketplace and model pages." },
  { title: "Track performance",             desc: "View signups, usage, credits purchased, and partner revenue." },
];

const steps = [
  { n: "1", title: "Configure",  desc: "Add your brand, select models, set pricing, and edit SEO copy." },
  { n: "2", title: "Preview",    desc: "Review your marketplace before publishing." },
  { n: "3", title: "Publish",    desc: "Choose a partner plan, pay, and launch your marketplace." },
];

const faqs = [
  { q: "What is an OpenModels partner marketplace?", a: "A branded marketplace where you sell LLM token access powered by OpenModels." },
  { q: "Do I need to provide models?",               a: "No. OpenModels provides token routes, billing, API access, and usage accounting." },
  { q: "How do partners earn?",                      a: "Partners earn from the pricing margin set above OpenModels base token costs." },
  { q: "Can I configure before paying?",             a: "Yes. You can set up and preview your marketplace first. A plan is required to publish." },
  { q: "Can I choose models?",                       a: "Yes. Each plan has a model limit. You can choose which supported models appear in your marketplace." },
  { q: "Can I use a custom domain?",                 a: "Custom domains are available on Growth and Scale plans." },
];

/* ─── Component ──────────────────────────────────────────── */
export function PartnerPage() {
  const navigate  = useNavigate();
  const goAuth    = () => navigate("/", { state: { openAuth: true } });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
      <SEO
        title="Partner Program | OpenModels"
        description="Launch your own branded LLM token marketplace powered by OpenModels. Choose models, set pricing, publish SEO pages, and earn from token usage."
        path="/partners"
      />
      <JsonLd id="bc-partners" data={breadcrumbLd([{name:"OpenModels",url:"https://openmodels.market"},{name:"Partner Program",url:"https://openmodels.market/partners"}])} />
      <JsonLd id="faq-partners" data={faqLd(faqs)} />
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

          {/* ── Page Intro ── */}
          <div style={{ padding: "28px 32px 24px", borderBottom: B }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>PARTNER PROGRAM</span>
            <h1 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 6, letterSpacing: 0 }}>
              Launch your own LLM token marketplace
            </h1>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.55, marginBottom: 16, maxWidth: 540 }}>
              Create a branded marketplace powered by OpenModels. Choose models, set pricing, publish SEO pages, and earn from token usage.
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <a href="/partner/overview" style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#fff", background: "#111", height: 38, padding: "0 18px", borderRadius: 4, cursor: "pointer", transition: "opacity 120ms", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >Start as a partner</a>
              <a href="#partner-plans" style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", transition: "opacity 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >View plans →</a>
            </div>
          </div>

          {/* ── How It Works ── */}
          <div style={{ borderBottom: B }}>
            <div className="partner-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{ padding: "24px 28px", borderRight: i < 2 ? Bs : "none" }}>
                  <div style={{ fontFamily: F.mono, fontSize: WS.meta, fontWeight: 600, color: "#C0C0C0", marginBottom: 8 }}>{s.n}</div>
                  <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 5 }}>{s.title}</div>
                  <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Partner Plans ── */}
          <div id="partner-plans" style={{ borderBottom: B }}>
            <div style={{ padding: "28px 32px 20px", borderBottom: B }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>PARTNER PLANS</span>
              <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", letterSpacing: 0 }}>Choose your plan</h2>
            </div>
            <div className="partner-plans" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {plans.map((plan, idx) => (
                <div key={plan.id} style={{ borderRight: idx < plans.length - 1 ? Bs : "none", display: "flex", flexDirection: "column", position: "relative" }}>
                  {plan.recommended && <div style={{ height: 3, background: blue }} />}
                  <div style={{ padding: "20px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>{plan.eyebrow}</span>
                      {plan.recommended && <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 7px", borderRadius: 999 }}>Recommended</span>}
                    </div>
                    <div style={{ marginBottom: 3 }}>
                      <span style={{ fontFamily: F.sans, fontSize: 26, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.03em" }}>${plan.price}</span>
                      <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3", marginLeft: 3 }}>/month</span>
                    </div>
                    <div style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888", marginBottom: 16 }}>{plan.label}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, flex: 1 }}>
                      {plan.features.map((f) => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <Check size={12} style={{ color: "#16A34A", flexShrink: 0 }} strokeWidth={2.5} />
                          <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <a href={plan.href} style={{
                      display: "block", width: "100%", height: 34, fontFamily: F.sans, fontSize: WS.body, fontWeight: 600,
                      color: "#fff", background: plan.recommended ? blue : "#111",
                      border: "none", borderRadius: 6, cursor: "pointer", transition: "opacity 120ms",
                      textDecoration: "none", lineHeight: "34px", textAlign: "center" as const,
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >{plan.cta}</a>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 24px", borderTop: Bs }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3" }}>
                You can configure your marketplace first. A plan is required before publishing.
              </span>
            </div>
          </div>

          {/* ── Benefits ── */}
          <div style={{ padding: "32px 32px 28px", borderBottom: B }}>
            <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 6, letterSpacing: 0 }}>Partner benefits</h2>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: "0 0 24px" }}>
              OpenModels handles the token infrastructure. Partners focus on audience, pricing, and distribution.
            </p>
            <div className="partner-benefits" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 40px" }}>
              {benefits.map(({ title, desc }) => (
                <div key={title}>
                  <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 3 }}>{title}</div>
                  <div style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ padding: "32px 32px 28px", borderBottom: B }}>
            <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 20, letterSpacing: 0 }}>Partner FAQ</h2>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < faqs.length - 1 ? Bs : "none" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>{faq.q}</span>
                  <ChevronRight size={13} color="#C0C0C0" strokeWidth={2} style={{ transform: openFaq === i ? "rotate(90deg)" : "none", transition: "transform 150ms", flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 0 14px", fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7, maxWidth: 640 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* ── Final CTA ── */}
          <div style={{ padding: "32px 32px 40px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 6, letterSpacing: 0 }}>Start your partner marketplace</h2>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: 0, maxWidth: 480 }}>
                Choose a plan, configure your model catalog, and publish a branded LLM token marketplace powered by OpenModels.
              </p>
            </div>
            <a href="/partner/overview" style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#fff", background: "#111", height: 40, padding: "0 20px", borderRadius: 4, cursor: "pointer", flexShrink: 0, transition: "opacity 120ms", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Start as a partner</a>
          </div>

        </div>
      </div>

      <Footer onGetKey={goAuth} />

      <style>{`
        @media (max-width: 768px) {
          .partner-steps   { grid-template-columns: 1fr !important; }
          .partner-steps > div { border-right: none !important; border-bottom: 1px solid #eeeeee; }
          .partner-plans   { grid-template-columns: 1fr !important; }
          .partner-plans > div { border-right: none !important; border-bottom: 1px solid #eeeeee; }
          .partner-benefits { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
