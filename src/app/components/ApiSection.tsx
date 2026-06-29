import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { T, F, WS } from "../lib/type";
import { copyText } from "../lib/clipboard";

const B  = "1px solid #e2e2e2";
const Bi = "1px solid #eeeeee";
const blue = "#0047FF";

const steps = [
  {
    n: "01",
    title: "Add credits",
    desc: "Deposit $10 or more. Credits are added to your balance and never expire.",
  },
  {
    n: "02",
    title: "Create an API key",
    desc: "Generate a key from your dashboard. Treat it like a password — never commit to source control.",
  },
  {
    n: "03",
    title: "Call any verified model or route",
    desc: "Swap the base URL to api.getopenmodels.com/v1. Everything else in your existing OpenAI SDK flow stays the same.",
  },
];

const sdks = ["OpenAI SDK", "Vercel AI SDK", "LangChain", "LlamaIndex"];

const tabs = ["curl", "python", "node"] as const;
type Tab = typeof tabs[number];

const snippets: Record<Tab, { text: string; color: string }[]> = {
  curl: [
    { text: 'curl https://api.getopenmodels.com/v1/chat/completions \\', color: "#79ffe1" },
    { text: '  -H "Authorization: Bearer $OM_API_KEY" \\',         color: "#b3d7ff" },
    { text: '  -H "Content-Type: application/json" \\',            color: "#b3d7ff" },
    { text: "  -d '{",                                              color: "#aaa"    },
    { text: '    "model": "qwen-2.5-72b",',                        color: "#ffd87d" },
    { text: '    "messages": [{"role":"user","content":"Hello!"}]', color: "#aaa"    },
    { text: "  }'",                                                 color: "#aaa"    },
  ],
  python: [
    { text: "from openai import OpenAI",                            color: "#b3d7ff" },
    { text: "",                                                      color: "#aaa"    },
    { text: "client = OpenAI(",                                     color: "#aaa"    },
    { text: '    base_url="https://api.getopenmodels.com/v1",',          color: "#ffd87d" },
    { text: '    api_key=os.environ["OM_API_KEY"],',               color: "#aaa"    },
    { text: ")",                                                     color: "#aaa"    },
    { text: "",                                                      color: "#aaa"    },
    { text: "resp = client.chat.completions.create(",               color: "#aaa"    },
    { text: '    model="qwen-2.5-72b",',                           color: "#ffd87d" },
    { text: '    messages=[{"role":"user","content":"Hello!"}],',  color: "#aaa"    },
    { text: ")",                                                     color: "#aaa"    },
  ],
  node: [
    { text: 'import OpenAI from "openai";',                         color: "#b3d7ff" },
    { text: "",                                                      color: "#aaa"    },
    { text: "const client = new OpenAI({",                         color: "#aaa"    },
    { text: '  baseURL: "https://api.getopenmodels.com/v1",',            color: "#ffd87d" },
    { text: "  apiKey: process.env.OM_API_KEY,",                   color: "#aaa"    },
    { text: "});",                                                   color: "#aaa"    },
    { text: "",                                                      color: "#aaa"    },
    { text: "const resp = await client.chat.completions.create({", color: "#aaa"    },
    { text: '  model: "qwen-2.5-72b",',                            color: "#ffd87d" },
    { text: '  messages: [{ role: "user", content: "Hello!" }],',  color: "#aaa"    },
    { text: "});",                                                   color: "#aaa"    },
  ],
};

export function ApiSection() {
  const [tab, setTab]       = useState<Tab>("curl");
  const [copied, setCopied] = useState(false);

  const code = snippets[tab].map((l) => l.text).join("\n");
  const handleCopy = () => { copyText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <section id="api">
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <Code2 size={11} color={blue} strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em" }}>QUICKSTART</span>
          </span>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 6 }}>
            One API key for LLM token access
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#777", margin: 0 }}>
            OpenModels is OpenAI-compatible. Change the base URL, choose a model or route, and start using verified LLM token supply with transparent pricing.
          </p>
        </div>

        {/* Main body: steps + code — align-items:start prevents columns stretching each other */}
        <div className="api-grid" style={{ display: "grid", gridTemplateColumns: "34% 66%", alignItems: "start" }}>

          {/* Left: steps */}
          <div style={{ borderRight: B }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{
                padding: "18px 24px",
                borderBottom: i < steps.length - 1 ? Bi : "none",
              }}>
                <div style={{ fontFamily: F.mono, fontSize: T.meta, color: "#ccc", marginBottom: 5, letterSpacing: "0.04em" }}>{s.n}</div>
                <div style={{ fontFamily: F.sans, fontSize: WS.card, fontWeight: 700, color: "#0a0a0a", marginBottom: 4, letterSpacing: "-0.01em" }}>{s.title}</div>
                <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#888", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: code panel — sized to content only */}
          <div>
            {/* Tab bar */}
            <div style={{ display: "flex", alignItems: "center", background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", height: 36 }}>
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  fontFamily: F.mono, fontSize: T.meta,
                  color: tab === t ? "#fff" : "#555",
                  background: "none", border: "none",
                  borderBottom: tab === t ? `2px solid ${blue}` : "2px solid transparent",
                  padding: "0 16px", height: "100%", cursor: "pointer",
                  transition: "color 100ms", marginBottom: -1,
                }}>{t}</button>
              ))}
              <div style={{ marginLeft: "auto", padding: "0 14px" }}>
                <button onClick={handleCopy} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: copied ? "#16A34A" : "#555",
                  display: "flex", alignItems: "center", gap: 5,
                  fontFamily: F.sans, fontSize: T.meta, padding: 0, transition: "color 100ms",
                }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Code — wraps its content, no stretch */}
            <pre style={{
              margin: 0, padding: "18px 20px",
              fontFamily: F.mono, fontSize: T.meta, lineHeight: 1.75,
              background: "#111", color: "#ededed",
              overflowX: "auto",
            }}>
              {snippets[tab].map((line, i) => (
                <span key={i} style={{ display: "block", color: line.color, minHeight: "1em" }}>
                  {line.text || " "}
                </span>
              ))}
            </pre>

            {/* Base URL — immediately below code */}
            <div style={{
              padding: "0 20px", height: 38,
              borderTop: Bi, background: "#fafafa",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontFamily: F.sans, fontSize: T.meta, fontWeight: 500, color: "#aaa" }}>BASE URL</span>
              <code style={{ fontFamily: F.mono, fontSize: T.meta, color: "#333" }}>https://api.getopenmodels.com/v1</code>
              <span style={{ fontFamily: F.sans, fontSize: T.meta, color: "#ccc", marginLeft: "auto" }}>Powered by alephant.io</span>
            </div>
          </div>
        </div>

        {/* Bottom integrations row */}
        <div className="api-integrations" style={{ padding: "11px 28px", borderTop: B, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: F.sans, fontSize: T.meta, color: "#bbb", marginRight: 4 }}>Works with</span>
          {sdks.map((sdk, i) => (
            <span key={sdk} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.mono, fontSize: T.meta, color: "#888" }}>{sdk}</span>
              {i < sdks.length - 1 && <span style={{ color: "#ddd" }}>·</span>}
            </span>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .api-grid { grid-template-columns: 1fr !important; }
          .api-grid > *:first-child { border-right: none !important; border-bottom: 1px solid #e2e2e2; }
          .api-integrations { padding: 10px 16px !important; flex-wrap: wrap; gap: 6px !important; }
        }
        @media (max-width: 480px) {
          .api-header { padding: 24px 16px 18px !important; }
          .api-step { padding: 14px 16px !important; }
        }
      `}</style>
    </section>
  );
}
