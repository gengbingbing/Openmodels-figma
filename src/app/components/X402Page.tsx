import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight, ExternalLink, Copy, Check } from "lucide-react";
import { F, WS } from "../lib/type";
import { SEO, JsonLd, breadcrumbLd, faqLd } from "../lib/seo";
import { Header } from "./Header";
import { Footer } from "./Footer";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";
const S = { sans: "var(--font-sans, 'Geist', system-ui, sans-serif)", mono: "var(--font-mono, 'Geist Mono', monospace)" };

export interface X402Endpoint {
  id:          string;
  name:        string;
  path:        string;
  priceFrom:   number;
  priceMax:    number;
  status:      "Live" | "Beta" | "Coming soon";
  description: string;
  calls30d:    number;
  modelCount:  number;
}

export const X402_ENDPOINTS: X402Endpoint[] = [
  { id: "images-generations", name: "Image Generation",  path: "/x402/images/generations",  priceFrom: 0.1,  priceMax: 10, status: "Live", description: "Generate images with USDC payment. No credits or API key required.", calls30d: 2840, modelCount: 3 },
  { id: "images-edits",       name: "Image Editing",     path: "/x402/images/edits",         priceFrom: 0.1,  priceMax: 10, status: "Live", description: "Edit images using USDC pay-per-call.",                           calls30d: 1220, modelCount: 2 },
  { id: "videos-generations", name: "Video Generation",  path: "/x402/videos/generations",   priceFrom: 1.0,  priceMax: 10, status: "Live", description: "Generate short video clips with USDC payment.",                  calls30d:  380, modelCount: 2 },
  { id: "chat-completions",   name: "Chat Completions",  path: "/x402/chat/completions",     priceFrom: 0.02, priceMax: 10, status: "Live", description: "Chat completions via USDC pay-per-call.",                        calls30d: 4100, modelCount: 3 },
];

function LiveBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A" }} />Live
    </span>
  );
}

const SKILL_URL = "openmodels.market/SKILL.md";

function SkillStrip() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(SKILL_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ borderTop: B, background: "#FAFAFA" }}>
      <div className="skill-strip" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: S.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 3 }}>
            Install the OpenModels skill
          </div>
          <div style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#888" }}>
            Paste once. Your agent can discover x402 endpoints and pay per call with USDC.
          </div>
        </div>
        <button onClick={copy} style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          fontFamily: S.mono, fontSize: WS.meta, fontWeight: 500,
          color: copied ? "#15803D" : "#444",
          background: copied ? "#F0FDF4" : "#fff",
          border: `1px solid ${copied ? "#BBF7D0" : "#D5D5D5"}`,
          borderRadius: 4, padding: "7px 14px",
          cursor: "pointer", transition: "all 150ms", whiteSpace: "nowrap" as const,
          flexShrink: 0,
        }}>
          {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} />}
          {copied ? "Copied!" : SKILL_URL}
        </button>
      </div>
    </div>
  );
}

const STEPS = [
  { n: "01", title: "Choose an endpoint",  text: "Select image, video, or chat based on the task. Each endpoint shows price, max payment, supported models, and live status." },
  { n: "02", title: "Send the request",    text: "Call the x402 URL with a model and payload. The client receives the payment requirement before the request is completed." },
  { n: "03", title: "Get the response",    text: "After USDC payment is settled, OpenModels forwards the request and returns the API result." },
];

function HowItWorks() {
  return (
    <div style={{ borderTop: B }}>
      {/* Top row */}
      <div className="hiw-top" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: B }}>
        <div style={{ padding: "28px 32px", borderRight: B }}>
          <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 10, textTransform: "uppercase" as const }}>How it works</div>
          <div style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#111", lineHeight: 1.4 }}>
            Find an endpoint. Run the call.{" "}
            <span style={{ color: blue }}>Pay only for what was used.</span>
          </div>
        </div>
        <div style={{ padding: "28px 32px" }}>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7, margin: 0 }}>
            x402 gives agents and wallets a direct path to paid OpenModels endpoints: discover an endpoint, review the price, send the request, and receive the response.
          </p>
        </div>
      </div>

      {/* Flow strip */}
      <div style={{ padding: "14px 32px", borderBottom: B, background: "#FAFAFA", display: "flex", alignItems: "center", gap: 10, overflowX: "auto" }}>
        {["DISCOVER", "CALL", "PAY", "RESULT"].map((label, i, arr) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontFamily: S.mono, fontSize: WS.meta, fontWeight: 600, color: "#555", letterSpacing: "0.06em" }}>{label}</span>
            {i < arr.length - 1 && <span style={{ fontFamily: S.mono, fontSize: WS.meta, color: "#C0C0C0" }}>→</span>}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="x402-guide" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {STEPS.map((step, i) => (
          <div key={step.n} style={{ padding: "24px 28px", borderRight: i < 2 ? "1px solid #eeeeee" : "none" }}>
            <div style={{ fontFamily: S.mono, fontSize: WS.meta, fontWeight: 600, color: "#C0C0C0", marginBottom: 10 }}>{step.n}</div>
            <div style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#111", marginBottom: 8 }}>{step.title}</div>
            <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: 0 }}>{step.text}</p>
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <div style={{ padding: "12px 28px", borderTop: B }}>
        <p style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#A3A3A3", margin: 0 }}>
          Use x402 for agents, wallets, and one-off API calls. Use credits and API keys for production workloads.
        </p>
      </div>
    </div>
  );
}

