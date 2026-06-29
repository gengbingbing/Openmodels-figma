import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ExternalLink, Copy, Check, ChevronRight } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SEO, JsonLd, breadcrumbLd, faqLd } from "../lib/seo";
import { allModels } from "../lib/models-data";
import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

/* ─── Provider catalogue ─────────────────────────────────── */
interface ProviderMeta {
  slug:         string;
  name:         string;
  website:      string;
  trust:        "Verified" | "Community";
  uptime:       string;
  avgLatency:   string;
  locations:    string;
  dataPolicy:   string;
  reviewStatus: string;
  failureMode:  string;
}

const PROVIDERS: ProviderMeta[] = [
  { slug: "groq",       name: "Groq",       website: "groq.com",        trust: "Verified",  uptime: "99.9%", avgLatency: "180ms",  locations: "US",        dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
  { slug: "together",   name: "Together AI", website: "together.ai",    trust: "Verified",  uptime: "99.7%", avgLatency: "760ms",  locations: "US / EU",   dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
  { slug: "novita",     name: "Novita",      website: "novita.ai",      trust: "Verified",  uptime: "99.8%", avgLatency: "780ms",  locations: "US / SG",   dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
  { slug: "fireworks",  name: "Fireworks",   website: "fireworks.ai",   trust: "Verified",  uptime: "99.5%", avgLatency: "760ms",  locations: "US",        dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
  { slug: "deepseek",   name: "DeepSeek",    website: "deepseek.com",   trust: "Verified",  uptime: "99.2%", avgLatency: "910ms",  locations: "CN / US",   dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
  { slug: "alibaba",    name: "Alibaba",     website: "alibabacloud.com",trust:"Verified",  uptime: "99.5%", avgLatency: "540ms",  locations: "CN / US",   dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
  { slug: "replicate",  name: "Replicate",   website: "replicate.com",  trust: "Community", uptime: "98.8%", avgLatency: "950ms",  locations: "US",        dataPolicy: "Check provider privacy policy",              reviewStatus: "Automated validation only",        failureMode: "Users must opt into community supply" },
  { slug: "deepinfra",  name: "DeepInfra",   website: "deepinfra.com",  trust: "Community", uptime: "98.2%", avgLatency: "620ms",  locations: "US / EU",   dataPolicy: "Check provider privacy policy",              reviewStatus: "Automated validation only",        failureMode: "Users must opt into community supply" },
  { slug: "mistral",    name: "Mistral",     website: "mistral.ai",     trust: "Verified",  uptime: "99.4%", avgLatency: "880ms",  locations: "EU",        dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
  { slug: "minimax",    name: "MiniMax",     website: "minimax.io",     trust: "Verified",  uptime: "99.3%", avgLatency: "640ms",  locations: "CN / US",   dataPolicy: "Prompts are not used for training",          reviewStatus: "Reviewed for production usage",    failureMode: "Unavailable routes are removed from default routing" },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ─── Helpers ─────────────────────────────────────────────── */
function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: copied ? "#15803D" : "#555", background: "#F5F5F5", border: B, borderRadius: 4, padding: "4px 10px", cursor: "pointer", transition: "all 100ms" }}
      onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = "#EBEBEB"; e.currentTarget.style.color = "#111"; }}}
      onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#555"; }}}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : label}
    </button>
  );
}

const avC = (av: string) =>
  av === "Live"    ? { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#16A34A" } :
  av === "Limited" ? { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#D97706" } :
                     { bg: "#F5F5F5", border: "#E5E5E5", text: "#737373", dot: "#A3A3A3" };

/* ─── FAQ accordion item ─────────────────────────────────── */
function FaqItem({ q, a, isLast }: { q: string; a: string; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: isLast ? "none" : Bs }}>
      <button onClick={() => setOpen((v) => !v)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
        <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>{q}</span>
        <ChevronRight size={13} color="#C0C0C0" strokeWidth={2} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 150ms", flexShrink: 0 }} />
      </button>
      {open && <div style={{ padding: "0 0 14px", fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7, maxWidth: 640 }}>{a}</div>}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export function ProviderDetailPage() {
  const { providerSlug } = useParams<{ providerSlug: string }>();
  const navigate = useNavigate();
  const goAuth   = () => navigate("/", { state: { openAuth: true } });

  const provider = PROVIDERS.find((p) => p.slug === providerSlug);

  /* Gather all routes for this provider from models data */
  const providerRoutes = allModels.flatMap((m) =>
    (m.providerRoutes ?? [])
      .filter((r) => slugify(r.provider) === providerSlug)
      .map((r) => ({ modelId: m.id, modelName: m.shortName, context: m.context, ...r }))
  ).sort((a, b) => a.input - b.input);

  const uniqueModels = new Set(providerRoutes.map((r) => r.modelId)).size;

  if (!provider) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
        <Header onDashboard={goAuth} />
        <div style={{ paddingTop: 84 }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B, padding: "80px 32px" }}>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#888" }}>Provider not found.</p>
            <Link to="/models" style={{ fontFamily: F.sans, fontSize: WS.body, color: blue, textDecoration: "none" }}>← Back to models</Link>
          </div>
        </div>
      </div>
    );
  }

  const curlExample = `curl https://api.getopenmodels.com/v1/chat/completions \\
  -H "Authorization: Bearer $OM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.1-70b",
    "provider": "${provider.slug}",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'`;

  const trustBadge = provider.trust === "Verified"
    ? { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", label: "Verified provider" }
    : { bg: "#FFF7ED", border: "#FED7AA", text: "#92400E", label: "Community provider" };

  const stats = [
    { value: String(providerRoutes.length || "—"), label: "Routes"         },
    { value: "2.8M",                               label: "Tokens routed"  },
    { value: "184K",                               label: "Requests"       },
    { value: provider.avgLatency,                  label: "Avg latency"    },
  ];

  const trustRows = [
    { label: "Trust level",        value: provider.trust },
    { label: "Review status",      value: provider.reviewStatus },
    { label: "Uptime",             value: provider.uptime },
    { label: "Inference location", value: provider.locations },
    { label: "Data policy",        value: provider.dataPolicy },
    { label: "Last health check",  value: "2m ago" },
    { label: "Failure handling",   value: provider.failureMode },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
      <SEO
        title={`${provider.name} Provider Routes | OpenModels`}
        description={`View ${provider.name} provider routes on OpenModels. Compare model token prices, context, availability, uptime, and route trust level.`}
        path={`/providers/${provider.slug}`}
      />
      <JsonLd id={`bc-${provider.slug}`} data={breadcrumbLd([
        { name: "OpenModels", url: "https://openmodels.market" },
        { name: "Models",     url: "https://openmodels.market/models" },
        { name: provider.name, url: `https://openmodels.market/providers/${provider.slug}` },
      ])} />
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

          {/* ── Page header ── */}
          <div style={{ padding: "32px 32px 28px", borderBottom: B, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>PROVIDER</span>
              <h1 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 6, letterSpacing: 0 }}>{provider.name}</h1>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: "0 0 12px" }}>
                {provider.trust === "Verified" ? "Verified provider routes for open model inference." : "Community provider routes. Users opt in when selecting community supply."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: trustBadge.text, background: trustBadge.bg, border: `1px solid ${trustBadge.border}`, borderRadius: 999, padding: "2px 8px" }}>{trustBadge.label}</span>
                <span style={{ color: "#D5D5D5" }}>·</span>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>{providerRoutes.length} routes</span>
                <span style={{ color: "#D5D5D5" }}>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />
                  <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>live</span>
                </span>
                <span style={{ color: "#D5D5D5" }}>·</span>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>checked 2m ago</span>
              </div>
            </div>
            {/* Right: website link */}
            <div style={{ flexShrink: 0, paddingTop: 4 }}>
              <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: F.sans, fontSize: WS.body, color: "#555", textDecoration: "none", transition: "color 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = blue)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                {provider.website} <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="prov-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: B }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ minHeight: 88, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px", borderRight: i < 3 ? Bs : "none" }}>
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: 24, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 12, color: "#777" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Routes table ── */}
          <div style={{ borderBottom: B }}>
            <div style={{ padding: "20px 32px", borderBottom: B, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>TOKEN ROUTES</span>
                <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", margin: 0, letterSpacing: 0, lineHeight: 1.2 }}>Available token routes</h2>
              </div>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.55, margin: 0, maxWidth: 460, paddingTop: 18, flexShrink: 1 }}>
                Compare routes by token price, cache price, context, and live status.
              </p>
            </div>

            {providerRoutes.length === 0 ? (
              <div style={{ padding: "48px 32px", textAlign: "center" }}>
                <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#A3A3A3" }}>No routes found for this provider.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "36%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "12%" }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#FAFAFA" }}>
                      {[
                        { h: "Model",       align: "left"  },
                        { h: "Input /1M",   align: "right" },
                        { h: "Output /1M",  align: "right" },
                        { h: "Cache /1M",   align: "right" },
                        { h: "Context",     align: "right" },
                        { h: "Status",      align: "right" },
                      ].map(({ h, align }) => (
                        <th key={h} style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: "#B8B8B8", padding: "10px 24px", height: 44, textAlign: align as "left" | "right", borderBottom: "1px solid #F0F0F0", letterSpacing: "0.04em", whiteSpace: "nowrap", textTransform: "uppercase" as const }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {providerRoutes.map((r, i) => (
                      <tr key={`${r.modelId}-${i}`} style={{ borderBottom: i < providerRoutes.length - 1 ? "1px solid #F0F0F0" : "none", height: 64, transition: "background 80ms", cursor: "pointer" }}
                        onClick={() => navigate(`/models/${r.modelId}`)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "0 24px" }}>
                          <span style={{ fontFamily: F.mono, fontSize: WS.body, color: "#111", fontWeight: 500 }}>{r.modelId}</span>
                        </td>
                        <td style={{ padding: "0 24px", fontFamily: F.mono, fontSize: WS.body, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>${r.input.toFixed(2)}</td>
                        <td style={{ padding: "0 24px", fontFamily: F.mono, fontSize: WS.body, color: "#555", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{r.output > 0 ? `$${r.output.toFixed(2)}` : "—"}</td>
                        <td style={{ padding: "0 24px", fontFamily: F.mono, fontSize: WS.body, color: "#888", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>—</td>
                        <td style={{ padding: "0 24px", fontFamily: F.mono, fontSize: WS.body, color: "#AAAAAA", textAlign: "right" }}>{r.context}</td>
                        <td style={{ padding: "0 24px", textAlign: "right" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 11, color: "#15803D" }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />Live
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Quickstart ── */}
          <div style={{ padding: "40px 32px", borderBottom: B }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>QUICKSTART</span>
            <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 6, letterSpacing: 0 }}>Use this provider route</h2>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: "0 0 20px", maxWidth: 560 }}>
              Pass the provider name when you want traffic to use this provider instead of the default lowest verified route.
            </p>
            {/* Light gray code block */}
            <div style={{ background: "#F7F7F7", border: "1px solid #E5E5E5", borderRadius: 4, marginBottom: 12, overflow: "hidden" }}>
              <pre style={{ margin: 0, padding: "16px 20px", fontFamily: F.mono, fontSize: 12, color: "#111", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.7 }}>
                {curlExample}
              </pre>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <CopyBtn text={curlExample} label="Copy curl" />
              <a href="/docs" style={{ display: "inline-flex", alignItems: "center", fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: "#555", background: "#F5F5F5", border: B, borderRadius: 4, padding: "4px 10px", textDecoration: "none", transition: "all 100ms" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#EBEBEB"; e.currentTarget.style.color = "#111"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F5F5"; e.currentTarget.style.color = "#555"; }}
              >View docs</a>
            </div>
            <p style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3", margin: 0 }}>
              Omit <code style={{ fontFamily: F.mono, fontSize: WS.meta, color: "#888" }}>provider</code> to use the default lowest verified route.
            </p>
          </div>

          {/* ── Trust & Policy ── */}
          <div style={{ padding: "40px 32px", borderBottom: B }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>TRUST</span>
            <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 20, letterSpacing: 0 }}>Route trust and policy</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {trustRows.map((row, i) => (
                <div key={row.label} style={{ display: "grid", gridTemplateColumns: "220px 1fr", padding: "13px 0", borderBottom: i < trustRows.length - 1 ? Bs : "none", alignItems: "start" }}>
                  <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const, paddingTop: 1 }}>{row.label}</span>
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#333", lineHeight: 1.5 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          {(() => {
            const faqs = [
              { q: `What is ${provider.name} on OpenModels?`,               a: `${provider.name} offers token routes for supported models on OpenModels. Each route has its own pricing, availability, latency, and trust level.` },
              { q: "What does a provider route mean?",                       a: "A provider route is the path used to serve a model request. It includes the model, provider, token price, availability, and route status." },
              { q: `How is pricing calculated for ${provider.name} routes?`, a: "Pricing is based on actual input and output token usage. Prices are shown per 1M tokens, and cache pricing is shown when supported." },
              { q: `How do I use ${provider.name} provider routes?`,         a: `Pass the provider identifier in your API request to route traffic through ${provider.name}. If no provider is specified, OpenModels uses the default lowest verified route when available.` },
              { q: `Is ${provider.name} verified or community-submitted?`,   a: provider.trust === "Verified" ? `${provider.name} is a verified provider, reviewed for production usage on OpenModels.` : `${provider.name} is a community provider submitted through OpenModels. Users can opt in to use community routes from model detail pages.` },
            ];
            return (
              <>
                <JsonLd id={`faq-${provider.slug}`} data={faqLd(faqs)} />
                <div style={{ padding: "40px 32px", borderBottom: B }}>
                  <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>FAQ</span>
                  <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 4, letterSpacing: 0 }}>Provider route questions</h2>
                  <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", margin: "0 0 20px" }}>Common questions about this provider's token routes on OpenModels.</p>
                  <div>
                    {faqs.map((faq, i) => (
                      <FaqItem key={i} q={faq.q} a={faq.a} isLast={i === faqs.length - 1} />
                    ))}
                  </div>
                </div>
              </>
            );
          })()}

          {/* ── Footer CTA ── */}
          <div style={{ padding: "20px 32px" }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.body, color: "#888", marginRight: 12 }}>Want to list your own token routes?</span>
            <a href="/providers/apply" style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "opacity 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Become a provider <ChevronRight size={13} strokeWidth={1.5} /></a>
          </div>

        </div>
      </div>

      <Footer onGetKey={goAuth} />

      <style>{`
        @media (max-width: 768px) {
          .prov-stats { grid-template-columns: 1fr 1fr !important; }
          .prov-stats > div { border-right: none !important; border-bottom: 1px solid #eeeeee; }
        }
      `}</style>
    </div>
  );
}
