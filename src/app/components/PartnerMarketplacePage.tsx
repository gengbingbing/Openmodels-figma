import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowRight, Copy, Check, ExternalLink } from "lucide-react";
import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";

/* ─── Data ──────────────────────────────────────────────── */
interface ContactEntry { label: string; value: string; href?: string; }

interface PartnerMarket {
  slug:        string;
  name:        string;
  tagline:     string;
  desc:        string;
  accentColor: string;
  namespace:   string;
  speciality:  string;
  contacts:    ContactEntry[];   /* only non-empty entries */
  models: {
    id:      string;
    nsId:    string;
    input:   number;
    output:  number;
    context: string;
    route:   "Verified" | "Community";
    status:  "Live";
  }[];
  faqs: { q: string; a: string }[];
}

const PARTNERS: Record<string, PartnerMarket> = {
  "acme-ai": {
    slug: "acme-ai",
    name: "Acme AI",
    tagline: "Acme AI Token Marketplace",
    desc: "Access curated LLM token routes selected by Acme. Transparent pricing, prepaid credits, and OpenAI-compatible API access powered by OpenModels.",
    accentColor: "#0047FF",
    namespace: "acme",
    speciality: "Specialized in curated coding, reasoning, and agent model routes.",
    contacts: [
      { label: "Email",    value: "support@acme.ai",   href: "mailto:support@acme.ai" },
      { label: "Telegram", value: "@acme_ai",           href: "https://t.me/acme_ai"  },
      { label: "Discord",  value: "discord.gg/acme",   href: "https://discord.gg/acme" },
    ],
    models: [
      { id: "deepseek-v3",        nsId: "acme/deepseek-v3",        input: 0.34, output: 0.63, context: "128K", route: "Verified",  status: "Live" },
      { id: "llama-3.1-70b",      nsId: "acme/llama-3.1-70b",      input: 0.46, output: 0.78, context: "128K", route: "Verified",  status: "Live" },
      { id: "qwen-2.5-72b",       nsId: "acme/qwen-2.5-72b",       input: 0.38, output: 0.70, context: "128K", route: "Verified",  status: "Live" },
      { id: "mistral-large",      nsId: "acme/mistral-large",       input: 0.50, output: 0.91, context: "128K", route: "Verified",  status: "Live" },
      { id: "llama-3.1-8b",       nsId: "acme/llama-3.1-8b",       input: 0.06, output: 0.12, context: "128K", route: "Community", status: "Live" },
      { id: "deepseek-r1",        nsId: "acme/deepseek-r1",         input: 0.60, output: 1.44, context: "64K",  route: "Verified",  status: "Live" },
      { id: "qwen-2.5-coder-32b", nsId: "acme/qwen-2.5-coder-32b", input: 0.22, output: 0.46, context: "128K", route: "Community", status: "Live" },
    ],
    faqs: [
      { q: "Is this marketplace operated by Acme or OpenModels?",
        a: "It is operated by Acme and powered by OpenModels infrastructure." },
      { q: "Do I need a separate Acme API key?",
        a: "No. Use your OpenModels API key. If you sign up from this page, your key is linked to the Acme Marketplace." },
      { q: "Why do model IDs start with acme/?",
        a: "The acme/ namespace applies Acme's selected model routes and prices automatically." },
      { q: "Who sets the prices?",
        a: "Prices are configured by Acme based on selected OpenModels provider routes." },
      { q: "Who handles billing?",
        a: "Credits, invoices, and API key management are handled by OpenModels." },
      { q: "Can I use my existing OpenModels credits?",
        a: "Yes. Usage is billed through your OpenModels credit balance at Acme's listed prices." },
      { q: "Are routes verified?",
        a: "Routes may be Verified (curated, monitored provider supply) or Community (open supply). The route type is shown in the models table." },
    ],
  },
};

const DEFAULT_PARTNER = PARTNERS["acme-ai"];

/* ─── Tiny helpers ────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", padding: "3px 9px", cursor: "pointer", fontFamily: F.sans, fontSize: 11, color: copied ? "#22c55e" : "#888", transition: "color 100ms" }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function SectionHeader({ title, desc, id }: { title: string; desc?: string; id?: string }) {
  return (
    <div style={{ padding: "36px 32px 24px" }} id={id}>
      <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: desc ? 6 : 0, letterSpacing: 0 }}>{title}</h2>
      {desc && <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", margin: 0, lineHeight: 1.65 }}>{desc}</p>}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────── */
