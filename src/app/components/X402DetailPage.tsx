import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronRight, Check, Copy, Plus, Minus } from "lucide-react";
import { F, WS } from "../lib/type";
import { X402_ENDPOINTS } from "./X402Page";
import { Header } from "./Header";
import { Footer } from "./Footer";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";
const S = { sans: "var(--font-sans, 'Geist', system-ui, sans-serif)", mono: "var(--font-mono, 'Geist Mono', monospace)" };

/* ─── Data ───────────────────────────────────────────────── */
interface X402Model {
  model: string; provider: string; price: string;
  input: string | null; output: string | null; status: "Live";
}

const ENDPOINT_MODELS: Record<string, X402Model[]> = {
  "images-generations": [
    { model: "gpt-image-2",          provider: "OpenAI",       price: "0.1 USDC / call", input: null,  output: null,  status: "Live" },
    { model: "dall-e-3",             provider: "OpenAI",       price: "0.1 USDC / call", input: null,  output: null,  status: "Live" },
    { model: "stable-diffusion-xl",  provider: "Stability AI", price: "0.05 USDC / call", input: null, output: null,  status: "Live" },
  ],
  "images-edits": [
    { model: "gpt-image-2",  provider: "OpenAI", price: "0.1 USDC / call", input: null, output: null, status: "Live" },
    { model: "dall-e-3",     provider: "OpenAI", price: "0.1 USDC / call", input: null, output: null, status: "Live" },
  ],
  "videos-generations": [
    { model: "runway-gen3",  provider: "Runway",  price: "1.0 USDC / call",  input: null, output: null, status: "Live" },
    { model: "sora",         provider: "OpenAI",  price: "10 USDC / call",   input: null, output: null, status: "Live" },
  ],
  "chat-completions": [
    { model: "gpt-4o",            provider: "OpenAI",    price: "0.1 USDC / call",  input: "$5.00",  output: "$15.00", status: "Live" },
    { model: "claude-3-5-sonnet", provider: "Anthropic", price: "0.08 USDC / call", input: "$3.00",  output: "$15.00", status: "Live" },
    { model: "deepseek-v3",       provider: "DeepSeek",  price: "0.02 USDC / call", input: "$0.28",  output: "$0.55",  status: "Live" },
  ],
};

const CURL_EXAMPLES: Record<string, string> = {
  "images-generations": `curl https://pay.alephant.io/x402/images/generations \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-image-2",
    "prompt": "A clean API marketplace interface"
  }'`,
  "images-edits": `curl https://pay.alephant.io/x402/images/edits \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-image-2",
    "image": "<base64_image>",
    "prompt": "Make the background white"
  }'`,
  "videos-generations": `curl https://pay.alephant.io/x402/videos/generations \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "runway-gen3",
    "prompt": "A timelapse of a city at night"
  }'`,
  "chat-completions": `curl https://pay.alephant.io/x402/chat/completions \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{ "role": "user", "content": "Hello" }]
  }'`,
};

const FAQS = [
  { q: "What is x402?", a: "x402 is an open payment protocol for HTTP APIs. It lets clients pay per API call with USDC, with no account or API key required. The server returns HTTP 402 with payment details, and the client pays on-chain." },
  { q: "Do I need OpenModels credits?", a: "No. x402 endpoints use on-chain USDC payments per call. Credits are not required and not used." },
  { q: "Do I need an API key?", a: "No. x402 endpoints require only a valid USDC payment. There is no OpenModels API key involved in x402 calls." },
  { q: "What does 'up to 10 USDC' mean?", a: "The max payment is the ceiling you authorize per call. Actual charges depend on the model and output. You are never charged more than the stated maximum." },
  { q: "Which networks are supported?", a: "Base and Solana. Both support USDC. Choose the network your wallet or agent supports." },
  { q: "When should I use credits instead?", a: "For production workloads, high volume, or when you want predictable billing, use OpenModels credits with an API key. x402 is best for agents, one-off calls, or no-account use cases." },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: copied ? "#16A34A" : "#555", background: "#F5F5F5", border: B, borderRadius: 4, padding: "4px 10px", cursor: "pointer", transition: "all 100ms" }}
      onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = "#EBEBEB"; e.currentTarget.style.color = "#111"; }}}
      onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#555"; }}}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : label}
    </button>
  );
}

function LiveBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 999, padding: "2px 8px" }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A" }} />Live
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div style={{ position: "relative", background: "#0a0a0a", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 8, right: 8 }}>
        <CopyBtn text={code} />
      </div>
      <pre style={{ margin: 0, padding: "14px 14px 14px 14px", fontFamily: S.mono, fontSize: 12, color: "#e5e5e5", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.7 }}>{code}</pre>
    </div>
  );
}

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? Bs : "none" }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16, transition: "opacity 80ms" }}>
            <span style={{ fontFamily: S.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>{item.q}</span>
            <span style={{ color: "#ccc", flexShrink: 0 }}>{open === i ? <Minus size={13} strokeWidth={2} /> : <Plus size={13} strokeWidth={2} />}</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 0 14px", fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7 }}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const SKILL_URL = "openmodels.market/SKILL.md";

function SkillPill() {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(SKILL_URL).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, width: "100%", fontFamily: S.mono, fontSize: 12, fontWeight: 500, color: copied ? "#15803D" : "#444", background: copied ? "#F0FDF4" : "#fff", border: `1px solid ${copied ? "#BBF7D0" : "#D5D5D5"}`, borderRadius: 4, padding: "7px 12px", cursor: "pointer", transition: "all 150ms", textAlign: "left" as const }}>
      {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} />}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{copied ? "Copied!" : SKILL_URL}</span>
    </button>
  );
}

