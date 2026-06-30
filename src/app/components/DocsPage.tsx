import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Copy, Check } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SupportButton } from "./SupportButton";
import { SEO, JsonLd, breadcrumbLd, faqLd } from "../lib/seo";
import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

const BASE_URL  = "https://api.getopenmodels.com/v1";
const POWEREDBY = "Powered by alephant.io";

const CODE = {
  curl: `curl ${BASE_URL}/chat/completions \\
  -H "Authorization: Bearer $OPENMODELS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.1-70b",
    "messages": [
      { "role": "user", "content": "Hello" }
    ]
  }'`,
  python: `import openai

client = openai.OpenAI(
    api_key="$OPENMODELS_API_KEY",
    base_url="${BASE_URL}"
)

response = client.chat.completions.create(
    model="llama-3.1-70b",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)`,
  node: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENMODELS_API_KEY,
  baseURL: "${BASE_URL}",
});

const response = await client.chat.completions.create({
  model: "llama-3.1-70b",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(response.choices[0].message.content);`,
};

const FAQS = [
  { q: "What is the OpenModels API?",           a: "OpenModels provides an OpenAI-compatible API for accessing LLM token routes from verified and community providers. Change the base URL and API key in any OpenAI SDK to use it." },
  { q: "Which models are supported?",           a: "OpenModels supports a range of open models across Chat, Coding, Reasoning, and Embedding categories. See the Models page for live pricing and route availability." },
  { q: "How do I get an API key?",              a: "Create an account, add credits to your balance, and generate an API key from the dashboard. Keys can have per-key spending limits." },
  { q: "How is usage billed?",                  a: "Usage is billed per token based on the provider route selected. Input and output tokens are charged separately at the prices shown on the model page." },
  { q: "What does the default route mean?",     a: "By default, OpenModels selects the lowest available verified provider route for each model. You can override this in the API request or via a Route policy." },
];

const steps = [
  { n: "01", title: "Add credits",         desc: "Add credits to your OpenModels balance. Credits are used across all models and provider routes." },
  { n: "02", title: "Get an API key",      desc: "Generate a key from your dashboard. Set a monthly limit per key if needed." },
  { n: "03", title: "Change the base URL", desc: `Set the base URL to ${BASE_URL} in any OpenAI-compatible SDK.` },
  { n: "04", title: "Choose a model",      desc: "Use any model ID from the Models page. The lowest verified route is selected by default." },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: copied ? "#22c55e" : "#666", padding: "2px 6px", transition: "color 100ms", fontFamily: F.sans, fontSize: WS.meta }}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function DocsPage() {
  const navigate = useNavigate();
  const goAuth   = () => navigate("/", { state: { openAuth: true } });
  const [tab, setTab]     = useState<"curl" | "python" | "node">("curl");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
      <SEO
        title="Docs | OpenModels API Documentation"
        description="Learn how to use OpenModels with an OpenAI-compatible API, API keys, base URL, credits, model IDs, provider routes, and usage billing."
        path="/docs"
      />
      <JsonLd id="breadcrumb-docs" data={breadcrumbLd([
        { name: "OpenModels", url: "https://openmodels.market" },
        { name: "Docs",       url: "https://openmodels.market/docs" },
      ])} />
      <JsonLd id="faq-docs" data={faqLd(FAQS)} />
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

          {/* Page header */}
          <div style={{ padding: "28px 32px 24px", borderBottom: B }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>DOCS</span>
            <h1 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 8, letterSpacing: 0 }}>
              OpenModels API documentation
            </h1>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: "0 0 14px", maxWidth: 520 }}>
              OpenModels is OpenAI-compatible. Change the base URL and API key in any OpenAI SDK to access LLM token routes with transparent pricing and credits billing.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <code style={{ fontFamily: F.mono, fontSize: WS.body, color: "#111", background: "#F5F5F5", border: "1px solid #E5E5E5", padding: "4px 10px", borderRadius: 4 }}>{BASE_URL}</code>
              <CopyBtn text={BASE_URL} />
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>· {POWEREDBY}</span>
            </div>
          </div>

          {/* Quickstart steps + code */}
          <div className="docs-grid" style={{ display: "grid", gridTemplateColumns: "34% 66%", alignItems: "start", borderBottom: B }}>

            {/* Steps */}
            <div style={{ borderRight: B }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{ padding: "20px 24px", borderBottom: i < steps.length - 1 ? Bs : "none" }}>
                  <div style={{ fontFamily: F.mono, fontSize: WS.meta, color: "#C0C0C0", marginBottom: 5 }}>{s.n}</div>
                  <div style={{ fontFamily: F.sans, fontSize: WS.card, fontWeight: 600, color: "#0a0a0a", marginBottom: 4 }}>{s.title}</div>
                  <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#888", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Code panel */}
            <div style={{ background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
              {/* Tabs */}
              <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #1a1a1a", height: 38 }}>
                {(["curl", "python", "node"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    fontFamily: F.mono, fontSize: WS.meta,
                    color: tab === t ? "#e5e5e5" : "#555",
                    background: "none", border: "none",
                    borderBottom: tab === t ? "2px solid #0047FF" : "2px solid transparent",
                    padding: "0 16px", height: "100%", cursor: "pointer", marginBottom: -1,
                  }}>{t}</button>
                ))}
                <div style={{ marginLeft: "auto", padding: "0 12px" }}>
                  <CopyBtn text={CODE[tab]} />
                </div>
              </div>
              <pre style={{ margin: 0, padding: "20px 20px", fontFamily: F.mono, fontSize: 12, color: "#e5e5e5", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.7, flex: 1 }}>
                {CODE[tab]}
              </pre>
              <div style={{ padding: "8px 20px 12px", borderTop: "1px solid #1a1a1a" }}>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#444" }}>
                  Base URL: {BASE_URL}
                </span>
              </div>
            </div>
          </div>

          {/* Key concepts */}
          <div style={{ borderBottom: B }}>
            <div style={{ padding: "28px 32px 16px" }}>
              <div style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 20, textTransform: "uppercase" as const }}>Key concepts</div>
              <div className="docs-concepts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 40px", paddingBottom: 16 }}>
                {[
                  { term: "Credits",            def: "Your OpenModels balance. Add credits by card or USDC. Usage is deducted per token based on the selected provider route." },
                  { term: "Provider routes",    def: "The delivery paths behind each model. A model can have multiple verified and community routes with different pricing and latency." },
                  { term: "Verified routes",    def: "Routes reviewed by OpenModels for production usage. Shown by default for lowest-price routing." },
                  { term: "Community routes",   def: "Routes submitted by community providers. Available in model detail pages when users opt in." },
                  { term: "API key",            def: "Generated from your dashboard. Use as a Bearer token. Set monthly limits per key." },
                  { term: "Model ID",           def: "Use any model ID shown on the Models page. The default route is selected automatically." },
                ].map(({ term, def }) => (
                  <div key={term}>
                    <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 3 }}>{term}</div>
                    <div style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6 }}>{def}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internal links */}
          <div style={{ padding: "20px 32px", borderBottom: B, display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Browse models",       href: "/models" },
              { label: "View plans",          href: "/plans" },
              { label: "x402 endpoints",      href: "/x402" },
              { label: "Become a provider",   href: "/providers/apply" },
            ].map((l) => (
              <a key={l.label} href={l.href} style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "opacity 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {l.label} <ChevronRight size={13} strokeWidth={1.5} />
              </a>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ padding: "32px 32px 40px" }}>
            <div style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 20 }}>FAQ</div>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? Bs : "none" }}>
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

        </div>
      </div>

      <Footer onGetKey={goAuth} />
      <SupportButton />

      <style>{`
        @media (max-width: 768px) {
          .docs-grid { grid-template-columns: 1fr !important; }
          .docs-concepts { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
