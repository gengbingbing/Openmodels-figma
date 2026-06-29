import { useState } from "react";
import { Copy, Check, CheckCircle2, Circle, ExternalLink, ChevronRight, Zap } from "lucide-react";
import { T, F } from "../../../lib/type";
import { B, Bs, blue, D } from "../shared";
import { copyText } from "../../../lib/clipboard";

const sdks = ["curl", "python", "node", "go"] as const;
type SDK = typeof sdks[number];

const install: Record<SDK, string> = {
  curl:   "# No installation needed",
  python: "pip install openai",
  node:   "npm install openai",
  go:     "go get github.com/sashabaranov/go-openai",
};

const envSnippet: Record<SDK, string> = {
  curl:   `export OM_API_KEY="sk-om-your-api-key"`,
  python: `import os\nos.environ["OM_API_KEY"] = "sk-om-your-api-key"\n# or load via python-dotenv`,
  node:   `# .env\nOM_API_KEY=sk-om-your-api-key`,
  go:     `export OM_API_KEY="sk-om-your-api-key"`,
};

const requestSnippet: Record<SDK, string> = {
  curl: `curl https://api.getopenmodels.com/v1/chat/completions \\
  -H "Authorization: Bearer $OM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen-2.5-72b",
    "messages": [{"role":"user","content":"Hello!"}],
    "max_tokens": 256
  }'`,
  python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.getopenmodels.com/v1",
    api_key=os.environ["OM_API_KEY"],
)
resp = client.chat.completions.create(
    model="qwen-2.5-72b",
    messages=[{"role": "user", "content": "Hello!"}],
    max_tokens=256,
)
print(resp.choices[0].message.content)`,
  node: `import OpenAI from "openai";
const client = new OpenAI({
  baseURL: "https://api.getopenmodels.com/v1",
  apiKey: process.env.OM_API_KEY,
});
const resp = await client.chat.completions.create({
  model: "qwen-2.5-72b",
  messages: [{ role: "user", content: "Hello!" }],
  max_tokens: 256,
});
console.log(resp.choices[0].message.content);`,
  go: `cfg := openai.DefaultConfig(os.Getenv("OM_API_KEY"))