function LightCodeBlock({ code }: { code: string }) {
  return (
    <div style={{ background: "#FAFAFA", border: "1px solid #E5E5E5", borderRadius: 4, overflow: "hidden" }}>
      <pre style={{ margin: 0, padding: "12px 14px", fontFamily: S.mono, fontSize: 12, color: "#111", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.7 }}>{code}</pre>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export function X402DetailPage() {
  const { endpointId } = useParams<{ endpointId: string }>();
  const navigate = useNavigate();
  const ep = X402_ENDPOINTS.find((e) => e.id === endpointId);
  const goAuth = () => navigate("/", { state: { openAuth: true } });

  if (!ep) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: S.sans }}>
        <Header onDashboard={goAuth} />
        <div style={{ paddingTop: 84, maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B, padding: "80px 32px" }}>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#888" }}>Endpoint not found.</p>
          <Link to="/x402" style={{ fontFamily: S.sans, fontSize: WS.body, color: blue, textDecoration: "none" }}>← x402 Endpoints</Link>
        </div>
      </div>
    );
  }

  const models = ENDPOINT_MODELS[ep.id] ?? [];
  const curl   = CURL_EXAMPLES[ep.id] ?? "";
  const baseUrl = `https://pay.alephant.io${ep.path}`;
  const forwardUrl = `https://api.getopenmodels.com/v1${ep.path.replace("/x402", "")}`;
  const hasInputOutput = models.some((m) => m.input !== null);

  const agentMeta = JSON.stringify({
    endpoint: ep.path,
    method: "POST",
    currency: "USDC",
    price_from: String(ep.priceFrom),
    max_payment: String(ep.priceMax),
    base_url: baseUrl,
    forward_to: forwardUrl,
  }, null, 2);

  return (
    <>
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84, background: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

        {/* Breadcrumb */}
        <div style={{ padding: "10px 32px", borderBottom: B, display: "flex", alignItems: "center", gap: 6, background: "#fafafa" }}>
          <Link to="/x402" style={{ fontFamily: S.sans, fontSize: 11, color: "#0047FF", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >x402 Endpoints</Link>
          <ChevronRight size={10} color="#bbb" />
          <span style={{ fontFamily: S.sans, fontSize: 11, color: "#888" }}>{ep.name}</span>
        </div>

        {/* Header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 10 }}>x402 · ENDPOINT</span>
          <h1 style={{ fontFamily: S.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 10, letterSpacing: 0 }}>{ep.name}</h1>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.7, margin: "0 0 16px", maxWidth: 540 }}>{ep.description}</p>

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: S.mono, fontSize: WS.meta, fontWeight: 700, color: "#fff", background: "#111", padding: "2px 8px", borderRadius: 4 }}>POST</span>
            <span style={{ fontFamily: S.mono, fontSize: WS.body, color: "#555" }}>{ep.path}</span>
            <span style={{ width: 1, height: 14, background: "#e2e2e2" }} />
            <span style={{ fontFamily: S.mono, fontSize: WS.body, color: "#111", fontVariantNumeric: "tabular-nums" }}>from {ep.priceFrom} USDC / call</span>
            <span style={{ fontFamily: S.mono, fontSize: WS.meta, color: "#aaa" }}>up to {ep.priceMax} USDC</span>
            <LiveBadge />
          </div>
        </div>

        {/* Stats */}
        <div className="x402d-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: B }}>
          {[
            { label: "Supported models", value: String(models.length) },
            { label: "Starting price",   value: `${ep.priceFrom} USDC` },
            { label: "Calls (30d)",      value: ep.calls30d.toLocaleString() },
            { label: "Status",           value: "Live" },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: "16px 24px", borderRight: i < 3 ? "1px solid #eeeeee" : "none" }}>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 5, textTransform: "uppercase" as const }}>{s.label}</div>
              <div style={{ fontFamily: S.mono, fontSize: WS.card, fontWeight: 600, color: s.label === "Status" ? "#15803D" : "#111", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Body: left content + right sidebar */}
        <div className="x402d-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", alignItems: "start" }}>

          {/* ── Left ── */}
          <div style={{ borderRight: B }}>

            {/* Base URL */}
            <div style={{ padding: "28px 32px", borderBottom: B }}>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10, textTransform: "uppercase" as const }}>Base URL</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <code style={{ fontFamily: S.mono, fontSize: WS.body, color: "#111", background: "#F7F7F7", border: B, padding: "8px 14px", flex: 1, display: "block", borderRadius: 0 }}>{baseUrl}</code>
                <CopyBtn text={baseUrl} />
              </div>
              <p style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#C0C0C0", margin: 0 }}>
                Forwarded to <code style={{ fontFamily: S.mono, color: "#C0C0C0", fontSize: WS.meta }}>{forwardUrl}</code>
              </p>
            </div>

            {/* Models table */}
            <div style={{ padding: "28px 32px", borderBottom: B }}>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 14, textTransform: "uppercase" as const }}>Supported models</div>
              <div style={{ border: B, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: hasInputOutput ? 560 : 360 }}>
                  <thead>
                    <tr style={{ background: "#F7F7F7" }}>
                      {(hasInputOutput
                        ? ["Model", "Provider", "Price", "Input / 1M", "Output / 1M", "Status"]
                        : ["Model", "Provider", "Price", "Status"]
                      ).map((h) => (
                        <th key={h} style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#A3A3A3", padding: "9px 16px", textAlign: "left", borderBottom: Bs, letterSpacing: "0.04em", whiteSpace: "nowrap", textTransform: "uppercase" as const }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((m, i) => (
                      <tr key={m.model} style={{ borderBottom: i < models.length - 1 ? Bs : "none", transition: "background 80ms" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: S.mono, fontSize: WS.body, color: "#111", fontWeight: 500 }}>{m.model}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555" }}>{m.provider}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: S.mono, fontSize: WS.body, color: "#111", fontVariantNumeric: "tabular-nums" }}>{m.price}</span>
                        </td>
                        {hasInputOutput && <>
                          <td style={{ padding: "12px 16px", fontFamily: S.mono, fontSize: WS.body, color: "#555", fontVariantNumeric: "tabular-nums" }}>{m.input ?? "—"}</td>
                          <td style={{ padding: "12px 16px", fontFamily: S.mono, fontSize: WS.body, color: "#555", fontVariantNumeric: "tabular-nums" }}>{m.output ?? "—"}</td>
                        </>}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 999, padding: "2px 8px" }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A" }} />Live
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ padding: "28px 32px", borderBottom: B }}>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 14, textTransform: "uppercase" as const }}>FAQ</div>
              <Accordion items={FAQS} />
            </div>

            {/* Agent metadata */}
            <div style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>Agent metadata</div>
                <CopyBtn text={agentMeta} />
              </div>
              <div style={{ background: "#0a0a0a", borderRadius: 4, overflow: "hidden" }}>
                <pre style={{ margin: 0, padding: "14px", fontFamily: S.mono, fontSize: WS.meta, color: "#e5e5e5", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.7 }}>{agentMeta}</pre>
              </div>
              <p style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#C0C0C0", margin: "8px 0 0" }}>
                Agents can use this to discover pricing and call this endpoint directly.
              </p>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ padding: "28px 24px", position: "sticky" as const, top: 104, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Get Started header */}
            <div>
              <div style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#111", marginBottom: 6 }}>Get Started</div>
              <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: 0 }}>
                Level up your agent by giving it access to OpenModels x402 endpoints. Pay per request with USDC. No API keys, no accounts.
              </p>
            </div>

            {/* Install skill */}
            <div>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 5 }}>Install skill</div>
              <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.55, margin: "0 0 10px" }}>
                Paste into your agentic chat and let your agent guide you.
              </p>
              <SkillPill />
            </div>

            {/* Make a Call */}
            <div>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 5 }}>Make a Call</div>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#888", marginBottom: 8 }}>Example request</div>
              <LightCodeBlock code={`npx awal x402 pay "https://pay.alephant.io${ep.path}" \\\n  --method POST`} />
            </div>

            {/* Response */}
            <div>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#888", marginBottom: 8 }}>What you get back</div>
              <LightCodeBlock code={`{\n  "endpoint": "POST ${ep.path}",\n  "paid": true,\n  "query": "example input",\n  "result": {\n    "value": "Structured response from the service."\n  }\n}`} />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <CopyBtn text={`npx awal x402 pay "https://pay.alephant.io${ep.path}" --method POST`} label="Copy command" />
              <a href="#" style={{ display: "inline-flex", alignItems: "center", fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#555", background: "#F5F5F5", border: B, borderRadius: 4, padding: "4px 10px", textDecoration: "none", transition: "all 100ms" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#EBEBEB"; e.currentTarget.style.color = "#111"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#555"; }}
              >View docs</a>
            </div>
          </div>
        </div>
      </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .x402d-grid { grid-template-columns: 1fr !important; }
          .x402d-grid > div:last-child { border-top: 1px solid #e2e2e2; position: static !important; }
          .x402d-stats { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .x402d-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Footer onGetKey={goAuth} />
    </>
  );
}
