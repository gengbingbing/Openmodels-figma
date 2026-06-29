import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { T, F, WS } from "../lib/type";
const B = "1px solid #e2e2e2";

const faqs = [
  { q: "What is OpenModels?",                                                  a: "OpenModels is an open marketplace for LLM tokens. Developers can compare prices, choose provider routes, and access models through one OpenAI-compatible API." },
  { q: "What are provider routes?",                                            a: "Provider routes are the delivery paths behind each model. A model can have multiple routes with different pricing, availability, latency, and supply status." },
  { q: "What is the difference between verified and community routes?",        a: "Verified routes are reviewed by OpenModels for production-oriented usage. Community routes are more open and flexible, but may vary more in reliability and availability." },
  { q: "How is pricing calculated?",                                           a: "Pricing is pay-per-token. Credits are deducted based on input and output token usage, with prices shown per 1M tokens before you route traffic." },
  { q: "How do credits work?",                                                 a: "You add credits to one OpenModels balance and spend them across supported models and provider routes. Credits can be purchased by card or crypto." },
  { q: "Is OpenModels OpenAI-compatible?",                                     a: "Yes. OpenModels supports an OpenAI-compatible API, so most SDKs can connect by changing the base URL and API key." },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>
        <div className="faq-header" style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <HelpCircle size={11} color="#0047FF" strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#0047FF", letterSpacing: "0.04em" }}>FAQ</span>
          </span>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a" }}>Common questions</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: B }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="faq-btn" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16, transition: "background 80ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111", lineHeight: 1.5 }}>{faq.q}</span>
              <span style={{ color: "#ccc", flexShrink: 0 }}>{openIdx === i ? <Minus size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}</span>
            </button>
            {openIdx === i && (
              <div className="faq-ans" style={{ padding: "0 28px 18px", fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7, maxWidth: 680 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .faq-header { padding: 24px 16px 18px !important; }
          .faq-btn { padding: 14px 16px !important; }
          .faq-ans { padding: 0 16px 16px !important; max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