export function X402Page() {
  const navigate = useNavigate();
  const totalCalls = X402_ENDPOINTS.reduce((s, e) => s + e.calls30d, 0);
  const goAuth = () => navigate("/", { state: { openAuth: true } });

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: S.sans }}>
      <SEO
        title="x402 Endpoints | OpenModels"
        description="Pay per API call with USDC using x402 endpoints. Browse supported endpoints, prices, networks, and model availability for agent-friendly paid API calls."
        path="/x402"
      />
      <JsonLd id="breadcrumb-x402" data={breadcrumbLd([{name:"OpenModels",url:"https://openmodels.market"},{name:"x402 Endpoints",url:"https://openmodels.market/x402"}])} />
      <JsonLd id="faq-x402" data={faqLd([{q:"What is x402?",a:"x402 is an open payment protocol for HTTP APIs that lets clients pay per API call with USDC, with no account or API key required."},{q:"Which networks are supported?",a:"Base and Solana. Both support USDC payments."},{q:"Do I need an API key?",a:"No. x402 endpoints require only a valid USDC payment on-chain."}])} />
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

        {/* Header */}
        <div style={{ padding: "28px 32px 24px", borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>x402</span>
            <h1 style={{ fontFamily: S.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 4, letterSpacing: 0 }}>x402 Endpoints</h1>
            <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.5, margin: "0 0 6px", maxWidth: 520 }}>
              Pay per API call with USDC. No credits or API key required.
            </p>
            <p style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#aaa", margin: 0 }}>
              For production usage, use OpenModels credits and API keys.
            </p>
          </div>

          {/* Right: Supported networks */}
          <div className="x402-networks" style={{ flexShrink: 0, maxWidth: 260 }}>
            <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 10 }}>
              Supported Networks
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Base */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, height: 28 }}>
                <svg width="16" height="16" viewBox="0 0 28 28" fill="none" style={{ opacity: 0.92, flexShrink: 0 }}>
                  <circle cx="14" cy="14" r="14" fill="#0052FF"/>
                  <path d="M14.0016 22.6C18.7482 22.6 22.6016 18.7466 22.6016 14C22.6016 9.25338 18.7482 5.4 14.0016 5.4C9.50695 5.4 5.81062 8.8486 5.44141 13.244H16.7016V14.756H5.44141C5.81062 19.1514 9.50695 22.6 14.0016 22.6Z" fill="white"/>
                </svg>
                <span style={{ fontFamily: S.sans, fontSize: WS.body, fontWeight: 500, color: "#333" }}>Base</span>
              </div>
              {/* Solana */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, height: 28 }}>
                <svg width="16" height="16" viewBox="0 0 128 128" fill="none" style={{ opacity: 0.92, flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="sol-a" x1="0" y1="128" x2="128" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9945FF"/>
                      <stop offset="0.5" stopColor="#14F195"/>
                      <stop offset="1" stopColor="#00C2FF"/>
                    </linearGradient>
                  </defs>
                  <path d="M21.1 86.9a4 4 0 0 1 2.8-1.2h90.6c1.8 0 2.7 2.1 1.4 3.4l-17 17a4 4 0 0 1-2.8 1.2H5.5c-1.8 0-2.7-2.1-1.4-3.4l17-17Zm0-65.7A4 4 0 0 1 23.9 20h90.6c1.8 0 2.7 2.1 1.4 3.4l-17 17a4 4 0 0 1-2.8 1.2H5.5c-1.8 0-2.7-2.1-1.4-3.4l17-17Zm87.8 32.9a4 4 0 0 0-2.8-1.2H15.5c-1.8 0-2.7 2.1-1.4 3.4l17 17a4 4 0 0 0 2.8 1.2h90.6c1.8 0 2.7-2.1 1.4-3.4l-17-17Z" fill="url(#sol-a)"/>
                </svg>
                <span style={{ fontFamily: S.sans, fontSize: WS.body, fontWeight: 500, color: "#333" }}>Solana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="x402-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderBottom: B }}>
          {[
            { label: "Endpoints",     value: String(X402_ENDPOINTS.length),          mono: true  },
            { label: "Total calls",   value: totalCalls.toLocaleString(),            mono: true  },
            { label: "Starting from", value: "0.02 USDC",                            mono: true  },
            { label: "Max payment",   value: "10 USDC",                              mono: true  },
            { label: "Networks",      value: "Base · Solana",                        mono: false },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: "16px 24px", borderRight: i < 4 ? "1px solid #eeeeee" : "none" }}>
              <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 5, textTransform: "uppercase" as const }}>{s.label}</div>
              <div style={{ fontFamily: s.mono ? S.mono : S.sans, fontSize: WS.card, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ background: "#F7F7F7" }}>
                {["Endpoint", "Path", "Price", "Max", "Models", "Calls (30d)", "Status"].map((h) => (
                  <th key={h} style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 500, color: "#A3A3A3", padding: "12px 24px", height: 44, textAlign: "left", borderBottom: B, letterSpacing: "0.04em", whiteSpace: "nowrap", textTransform: "uppercase" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {X402_ENDPOINTS.map((ep, i) => (
                <tr key={ep.id}
                  style={{ cursor: "pointer", borderBottom: i < X402_ENDPOINTS.length - 1 ? Bs : "none", transition: "background 80ms" }}
                  onClick={() => navigate(`/x402/endpoints/${ep.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "0 24px", height: 64, verticalAlign: "middle" }}>
                    <span style={{ fontFamily: S.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>{ep.name}</span>
                  </td>
                  <td style={{ padding: "0 24px", height: 64, verticalAlign: "middle" }}>
                    <span style={{ fontFamily: S.mono, fontSize: WS.meta, color: "#555" }}>{ep.path}</span>
                  </td>
                  <td style={{ padding: "0 24px", height: 64, verticalAlign: "middle" }}>
                    <span style={{ fontFamily: S.mono, fontSize: WS.body, color: "#111", fontVariantNumeric: "tabular-nums" }}>from {ep.priceFrom} USDC</span>
                  </td>
                  <td style={{ padding: "0 24px", height: 64, verticalAlign: "middle" }}>
                    <span style={{ fontFamily: S.mono, fontSize: WS.body, color: "#555", fontVariantNumeric: "tabular-nums" }}>up to {ep.priceMax} USDC</span>
                  </td>
                  <td style={{ padding: "0 24px", height: 64, verticalAlign: "middle" }}>
                    <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555" }}>{ep.modelCount}</span>
                  </td>
                  <td style={{ padding: "0 24px", height: 64, verticalAlign: "middle" }}>
                    <span style={{ fontFamily: S.mono, fontSize: WS.body, color: "#555", fontVariantNumeric: "tabular-nums" }}>{ep.calls30d.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: "0 24px", height: 64, verticalAlign: "middle" }}>
                    <LiveBadge />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Install Skill Strip */}
        <SkillStrip />

        {/* How It Works */}
        <HowItWorks />

        {/* Protocol Note */}
        <div style={{ padding: "14px 28px", borderTop: B }}>
          <p style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#C0C0C0", margin: 0 }}>
            x402 endpoints use the{" "}
            <a href="https://x402.org" target="_blank" rel="noopener noreferrer" style={{ color: "#888", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
              x402 payment protocol <ExternalLink size={10} />
            </a>
            . Payments are settled on-chain with USDC.
          </p>
        </div>

      </div>
      </div>
      <Footer onGetKey={goAuth} />

      <style>{`
        @media (max-width: 768px) {
          .x402-networks { max-width: 100% !important; margin-top: 20px; }
          .x402-stats { grid-template-columns: 1fr 1fr !important; }
          .x402-guide { grid-template-columns: 1fr !important; }
          .x402-guide > div { border-right: none !important; border-bottom: 1px solid #eeeeee; }
          .x402-guide > div:last-child { border-bottom: none; }
          .hiw-top { grid-template-columns: 1fr !important; }
          .hiw-top > div:first-child { border-right: none !important; border-bottom: 1px solid #e2e2e2; }
          .skill-strip { flex-direction: column; align-items: flex-start !important; }
        }
        @media (max-width: 480px) {
          .x402-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