export function PartnerMarketplacePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const partner   = (slug && PARTNERS[slug]) ? PARTNERS[slug] : DEFAULT_PARTNER;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const partnerParam = slug ?? partner.slug;
  const accent = partner.accentColor;

  const curlExample = `curl https://api.getopenmodels.com/v1/chat/completions \\
  -H "Authorization: Bearer $OPENMODELS_API_KEY" \\
  -H "X-OpenModels-Partner: ${partnerParam}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${partner.namespace}/deepseek-v3",
    "messages": [
      {
        "role": "user",
        "content": "Hello"
      }
    ]
  }'`;

  const navItems = [
    { label: "Models",      href: "#partner-models"     },
    { label: "About",       href: "#partner-about"      },
    { label: "Quickstart",  href: "#partner-quickstart" },
    { label: "Docs",        href: "/docs"               },
    { label: "FAQ",         href: "#partner-faq"        },
  ];

  const baseUrlRows = [
    { label: "BASE URL",        value: "https://api.getopenmodels.com/v1",              mono: true },
    { label: "AUTH",            value: `Authorization: Bearer YOUR_API_KEY`,            mono: true },
    { label: "MODEL NAMESPACE", value: `Use ${partner.namespace}/model-id to access ${partner.name} selected routes.`, mono: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ borderBottom: B, background: "#fff", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", height: 48, display: "flex", alignItems: "center", borderLeft: B, borderRight: B }}>

          {/* Partner logo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 20px", height: "100%", borderRight: B, flexShrink: 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: "#fff" }}>{partner.name.charAt(0)}</span>
            </div>
            <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>{partner.name}</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", height: "100%", flex: 1 }} className="partner-nav">
            {navItems.map(({ label, href }) => (
              <a key={label} href={href}
                style={{ fontFamily: F.sans, fontSize: 14, color: "#777", textDecoration: "none", padding: "0 14px", height: "100%", display: "flex", alignItems: "center", transition: "color 120ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
              >{label}</a>
            ))}
          </nav>

          {/* CTAs — identical to OpenModels official header */}
          <div style={{ display: "flex", alignItems: "center", height: "100%", marginLeft: "auto" }}>
            <button onClick={() => navigate(`/sign-in?partner=${partnerParam}`)}
              style={{ fontFamily: F.sans, fontSize: 14, color: "#777", background: "none", border: "none", borderLeft: B, padding: "0 16px", height: "100%", cursor: "pointer", transition: "color 120ms", whiteSpace: "nowrap" as const }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
            >Sign in</button>
            <button onClick={() => navigate(`/sign-up?partner=${partnerParam}`)}
              style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderLeft: "1px solid #111", padding: "0 22px", height: "100%", cursor: "pointer", transition: "background 150ms", whiteSpace: "nowrap" as const, borderRadius: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
            >Get API key</button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ borderBottom: B }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ padding: "52px 32px 40px", display: "flex", alignItems: "flex-start", gap: 48, flexWrap: "wrap" }} className="partner-hero">

            {/* Left — main copy */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: accent, letterSpacing: "0.06em", marginBottom: 12 }}>MARKETPLACE</div>
              <h1 style={{ fontFamily: F.sans, fontSize: 40, fontWeight: 700, color: "#0a0a0a", marginBottom: 14, letterSpacing: "-0.025em", lineHeight: 1.1 }} className="partner-h1">
                {partner.tagline}
              </h1>
              <p style={{ fontFamily: F.sans, fontSize: 16, color: "#555", lineHeight: 1.65, marginBottom: 16, maxWidth: 520 }}>
                {partner.desc}
              </p>
              {/* Operated-by line */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>Operated by {partner.name}</span>
                <span style={{ color: "#D5D5D5" }}>·</span>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>Powered by OpenModels</span>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <button onClick={() => navigate(`/sign-up?partner=${partnerParam}`)}
                  style={{ height: 40, padding: "0 18px", fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#fff", background: "#111", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 150ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
                >Get API key <ArrowRight size={13} strokeWidth={1.75} /></button>
                <a href="#partner-models"
                  style={{ height: 40, padding: "0 18px", fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: "#444", background: "#fff", border: B, textDecoration: "none", display: "inline-flex", alignItems: "center", transition: "border-color 120ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#B0B0B0")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
                >Browse models</a>
              </div>

              {/* Stat row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>{partner.models.length} models</span>
                <span style={{ color: "#D5D5D5" }}>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A", flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>live prices</span>
                </span>
                <span style={{ color: "#D5D5D5" }}>·</span>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>updated 2m ago</span>
              </div>
            </div>

            {/* Right — model count stat */}
            <div style={{ flexShrink: 0, textAlign: "right", alignSelf: "center" }}>
              <div style={{ fontFamily: F.mono, fontSize: 48, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
                {partner.models.length}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 4 }}>Models</div>
              <div style={{ fontFamily: F.sans, fontSize: 12, color: "#B0B0B0" }}>Curated by {partner.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust Strip ─────────────────────────────────────── */}
      <div style={{ borderBottom: B, background: "#FAFAFA" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "11px 32px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#B0B0B0", letterSpacing: "0.06em" }}>POWERED BY OPENMODELS INFRASTRUCTURE</span>
          {["OpenAI-compatible API", "Credit-based billing", "Provider-route pricing", "Transparent usage"].map((item) => (
            <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: F.sans, fontSize: WS.meta, color: "#999" }}>
              <Check size={9} color="#16A34A" strokeWidth={2.5} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Models ─────────────────────────────────────────── */}
      <div id="partner-models" style={{ borderBottom: B }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <SectionHeader
            title="Available models"
            desc={`Models selected and priced by ${partner.name}. API access, credits, and usage accounting are powered by OpenModels.`}
          />
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 96px 96px 72px 88px 68px", padding: "9px 32px", background: "#FAFAFA", borderTop: B, borderBottom: Bs }}>
            {["Model", "Input /1M", "Output /1M", "Context", "Route", "Status"].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{h}</span>
            ))}
          </div>
          {partner.models.map((m, i) => (
            <div key={m.id}
              style={{ display: "grid", gridTemplateColumns: "1fr 96px 96px 72px 88px 68px", padding: "0 32px", minHeight: 56, borderBottom: i < partner.models.length - 1 ? Bs : "none", alignItems: "center", cursor: "pointer", transition: "background 80ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ fontFamily: F.mono, fontSize: 13, color: "#111", fontWeight: 500 }}>{m.nsId}</code>
              </div>
              <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums" }}>${m.input.toFixed(2)}</span>
              <span style={{ fontFamily: F.mono, fontSize: 13, color: "#555", fontVariantNumeric: "tabular-nums" }}>${m.output.toFixed(2)}</span>
              <span style={{ fontFamily: F.mono, fontSize: 13, color: "#AAAAAA" }}>{m.context}</span>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: m.route === "Verified" ? "#2563EB" : "#92400E" }}>{m.route}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 11, color: "#15803D" }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />Live
              </span>
            </div>
          ))}
          <div style={{ padding: "11px 32px", borderTop: B }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>
              Prices set by {partner.name}. Billed through your OpenModels credit balance.
            </span>
          </div>
        </div>
      </div>

      {/* ── About ──────────────────────────────────────────── */}
      <div id="partner-about" style={{ borderBottom: B }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <SectionHeader title={`About ${partner.name}`} />
          <div style={{ padding: "0 32px 36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="partner-about-grid">
            {/* Left — description */}
            <div style={{ paddingRight: 40, borderRight: Bs }}>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>
                {partner.name} is an independent marketplace operator running on OpenModels infrastructure. We curate model routes, set transparent per-token pricing, and give developers a stable namespace for calling models.
              </p>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555", lineHeight: 1.75, margin: 0 }}>
                {partner.speciality}
              </p>
            </div>
            {/* Right — contact rows */}
            <div style={{ paddingLeft: 40 }}>
              {/* Operator row — always shown */}
              <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", padding: "11px 0", borderBottom: Bs, alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#B8B8B8", letterSpacing: "0.06em" }}>OPERATOR</span>
                <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555" }}>{partner.name}</span>
              </div>
              {/* Dynamic contacts — only non-empty */}
              {partner.contacts.map((c) => (
                <div key={c.label} style={{ display: "grid", gridTemplateColumns: "90px 1fr", padding: "11px 0", borderBottom: Bs, alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#B8B8B8", letterSpacing: "0.06em" }}>{c.label.toUpperCase()}</span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: F.sans, fontSize: WS.body, color: "#444", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "color 100ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
                    >{c.value} <ExternalLink size={10} strokeWidth={1.5} /></a>
                  ) : (
                    <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555" }}>{c.value}</span>
                  )}
                </div>
              ))}
              {/* API key note — always last */}
              <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", padding: "11px 0", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#B8B8B8", letterSpacing: "0.06em", paddingTop: 2 }}>API KEY</span>
                <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#777", lineHeight: 1.6 }}>Managed by OpenModels and linked to this marketplace when you sign up from this page.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quickstart ─────────────────────────────────────── */}
      <div id="partner-quickstart" style={{ borderBottom: B }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <SectionHeader
            title={`Quickstart`}
            desc={`Call ${partner.name} models through one OpenAI-compatible API in three steps.`}
          />
          <div style={{ padding: "0 32px 36px" }}>
            {/* 3-step list */}
            <div style={{ display: "flex", gap: 0, marginBottom: 24, border: B }} className="qs-steps">
              {[
                { n: 1, title: "Get an API key",  note: "Create your OpenModels account from this page. Your key is automatically linked to Acme Marketplace." },
                { n: 2, title: "Add credits",      note: "Top up your OpenModels credit balance. Usage is billed per token at Acme's listed prices." },
                { n: 3, title: `Call an ${partner.name} model`, note: `Use ${partner.namespace}/model-id in your request. The namespace applies ${partner.name}'s selected routes and pricing.` },
              ].map((step, i, arr) => (
                <div key={step.n} style={{ flex: 1, padding: "18px 20px", borderRight: i < arr.length - 1 ? Bs : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: "#fff" }}>{step.n}</span>
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#111" }}>{step.title}</span>
                  </div>
                  <p style={{ fontFamily: F.sans, fontSize: 12, color: "#777", lineHeight: 1.65, margin: 0 }}>{step.note}</p>
                </div>
              ))}
            </div>

            {/* API reference rows */}
            <div style={{ border: B, marginBottom: 20 }}>
              {baseUrlRows.map((row, i) => (
                <div key={row.label} style={{ display: "grid", gridTemplateColumns: "150px 1fr", padding: "11px 16px", borderBottom: i < baseUrlRows.length - 1 ? Bs : "none", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em" }}>{row.label}</span>
                  {row.mono ? (
                    <code style={{ fontFamily: F.mono, fontSize: 12, color: "#333" }}>{row.value}</code>
                  ) : (
                    <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#555" }}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Code block */}
            <div style={{ background: "#0a0a0a", overflow: "hidden", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: "#555" }}>bash</span>
                <CopyBtn text={curlExample} />
              </div>
              <pre style={{ margin: 0, padding: "16px", fontFamily: F.mono, fontSize: 12, color: "#e5e5e5", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.75 }}>{curlExample}</pre>
            </div>
            <p style={{ fontFamily: F.sans, fontSize: 11, color: "#C0C0C0", margin: 0 }}>
              Usage from this example is attributed to {partner.name}.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <div id="partner-faq" style={{ borderBottom: B }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <SectionHeader title="FAQ" />
          <div style={{ padding: "0 32px 36px" }}>
            {partner.faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < partner.faqs.length - 1 ? Bs : "none" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}
                >
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>{faq.q}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 16, color: "#D0D0D0", flexShrink: 0, lineHeight: 1 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 0 15px", fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.75, maxWidth: 640 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: B }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: F.sans, fontSize: 9, fontWeight: 700, color: "#fff" }}>{partner.name.charAt(0)}</span>
            </div>
            <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#333" }}>{partner.name}</span>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0", marginLeft: 8 }}>marketplace</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href={`mailto:${partner.support}`} style={{ fontFamily: F.sans, fontSize: 12, color: "#C0C0C0", textDecoration: "none", transition: "color 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#777")} onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}
            >Support</a>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: "#D5D5D5" }}>·</span>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: "#C0C0C0" }}>
              Powered by{" "}
              <a href="https://openmodels.market" target="_blank" rel="noopener noreferrer"
                style={{ color: "#A3A3A3", textDecoration: "none", transition: "color 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#555")} onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}
              >OpenModels</a>
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .partner-about-grid { grid-template-columns: 1fr !important; }
          .partner-about-grid > *:first-child { border-right: none !important; padding-right: 0 !important; border-bottom: 1px solid #eeeeee; padding-bottom: 24px; margin-bottom: 24px; }
          .partner-about-grid > *:last-child { padding-left: 0 !important; }
          .qs-steps { flex-direction: column !important; }
          .qs-steps > * { border-right: none !important; border-bottom: 1px solid #eeeeee; }
          .qs-steps > *:last-child { border-bottom: none !important; }
        }
        @media (max-width: 768px) {
          .partner-nav { display: none !important; }
          .partner-h1 { font-size: 28px !important; }
          .partner-hero { padding: 36px 20px 32px !important; flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
