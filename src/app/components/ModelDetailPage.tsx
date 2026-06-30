import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Copy, Check, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { F } from "../lib/type";
import { getModelById, getRelatedModels } from "../lib/models-data";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SupportButton } from "./SupportButton";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";

/* ─── pills ─────────────────────────────────────────── */

type StatusType = "Live" | "Limited" | "Coming soon";
const statusStyle: Record<StatusType, { bg: string; border: string; text: string; dot: string }> = {
  Live:          { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#16A34A" },
  Limited:       { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#D97706" },
  "Coming soon": { bg: "#F5F5F5", border: "#E5E5E5", text: "#737373", dot: "#A3A3A3" },
};

type SupplyType = "Direct" | "Verified" | "Limited";
const supplyStyle: Record<SupplyType, { bg: string; border: string; text: string; dot: string }> = {
  Direct:   { bg: "#f6fef9", border: "#d1fae5", text: "#166534", dot: "#16A34A" },
  Verified: { bg: "#f5f9ff", border: "#dbeafe", text: "#2563eb", dot: "#3B82F6" },
  Limited:  { bg: "#f7f7f7", border: "#e8e8e8", text: "#888",    dot: "#bbb"    },
};

function Pill({ label, color = "gray" }: { label: string; color?: "green" | "blue" | "gray" }) {
  const map = {
    green: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D" },
    blue:  { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
    gray:  { bg: "#F5F5F5", border: "#E5E5E5", text: "#555" },
  };
  const s = map[color];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: s.bg, border: `1px solid ${s.border}`,
      padding: "2px 8px", borderRadius: 999,
      fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: s.text, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = statusStyle[(status as StatusType)] ?? statusStyle["Coming soon"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 999, padding: "2px 8px",
      fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: s.text, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function SupplyPill({ supply }: { supply: string }) {
  const s = supplyStyle[(supply as SupplyType)] ?? supplyStyle.Limited;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 999, padding: "2px 8px",
      fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: s.text, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {supply}
    </span>
  );
}

/* ─── copy hook ─────────────────────────────────────── */

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return { copied, copy };
}

/* ─── section block ─────────────────────────────────── */

function Section({ title, desc, children, id }: {
  title: string; desc?: string; children: React.ReactNode; id?: string;
}) {
  return (
    <div id={id} style={{ padding: "28px 32px", borderBottom: B }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 600, color: "#111", marginBottom: desc ? 5 : 0 }}>{title}</div>
        {desc && <div style={{ fontFamily: F.sans, fontSize: 13, color: "#666", lineHeight: 1.55 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

/* ─── code examples ─────────────────────────────────── */

function makeCode(tab: string, modelId: string, route: string = "auto") {
  const routeParam = route !== "auto" ? `,\n    "route": { "provider": "${route.toLowerCase()}" }` : "";
  if (tab === "curl") return `curl https://api.getopenmodels.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OM_API_KEY" \\
  -d '{
    "model": "${modelId}"${routeParam},
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`;
  if (tab === "python") {
    const r = route !== "auto" ? `\n    route={"provider": "${route.toLowerCase()}"},` : "";
    return `from openai import OpenAI

client = OpenAI(
    base_url="https://api.getopenmodels.com/v1",
    api_key="YOUR_OM_API_KEY"
)

response = client.chat.completions.create(
    model="${modelId}",${r}
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)`;
  }
  const r = route !== "auto" ? `\n  route: { provider: "${route.toLowerCase()}" },` : "";
  return `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.getopenmodels.com/v1",
  apiKey: process.env.OM_API_KEY,
});

const response = await client.chat.completions.create({
  model: "${modelId}",${r}
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.choices[0].message.content);`;
}

/* ─── main page ─────────────────────────────────────── */

export function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate    = useNavigate();
  const [codeTab, setCodeTab]         = useState<"curl" | "python" | "node">("curl");
  const [selectedRoute, setSelectedRoute] = useState<string>("auto");
  const [routeTab, setRouteTab]       = useState<"verified" | "community">("verified");

  const model   = getModelById(modelId ?? "");
  const related = model ? getRelatedModels(model) : [];
  const goAuth  = () => navigate("/", { state: { openAuth: true } });

  if (!model) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
        <Header onDashboard={goAuth} />
        <div style={{ paddingTop: 84, maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B, padding: "120px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Model not found.</p>
          <Link to="/" style={{ fontSize: 13, color: "#0047FF", textDecoration: "none" }}>← Back to marketplace</Link>
        </div>
      </div>
    );
  }

  const code = makeCode(codeTab, model.apiModelId, selectedRoute);
  const activeRoute = selectedRoute === "auto"
    ? model.providerRoutes[0]
    : model.providerRoutes.find((r) => r.provider === selectedRoute);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

          {/* ── Breadcrumb ── */}
          <div style={{ padding: "10px 32px", borderBottom: B, display: "flex", alignItems: "center", gap: 6, background: "#fafafa" }}>
            <Link to="/" style={{ fontFamily: F.sans, fontSize: 11, color: "#0047FF", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >Models</Link>
            <ChevronRight size={10} color="#bbb" />
            <span style={{ fontFamily: F.sans, fontSize: 11, color: "#888" }}>{model.shortName}</span>
          </div>

          {/* ── Overview ── */}
          <div style={{ padding: "28px 32px 0", borderBottom: B }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <h1 style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 600, letterSpacing: 0, color: "#111", marginBottom: 10, lineHeight: 1.3 }}>
                  {model.name}
                </h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {model.tags.map((t) => <Pill key={t} label={t} color="gray" />)}
                  <StatusPill status={model.status} />
                  <SupplyPill supply={model.supply} />
                </div>
                <p style={{ fontFamily: F.sans, fontSize: 13, color: "#555", lineHeight: 1.7, maxWidth: 560, margin: "0 0 12px" }}>
                  {model.description}
                </p>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#F5F8FF", border: "1px solid #DCE6FF",
                  padding: "4px 10px", borderRadius: 4,
                  fontFamily: F.sans, fontSize: 12, color: "#3B5BDB",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0047FF", flexShrink: 0 }} />
                  Default route: lowest available price
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <button onClick={goAuth} style={{
                  fontFamily: F.sans, fontSize: 13, fontWeight: 600,
                  color: "#fff", background: "#111", padding: "0 20px", height: 36,
                  border: "none", cursor: "pointer", transition: "background 150ms",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1f1f1f")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
                >Get API key</button>
                <button style={{
                  fontFamily: F.sans, fontSize: 13, fontWeight: 500,
                  color: "#0047FF", background: "none", padding: "0 20px", height: 36,
                  border: "1px solid #e2e2e2",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  transition: "background 120ms",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f8ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  View API docs <ExternalLink size={11} />
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="summary-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, borderTop: Bs }}>
              {[
                { label: "Input / 1M",  value: `$${model.input.toFixed(2)}`,  mono: true  },
                { label: "Output / 1M", value: model.output > 0 ? `$${model.output.toFixed(2)}` : "—", mono: true },
                { label: "Context",     value: model.context, mono: true },
                { label: "Routes",      value: model.providerRoutes.length > 0 ? `${model.providerRoutes.length} providers` : "—", mono: false },
              ].map((c, i) => (
                <div key={c.label} style={{ padding: "14px 20px", borderRight: i < 3 ? Bs : "none" }}>
                  <div style={{ fontFamily: F.sans, fontSize: 11, color: "#A3A3A3", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</div>
                  <div style={{ fontFamily: c.mono ? F.mono : F.sans, fontSize: 15, fontWeight: 600, color: "#111" }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky section nav */}
          <div style={{
            position: "sticky", top: 0, zIndex: 10, height: 44,
            borderBottom: B, background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", overflowX: "auto",
            padding: "0 32px", gap: 0,
          }}>
            {["Providers", "Pricing", "Endpoints", "Specs", "Examples", "Supply", "Related"].map((s) => (
              <a key={s} href={`#detail-${s.toLowerCase()}`} style={{
                fontFamily: F.sans, fontSize: 13, color: "#777",
                textDecoration: "none", padding: "0 14px", height: "100%",
                display: "flex", alignItems: "center",
                borderBottom: "2px solid transparent",
                whiteSpace: "nowrap", transition: "color 100ms, border-color 100ms",
                flexShrink: 0,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#111"; e.currentTarget.style.borderBottomColor = "#0047FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#777"; e.currentTarget.style.borderBottomColor = "transparent"; }}
              >{s}</a>
            ))}
          </div>

          {/* ── Provider Routes ── */}
          <Section
            id="detail-providers"
            title="Provider routes"
            desc="Compare available provider routes for this model. Verified routes are reviewed by OpenModels. Community routes are self-submitted and experimental."
          >
            {(() => {
              const verifiedRoutes  = model.providerRoutes.filter((r) => r.supply !== "Community");
              const communityRoutes = model.providerRoutes.filter((r) => r.supply === "Community");
              const displayRoutes   = routeTab === "verified" ? verifiedRoutes : communityRoutes;

              return (
              <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>

                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: Bs, background: "#fafafa" }}>
                  {(["verified", "community"] as const).map((t) => {
                    const active = routeTab === t;
                    return (
                      <button key={t} onClick={() => setRouteTab(t)} style={{
                        fontFamily: F.sans, fontSize: 13, fontWeight: active ? 600 : 400,
                        color: active ? "#111" : "#888",
                        background: "none", border: "none",
                        borderBottom: `2px solid ${active ? "#111" : "transparent"}`,
                        padding: "10px 20px", cursor: "pointer", transition: "color 80ms",
                        marginBottom: -1,
                      }}>
                        {t === "verified" ? "Verified" : "Community"}
                        <span style={{ marginLeft: 6, fontFamily: F.mono, fontSize: 11, color: active ? "#555" : "#C0C0C0" }}>
                          {t === "verified" ? verifiedRoutes.length : communityRoutes.length}
                        </span>
                      </button>
                    );
                  })}
                  <div style={{ flex: 1 }} />
                  {routeTab === "verified" && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5, margin: "8px 16px",
                      background: "#EFF6FF", border: "1px solid #BFDBFE",
                      padding: "3px 10px", borderRadius: 999,
                      fontFamily: F.sans, fontSize: 11, color: "#2563eb",
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#0047FF" }} />
                      {selectedRoute === "auto" ? "Auto · lowest verified price" : `Route: ${selectedRoute}`}
                    </span>
                  )}
                </div>

                {/* Tab description */}
                <div style={{ padding: "8px 20px", borderBottom: Bs, background: "#fafafa" }}>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: "#999" }}>
                    {routeTab === "verified"
                      ? "Reviewed provider routes for production usage."
                      : "Self-submitted provider routes. Use when you are comfortable with provider-level risk."}
                  </span>
                </div>

                {/* Empty state for Community */}
                {displayRoutes.length === 0 ? (
                  <div style={{ padding: "40px 24px", textAlign: "center" }}>
                    <p style={{ fontFamily: F.sans, fontSize: 13, color: "#888", marginBottom: 12 }}>
                      No community routes available for this model yet.
                    </p>
                    <a href="/providers/apply" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 13, color: "#0047FF", textDecoration: "none", fontWeight: 500 }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >Become a provider →</a>
                  </div>
                ) : (

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: routeTab === "verified" ? "fixed" : "auto", minWidth: routeTab === "community" ? 760 : 600 }}>
                    {routeTab === "verified" && (
                      <colgroup>
                        <col style={{ width: "28%" }} />{/* Provider */}
                        <col style={{ width: "15%" }} />{/* Latency */}
                        <col style={{ width: "15%" }} />{/* Availability */}
                        <col style={{ width: "15%" }} />{/* Supply */}
                        <col style={{ width: "15%" }} />{/* Uptime */}
                        <col style={{ width: "12%" }} />{/* Route */}
                      </colgroup>
                    )}
                    <thead>
                      <tr style={{ background: "#f9f9f9" }}>
                        {(routeTab === "verified"
                          ? ["Provider", "Latency", "Availability", "Supply", "Uptime", "Route"]
                          : ["Provider", "Input / 1M", "Output / 1M", "Latency", "Availability", "Error rate", "Last checked", "Route"]
                        ).map((h) => (
                          <th key={h} style={{
                            fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: "#888",
                            padding: h === "Route" ? "10px 20px 10px 8px" : "10px 16px",
                            textAlign: h === "Provider" ? "left" : h === "Route" ? "right" : "center",
                            borderBottom: Bs, whiteSpace: "nowrap",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRoutes.map((route, i) => {
                        const isSelected = routeTab === "verified" && (
                          selectedRoute === route.provider ||
                          (selectedRoute === "auto" && i === 0)
                        );
                        const avC = route.availability === "Live"
                          ? { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#16A34A" }
                          : route.availability === "Limited"
                          ? { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#D97706" }
                          : { bg: "#F5F5F5", border: "#E5E5E5", text: "#737373", dot: "#A3A3A3" };
                        return (
                          <tr key={route.provider} style={{
                            background: isSelected ? "#F8FAFF" : "transparent",
                            borderLeft: isSelected ? "2px solid #0047FF" : "2px solid transparent",
                            borderBottom: i < displayRoutes.length - 1 ? Bs : "none",
                            transition: "background 80ms",
                          }}
                            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#fafafa"; }}
                            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                          >
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <a href={`/providers/${route.provider.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: "#111", textDecoration: "none", transition: "color 100ms" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0047FF")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
                                >{route.provider}</a>
                                {routeTab === "verified" && i === 0 && (
                                  <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "1px 6px", borderRadius: 999, whiteSpace: "nowrap" }}>Lowest price</span>
                                )}
                                {routeTab === "community" && (
                                  <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#92400E", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>Community</span>
                                )}
                              </div>
                            </td>
                            {routeTab === "community" && <>
                              <td style={{ padding: "14px 16px", fontFamily: F.mono, fontSize: 13, fontWeight: 600, color: "#444" }}>${route.input.toFixed(2)}</td>
                              <td style={{ padding: "14px 16px", fontFamily: F.mono, fontSize: 13, color: "#555" }}>{route.output > 0 ? `$${route.output.toFixed(2)}` : "—"}</td>
                            </>}
                            <td style={{ padding: "14px 16px", fontFamily: F.mono, fontSize: 13, color: "#888", fontVariantNumeric: "tabular-nums", textAlign: "center" }}>{route.latency}</td>
                            <td style={{ padding: "14px 16px", textAlign: "center" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: avC.text, background: avC.bg, border: `1px solid ${avC.border}`, borderRadius: 999, padding: "2px 8px" }}>
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: avC.dot }} />{route.availability}
                              </span>
                            </td>
                            {routeTab === "verified" && (() => {
                              const supC = supplyStyle[(route.supply as SupplyType)] ?? supplyStyle.Limited;
                              return (
                                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: supC.text, background: supC.bg, border: `1px solid ${supC.border}`, borderRadius: 999, padding: "2px 7px" }}>
                                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: supC.dot }} />{route.supply}
                                  </span>
                                </td>
                              );
                            })()}
                            {routeTab === "verified" && (
                              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                {route.uptime != null ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ display: "flex", gap: 2 }}>
                                      {[...Array(5)].map((_, idx) => (
                                        <span key={idx} style={{ display: "inline-block", width: 4, height: 12, borderRadius: 2, background: (route.uptime ?? 0) >= 99 ? "#16A34A" : (route.uptime ?? 0) >= 97 ? "#D97706" : "#E5E5E5", opacity: idx < Math.round(((route.uptime ?? 0) / 100) * 5) ? 1 : 0.2 }} />
                                      ))}
                                    </div>
                                    <span style={{ fontFamily: F.mono, fontSize: 11, color: (route.uptime ?? 0) >= 99 ? "#15803D" : "#B45309", fontVariantNumeric: "tabular-nums" }}>{route.uptime}%</span>
                                  </div>
                                ) : <span style={{ color: "#C0C0C0", fontSize: 12 }}>—</span>}
                              </td>
                            )}
                            {routeTab === "community" && <>
                              <td style={{ padding: "14px 16px", fontFamily: F.mono, fontSize: 13, color: "#888" }}>—</td>{/* error rate */}
                              <td style={{ padding: "14px 16px", fontFamily: F.sans, fontSize: 12, color: "#aaa" }}>—</td>{/* last checked */}
                            </>}
                            <td style={{ padding: "14px 20px 14px 8px", textAlign: "right" }}>
                              {routeTab === "verified" ? (
                                isSelected ? (
                                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "3px 10px", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap", minWidth: 72 }}
                                    onClick={() => setSelectedRoute("auto")}
                                  >✓ Selected</span>
                                ) : (
                                  <button onClick={() => setSelectedRoute(route.provider)} style={{
                                    fontFamily: F.sans, fontSize: 12, fontWeight: 500,
                                    color: "#555", background: "none", border: "1px solid #e2e2e2",
                                    padding: "3px 0", cursor: "pointer", borderRadius: 4,
                                    transition: "all 100ms", whiteSpace: "nowrap",
                                    width: 72, textAlign: "center",
                                  }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#aaa"; e.currentTarget.style.color = "#111"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e2e2"; e.currentTarget.style.color = "#555"; }}
                                  >Select</button>
                                )
                              ) : (
                                <span style={{ fontFamily: F.sans, fontSize: 12, color: "#C0C0C0" }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}

                {/* Fallback note — Verified only */}
                {routeTab === "verified" && displayRoutes.length > 0 && (
                <div style={{ padding: "9px 20px", borderTop: Bs, background: "#fafafa" }}>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: "#aaa" }}>
                    {selectedRoute === "auto"
                      ? "Auto route uses the lowest available verified provider. Falls back to next available if the route becomes unavailable."
                      : "Fixed provider routes are only sent to the selected provider."}
                  </span>
                </div>
                )}

                {/* Selected route summary strip */}
                {routeTab === "verified" && activeRoute && (
                  <div style={{ padding: "10px 20px", borderTop: Bs, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 12, color: "#666" }}>
                      {selectedRoute === "auto" ? "Auto route:" : "Selected route:"}{" "}
                      <span style={{ fontFamily: F.sans, fontWeight: 600, color: "#111" }}>{activeRoute.provider}</span>
                      <span style={{ color: "#ddd", margin: "0 6px" }}>·</span>
                      <span style={{ color: "#888" }}>{activeRoute.supply} supply</span>
                      <span style={{ color: "#ddd", margin: "0 6px" }}>·</span>
                      <span style={{ color: "#A3A3A3" }}>Pricing shown below</span>
                    </span>
                    {selectedRoute !== "auto" && (
                      <button onClick={() => setSelectedRoute("auto")} style={{
                        fontFamily: F.sans, fontSize: 12, color: "#888",
                        background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0,
                        transition: "color 100ms",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                      >Reset to auto →</button>
                    )}
                  </div>
                )}

                {/* Token pricing — inside Provider Routes, synced to selected route */}
                {routeTab === "verified" && model.pricingTiers.length > 0 && (
                  <div style={{ borderTop: "1px solid #E5E5E5", background: "#FAFAFA" }}>
                    {/* Sub-header */}
                    <div style={{ padding: "14px 20px 12px", borderBottom: Bs, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#111" }}>Token pricing</span>
                      <span style={{ fontFamily: F.sans, fontSize: 11, color: "#888" }}>
                        {activeRoute
                          ? <>
                              <span style={{ color: "#A3A3A3" }}>Selected provider: </span>
                              <span style={{ fontFamily: F.sans, color: "#555", fontWeight: 500 }}>{activeRoute.provider}</span>
                              <span style={{ color: "#ddd", margin: "0 5px" }}>·</span>
                              <span style={{ color: "#A3A3A3" }}>{activeRoute.supply} supply</span>
                            </>
                          : <span style={{ color: "#C0C0C0" }}>Select a provider route to see pricing.</span>}
                      </span>
                    </div>
                    {/* Pricing table */}
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                        <thead>
                          <tr style={{ background: "#f9f9f9" }}>
                            {["Tier", "Billing", "Input / 1M", "Output / 1M", "Cache write / 1M", "Cache read / 1M"].map((h) => (
                              <th key={h} style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: "#888", padding: "10px 14px", textAlign: "left", borderBottom: Bs, whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {model.pricingTiers.map((tier, i) => (
                            <tr key={i} style={{ borderBottom: i < model.pricingTiers.length - 1 ? Bs : "none" }}>
                              <td style={{ fontFamily: F.sans, fontSize: 13, color: "#333", padding: "12px 14px" }}>{tier.tier}</td>
                              <td style={{ fontFamily: F.sans, fontSize: 13, color: "#888", padding: "12px 14px" }}>{tier.billing}</td>
                              <td style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 600, color: "#111", padding: "12px 14px" }}>${tier.input.toFixed(2)}</td>
                              <td style={{ fontFamily: F.mono, fontSize: 13, color: "#444", padding: "12px 14px" }}>{tier.output > 0 ? `$${tier.output.toFixed(2)}` : <span style={{ color: "#aaa" }}>—</span>}</td>
                              <td style={{ fontFamily: F.mono, fontSize: 13, color: "#666", padding: "12px 14px" }}>{tier.cacheWrite != null ? `$${tier.cacheWrite.toFixed(3)}` : <span style={{ color: "#aaa" }}>—</span>}</td>
                              <td style={{ fontFamily: F.mono, fontSize: 13, color: "#666", padding: "12px 14px" }}>{tier.cacheRead != null ? `$${tier.cacheRead.toFixed(3)}` : <span style={{ color: "#aaa" }}>—</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              );
            })()}
          </Section>

          {/* ── API Endpoints ── */}
          <Section id="detail-endpoints" title="API endpoints">
            <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9f9f9" }}>
                    {["Protocol", "Endpoint", "Method", ""].map((h) => (
                      <th key={h} style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: "#888", padding: "10px 16px", textAlign: "left", borderBottom: Bs, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {model.endpoints.map((ep, i) => {
                    const protocol = ep.path.startsWith("openai") ? "OpenAI" : ep.path.startsWith("anthropic") ? "Anthropic" : "API";
                    const path = ep.path.replace(/^openai:\s*|^anthropic:\s*/, "").trim();
                    const { copied, copy } = useCopy(path);
                    return (
                      <tr key={i} style={{ borderBottom: i < model.endpoints.length - 1 ? Bs : "none", transition: "background 80ms" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "13px 16px", fontFamily: F.sans, fontSize: 13, color: "#555", width: 100 }}>{protocol}</td>
                        <td style={{ padding: "13px 16px", fontFamily: F.mono, fontSize: 13, color: "#222" }}>{path}</td>
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 600, color: "#0047FF", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 6px", borderRadius: 2 }}>{ep.method}</span>
                        </td>
                        <td style={{ padding: "13px 16px", textAlign: "right" }}>
                          <button onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#16A34A" : "#bbb", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 12, transition: "color 100ms" }}
                            onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#555"; }}
                            onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#bbb"; }}
                          >
                            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>


          {/* ── Model specs ── */}
          <Section id="detail-specs" title="Model specs">
            <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
              {[
                { label: "Context window",     value: model.context,            mono: true,  features: undefined },
                { label: "Max output",         value: model.maxOutput ?? "—",   mono: true,  features: undefined },
                { label: "Supported features", value: null,                     mono: false, features: model.features },
                { label: "Release date",       value: model.releaseDate ?? "—", mono: false, features: undefined },
                { label: "Providers",          value: model.providerRoutes.length > 1 ? `Available through ${model.providerRoutes.length} providers` : model.provider, mono: false, features: undefined },
                { label: "Use cases",          value: model.useCases ?? "—",    mono: false, features: undefined },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: "grid", gridTemplateColumns: "180px 1fr",
                  padding: "14px 16px", borderBottom: i < arr.length - 1 ? Bs : "none",
                  alignItems: "start", gap: 16, background: "#fff",
                }}>
                  <span style={{ fontFamily: F.sans, fontSize: 13, color: "#777" }}>{row.label}</span>
                  {row.features != null ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {row.features.length > 0
                        ? row.features.map((f) => <Pill key={f} label={f} color="gray" />)
                        : <span style={{ fontFamily: F.sans, fontSize: 13, color: "#bbb" }}>No feature metadata available</span>
                      }
                    </div>
                  ) : (
                    <span style={{ fontFamily: row.mono ? F.mono : F.sans, fontSize: 13, color: "#111" }}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── Use this model ── */}
          <Section id="detail-examples" title="Use this model" desc="If no provider is specified, OpenModels uses the lowest available live price route by default.">
            {/* Route selector */}
            {model.providerRoutes.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                <span style={{ fontFamily: F.sans, fontSize: 12, color: "#888" }}>Route:</span>
                {["Auto · lowest available price", ...model.providerRoutes.map((r) => r.provider)].map((opt) => {
                  const val = opt === "Auto · lowest available price" ? "auto" : opt;
                  const active = selectedRoute === val;
                  return (
                    <button key={opt} onClick={() => setSelectedRoute(val)} style={{
                      fontFamily: F.sans, fontSize: 12,
                      color: active ? "#0047FF" : "#777",
                      background: active ? "#EFF6FF" : "none",
                      border: `1px solid ${active ? "#BFDBFE" : "#e2e2e2"}`,
                      padding: "3px 10px", cursor: "pointer", borderRadius: 4,
                      transition: "all 100ms",
                    }}>{opt}</button>
                  );
                })}
              </div>
            )}
            <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", background: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}>
                {(["curl", "python", "node"] as const).map((tab) => (
                  <button key={tab} onClick={() => setCodeTab(tab)} style={{
                    fontFamily: F.sans, fontSize: 12, color: codeTab === tab ? "#fff" : "#666",
                    fontWeight: codeTab === tab ? 500 : 400, background: "none", border: "none",
                    borderBottom: codeTab === tab ? "2px solid #0047FF" : "2px solid transparent",
                    padding: "8px 16px", cursor: "pointer", marginBottom: -1,
                  }}>{tab}</button>
                ))}
                <div style={{ marginLeft: "auto", padding: "0 12px" }}>
                  <button onClick={() => { navigator.clipboard.writeText(code).catch(() => {}); }} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "none", border: "none", cursor: "pointer",
                    color: "#666", fontFamily: F.sans, fontSize: 12, padding: "8px 4px",
                  }}>
                    <Copy size={12} /> Copy
                  </button>
                </div>
              </div>
              <pre style={{
                margin: 0, padding: "18px 20px", maxHeight: 260,
                fontFamily: F.mono, fontSize: 12, lineHeight: 1.85,
                background: "#111", color: "#ededed", overflowX: "auto", overflowY: "auto", whiteSpace: "pre",
              }}>
                {code.split("\n").map((line, i) => {
                  let color = "#aaa";
                  if (line.trimStart().startsWith("curl ") || line.trimStart().startsWith("from ") || line.trimStart().startsWith("import ")) color = "#79ffe1";
                  else if (line.includes("-H ") || line.trimStart().startsWith("-H")) color = "#b3d7ff";
                  else if ((line.includes('"') || line.includes("'")) && !line.trimStart().startsWith("curl")) color = "#ffd87d";
                  return <span key={i} style={{ display: "block", color }}>{line}</span>;
                })}
              </pre>
              <div style={{ padding: "9px 16px", borderTop: "1px solid #222", background: "#0d0d0d", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: "#555", fontWeight: 500 }}>BASE URL</span>
                <code style={{ fontFamily: F.mono, fontSize: 11, color: "#888" }}>https://api.getopenmodels.com/v1</code>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: "#444", marginLeft: "auto" }}>Powered by alephant.io</span>
              </div>
            </div>
          </Section>

          {/* ── Supply path ── */}
          <Section id="detail-supply" title="Verified supply path">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
              {["Provider routes checked", "Prices monitored", "No proxy chains"].map((item) => (
                <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: F.sans, fontSize: 13, color: "#555" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: F.sans, fontSize: 13, color: "#777", lineHeight: 1.65, margin: 0 }}>
              OpenModels routes requests through verified supply paths instead of opaque reseller chains. Prices shown are final — no hidden fees or margin layers.
            </p>
          </Section>

          {/* ── Related models ── */}
          {related.length > 0 && (
            <Section id="detail-related" title="Related models">
              <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {related.map((m) => (
                  <Link key={m.id} to={`/models/${m.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, padding: "16px", background: "#fff", transition: "border-color 100ms, background 80ms" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#fafafa"; (e.currentTarget as HTMLDivElement).style.borderColor = "#ccc"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#fff"; (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E5E5"; }}
                    >
                      <div style={{ fontFamily: F.sans, fontSize: 13, color: "#111", marginBottom: 6, fontWeight: 600 }}>{m.shortName}</div>
                      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontFamily: F.mono, fontSize: 12, color: "#555" }}>${m.input.toFixed(2)} in</span>
                        <span style={{ fontFamily: F.mono, fontSize: 12, color: "#888" }}>${m.output.toFixed(2)} out</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <StatusPill status={m.status} />
                        {m.providerRoutes.length > 0 && (
                          <span style={{ fontFamily: F.sans, fontSize: 11, color: "#aaa" }}>
                            {m.providerRoutes.length} route{m.providerRoutes.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {/* ── Footer ── */}
          <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", borderTop: B }}>
            <Link to="/" style={{ fontFamily: F.sans, fontSize: 13, color: "#777", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, transition: "color 120ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
            >
              <ArrowLeft size={13} /> Back to marketplace
            </Link>
            <span style={{ color: "#e2e2e2", userSelect: "none" }}>|</span>
            <button onClick={goAuth} style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#0047FF", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "opacity 120ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Get API key →</button>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .summary-cards { grid-template-columns: repeat(2,1fr) !important; }
          .related-grid  { grid-template-columns: 1fr !important; }
          .price-cells   { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <Footer onGetKey={goAuth} />
      <SupportButton />
    </div>
  );
}