cfg.BaseURL = "https://api.getopenmodels.com/v1"
client := openai.NewClientWithConfig(cfg)
resp, _ := client.CreateChatCompletion(ctx,
  openai.ChatCompletionRequest{
    Model: "qwen-2.5-72b",
    Messages: []openai.ChatCompletionMessage{
      {Role: openai.ChatMessageRoleUser, Content: "Hello!"},
    },
  },
)`,
};

const responseExample = `{
  "id": "chatcmpl-abc123",
  "model": "qwen-2.5-72b",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21
  }
}`;

const steps = [
  { id: "key",     label: "Create an API key",       done: true },
  { id: "install", label: "Install the SDK",         done: false },
  { id: "env",     label: "Set your API key",        done: false },
  { id: "request", label: "Make your first request", done: false },
];

const resources = [
  "API Reference", "Model IDs", "Rate limits",
  "Error codes", "Streaming", "Function calling",
];

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ border: B }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 14px", background: "#f7f7f7", borderBottom: B }}>
        <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#bbb" }}>{lang ?? "shell"}</span>
        <button onClick={() => { copyText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#16A34A" : "#bbb", display: "flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: D.label, padding: 0, transition: "color 100ms" }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "16px", fontFamily: F.mono, fontSize: D.label, lineHeight: 1.9, background: "#111", color: "#ededed", overflowX: "auto" }}>{code}</pre>
    </div>
  );
}

export function QuickstartPage() {
  const [sdk, setSdk]               = useState<SDK>("python");
  const [activeStep, setActiveStep] = useState(0);

  const NextBtn = ({ step }: { step: number }) => (
    <button onClick={() => setActiveStep(step)} style={{
      marginTop: 24, fontFamily: F.sans, fontSize: D.body, fontWeight: 700,
      color: "#fff", background: "#111", border: "none", padding: "10px 20px",
      cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
      letterSpacing: "-0.01em", transition: "background 150ms",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
    >
      {steps[step]?.label} <ChevronRight size={14} />
    </button>
  );

  return (
    <div style={{ fontFamily: F.sans }}>
      {/* Header */}
      <div style={{ padding: "32px 28px 24px", borderBottom: B }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <Zap size={11} color={blue} strokeWidth={2} />
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em" }}>QUICKSTART</span>
        </span>
        <h1 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 8, lineHeight: 1.2 }}>
          Your first request in 2 minutes
        </h1>
        <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#777", lineHeight: 1.65 }}>
          OpenModels is OpenAI-compatible — swap the base URL and API key, nothing else changes.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr" }} className="qs-grid">

        {/* Sidebar nav */}
        <div style={{ borderRight: B }}>
          {/* Steps */}
          <div style={{ padding: "16px 0 8px" }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", padding: "0 20px", marginBottom: 8 }}>STEPS</div>
            {steps.map((step, i) => (
              <button key={step.id} onClick={() => setActiveStep(i)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9,
                padding: "9px 20px",
                background: activeStep === i ? "#f0f4ff" : "none",
                border: "none", borderLeft: `2px solid ${activeStep === i ? blue : "transparent"}`,
                cursor: "pointer", textAlign: "left", transition: "all 80ms",
              }}>
                {step.done
                  ? <CheckCircle2 size={14} style={{ color: "#16A34A", flexShrink: 0 }} strokeWidth={2} />
                  : <Circle size={14} style={{ color: activeStep === i ? blue : "#ddd", flexShrink: 0 }} strokeWidth={2} />
                }
                <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: activeStep === i ? 500 : 400, color: activeStep === i ? "#0a0a0a" : "#888" }}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>

          {/* Language */}
          <div style={{ padding: "16px 16px 12px", borderTop: Bs }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>LANGUAGE</div>
            {sdks.map((s) => (
              <button key={s} onClick={() => setSdk(s)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 10px", marginBottom: 4,
                background: sdk === s ? "#111" : "transparent",
                border: `1px solid ${sdk === s ? "#111" : "#eee"}`,
                cursor: "pointer", transition: "all 80ms",
              }}
                onMouseEnter={(e) => { if (sdk !== s) e.currentTarget.style.borderColor = "#999"; }}
                onMouseLeave={(e) => { if (sdk !== s) e.currentTarget.style.borderColor = "#eee"; }}
              >
                <span style={{ fontFamily: F.mono, fontSize: D.label, color: sdk === s ? "#fff" : "#666" }}>{s}</span>
                {sdk === s && <Check size={11} style={{ color: "#888" }} />}
              </button>
            ))}
          </div>

          {/* Resources */}
          <div style={{ padding: "16px", borderTop: Bs, flex: 1 }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>RESOURCES</div>
            {resources.map((r) => (
              <a key={r} href="#" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", fontFamily: F.sans, fontSize: D.body, color: "#888", textDecoration: "none", transition: "color 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
              >
                {r}
                <ExternalLink size={11} style={{ color: "#ddd", flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div style={{ padding: "32px 28px" }}>

          {activeStep === 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CheckCircle2 size={16} style={{ color: "#16A34A" }} strokeWidth={2} />
                <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em" }}>Create an API key</h2>
              </div>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
                Your API key authenticates all requests. Go to the <strong style={{ color: "#111" }}>API Keys</strong> tab to create one. It's shown once — save it in a password manager or secrets vault immediately.
              </p>
              <div style={{ border: "1px solid #dbeafe", background: "#eff6ff", padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 700, color: "#1d4ed8", marginBottom: 6, letterSpacing: "0.06em" }}>YOUR KEY LOOKS LIKE THIS</div>
                <code style={{ fontFamily: F.mono, fontSize: D.label, color: "#333" }}>sk-om-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q8n3</code>
              </div>
              {["Never commit keys to version control", "Use environment variables or a secrets manager", "Set per-key monthly limits to cap spend", "Rotate keys immediately if you suspect a leak"].map((tip) => (
                <div key={tip} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: blue, fontWeight: 700, fontSize: D.body, flexShrink: 0, lineHeight: 1.5 }}>·</span>
                  <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", lineHeight: 1.65 }}>{tip}</span>
                </div>
              ))}
              <NextBtn step={1} />
            </div>
          )}

          {activeStep === 1 && (
            <div>
              <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em", marginBottom: 10 }}>Install the SDK</h2>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
                OpenModels uses the standard OpenAI SDK — just point it at a different base URL. No extra dependencies.
              </p>
              <CodeBlock code={install[sdk]} lang={sdk === "curl" ? "shell" : sdk} />
              <div style={{ marginTop: 14, padding: "12px 16px", border: B, background: "#fafafa", fontFamily: F.sans, fontSize: D.body, color: "#888" }}>
                Any OpenAI-compatible SDK works — LangChain, LlamaIndex, Instructor, and more.
              </div>
              <NextBtn step={2} />
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em", marginBottom: 10 }}>Set your API key</h2>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
                Store your key as an environment variable. Never hard-code it in source files.
              </p>
              <CodeBlock code={envSnippet[sdk]} lang="shell" />
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>USING A .ENV FILE?</div>
                <CodeBlock code={`OM_API_KEY=sk-om-your-api-key\n# Load with python-dotenv, dotenv-cli, or your framework's built-in`} lang=".env" />
              </div>
              <NextBtn step={3} />
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em", marginBottom: 10 }}>Make your first request</h2>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
                Run the snippet below. You should get a response in under a second.
              </p>
              <CodeBlock code={requestSnippet[sdk]} lang={sdk} />
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>EXPECTED RESPONSE</div>
                <CodeBlock code={responseExample} lang="json" />
              </div>
              <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href="#" style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 700, color: blue, textDecoration: "none", border: `1px solid ${blue}`, padding: "9px 18px", letterSpacing: "-0.01em", transition: "all 120ms" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = blue; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = blue; }}
                >View API Reference →</a>
                <a href="#" style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", textDecoration: "none", border: B, padding: "9px 18px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
                >Browse models →</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .qs-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
