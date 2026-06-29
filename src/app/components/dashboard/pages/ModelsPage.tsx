import { useState, useRef, useEffect } from "react";
import { Send, X, RotateCcw, ChevronDown, Cpu, Copy, Check, ExternalLink } from "lucide-react";
import { T, F } from "../../../lib/type";
import { B, Bs, blue, D } from "../shared";
import { getModelById } from "../../../lib/models-data";

const models = [
  { id: "qwen-2.5-72b",       name: "Qwen 2.5 72B",       provider: "Alibaba",   input: 0.32, output: 0.58, context: "128K", status: "Live",    latency: "760ms",  routes: 3, lowestProvider: "Novita",      tags: ["Chat","Coding","Reasoning"], supply: "Verified" },
  { id: "deepseek-v3",        name: "DeepSeek V3",         provider: "DeepSeek",  input: 0.28, output: 0.55, context: "128K", status: "Live",    latency: "910ms",  routes: 2, lowestProvider: "DeepSeek",    tags: ["Chat","Reasoning"],          supply: "Direct"   },
  { id: "llama-3.1-70b",      name: "Llama 3.1 70B",       provider: "Meta",      input: 0.38, output: 0.65, context: "128K", status: "Live",    latency: "760ms",  routes: 4, lowestProvider: "Together AI", tags: ["Chat","Coding"],             supply: "Direct"   },
  { id: "deepseek-r1",        name: "DeepSeek R1",         provider: "DeepSeek",  input: 0.50, output: 1.20, context: "64K",  status: "Live",    latency: "1240ms", routes: 2, lowestProvider: "DeepSeek",    tags: ["Reasoning"],                 supply: "Direct"   },
  { id: "mistral-large",      name: "Mistral Large",       provider: "Mistral",   input: 0.42, output: 0.76, context: "128K", status: "Live",    latency: "760ms",  routes: 2, lowestProvider: "Fireworks",   tags: ["Chat"],                      supply: "Verified" },
  { id: "qwen-2.5-coder-32b", name: "Qwen 2.5 Coder 32B", provider: "Alibaba",   input: 0.18, output: 0.38, context: "128K", status: "Live",    latency: "540ms",  routes: 2, lowestProvider: "Novita",      tags: ["Coding"],                    supply: "Verified" },
  { id: "llama-3.1-8b",       name: "Llama 3.1 8B",        provider: "Meta",      input: 0.05, output: 0.10, context: "128K", status: "Live",    latency: "180ms",  routes: 3, lowestProvider: "Groq",        tags: ["Chat","Coding"],             supply: "Direct"   },
  { id: "gemma-2-27b",        name: "Gemma 2 27B",         provider: "Google",    input: 0.18, output: 0.36, context: "8K",   status: "Live",    latency: "240ms",  routes: 2, lowestProvider: "Groq",        tags: ["Chat"],                      supply: "Verified" },
  { id: "mistral-7b",         name: "Mistral 7B",          provider: "Mistral",   input: 0.04, output: 0.08, context: "32K",  status: "Live",    latency: "180ms",  routes: 2, lowestProvider: "Groq",        tags: ["Chat"],                      supply: "Verified" },
  { id: "phi-3-medium",       name: "Phi-3 Medium",        provider: "Microsoft", input: 0.12, output: 0.22, context: "128K", status: "Limited", latency: "420ms",  routes: 1, lowestProvider: "Azure",       tags: ["Chat","Coding"],             supply: "Limited"  },
  { id: "nomic-embed",        name: "Nomic Embed",         provider: "Nomic",     input: 0.05, output: 0.00, context: "8K",   status: "Live",    latency: "180ms",  routes: 2, lowestProvider: "Nomic",       tags: ["Embedding"],                 supply: "Verified" },
];

const SYSTEM_PROMPTS = [
  { label: "None",              value: "" },
  { label: "Helpful assistant", value: "You are a helpful, concise assistant." },
  { label: "Code expert",       value: "You are an expert software engineer. Answer with code examples." },
  { label: "Summarizer",        value: "Summarize all responses in 3 bullets." },
];

const allTags = ["All", "Chat", "Coding", "Reasoning", "Embedding"];

interface Msg { role: "user" | "assistant"; content: string; tokens?: number }

type StatusType = "Live" | "Limited";
const statusDot: Record<StatusType, string> = { Live: "#16A34A", Limited: "#f59e0b" };

type SupplyType = "Direct" | "Verified" | "Limited";
const supplyColors: Record<SupplyType, { bg: string; border: string; text: string; dot: string }> = {
  Direct:   { bg: "#f6fef9", border: "#d1fae5", text: "#166534", dot: "#16A34A" },
  Verified: { bg: "#f5f9ff", border: "#dbeafe", text: "#2563eb", dot: "#3B82F6" },
  Limited:  { bg: "#f7f7f7", border: "#e8e8e8", text: "#888",    dot: "#bbb"    },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <button onClick={handle} style={{
      background: "none", border: "none", cursor: "pointer",
      color: copied ? "#16A34A" : "#bbb", padding: "2px 4px",
      display: "flex", alignItems: "center", transition: "color 100ms",
    }}
      onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#555"; }}
      onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#bbb"; }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  );
}

/* ─── Drawer section label ───────────────────────────── */
function DrawerSection({ label }: { label: string }) {
  return (
    <div style={{ padding: "9px 16px 7px", borderBottom: Bs, background: "#f7f7f7" }}>
      <span style={{ fontFamily: F.sans, fontSize: T.meta, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
    </div>
  );
}

export function ModelsPage() {
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [messages, setMessages]         = useState<Msg[]>([]);
  const [prompt, setPrompt]             = useState("");
  const [loading, setLoading]           = useState(false);
  const [temperature, setTemperature]   = useState(0.7);
  const [maxTokens, setMaxTokens]       = useState(512);
  const [systemIdx, setSystemIdx]       = useState(0);
  const [showQuick, setShowQuick]       = useState(true);
  const [filterTag, setFilterTag]       = useState("All");
  const [selectedRoute, setSelectedRoute] = useState<string>("auto");
  const msgEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  /* ESC closes drawer */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active   = models.find((m) => m.id === selectedId);
  const filtered = filterTag === "All" ? models : models.filter((m) => m.tags.includes(filterTag));

  const closeDrawer = () => { setSelectedId(null); setMessages([]); setPrompt(""); };

  const openDrawer = (id: string) => {
    if (selectedId !== id) { setMessages([]); setPrompt(""); setSelectedRoute("auto"); }
    setSelectedId(id);
  };

  const handleSend = () => {
    if (!prompt.trim() || loading || !active) return;
    setMessages((p) => [...p, { role: "user", content: prompt }]);
    setPrompt("");
    setLoading(true);
    setTimeout(() => {
      const tokens = Math.floor(Math.random() * 80) + 20;
      setMessages((p) => [...p, {
        role: "assistant",
        content: `Simulated response from **${active.name}**. In production this streams from api.openmodels.com/v1.\n\nTemp: ${temperature} · Max tokens: ${maxTokens}`,
        tokens,
      }]);
      setLoading(false);
    }, 900 + Math.random() * 600);
  };

  const totalTokens = messages.filter((m) => m.role === "assistant").reduce((s, m) => s + (m.tokens ?? 0), 0);
  const estCost = active ? ((totalTokens / 1_000_000) * active.output).toFixed(6) : "0";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", fontFamily: F.sans, position: "relative" }}>

      {/* ── Model list — always full width ── */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "32px 28px 0", borderBottom: B }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <Cpu size={11} color={blue} strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em" }}>MODELS</span>
          </span>
          <h1 style={{ fontFamily: F.sans, fontSize: T.md, fontWeight: 600, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 6, lineHeight: 1.2 }}>Model marketplace</h1>
          <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Compare open-source models across verified provider routes. OpenModels uses the lowest available live route by default.</p>
          <div style={{ display: "flex" }}>
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setFilterTag(tag)} style={{
                fontFamily: F.sans, fontSize: D.body,
                color: filterTag === tag ? "#0a0a0a" : "#999",
                fontWeight: filterTag === tag ? 600 : 400,
                background: "none", border: "none",
                borderBottom: filterTag === tag ? "2px solid #0a0a0a" : "2px solid transparent",
                padding: "8px 14px", cursor: "pointer", marginBottom: -1, transition: "color 100ms",
              }}>{tag}</button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div className="mrow" style={{ display: "grid", gridTemplateColumns: "30% 16% 13% 13% 10% 10% 8%", height: 40, alignItems: "center", padding: "0 32px", background: "#f7f7f7", borderBottom: B }}>
          {["Model", "Routes", "Input/1M", "Output/1M", "Context", "Latency", "Status"].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {filtered.map((m, i) => {
          const isSelected = selectedId === m.id;
          return (
            <div key={m.id} className="mrow" style={{
              display: "grid", gridTemplateColumns: "30% 16% 13% 13% 10% 10% 8%",
              padding: "0 32px", minHeight: 56,
              borderBottom: i < filtered.length - 1 ? Bs : "none",
              alignItems: "center",
              background: isSelected ? "#f0f5ff" : "transparent",
              borderLeft: `2px solid ${isSelected ? blue : "transparent"}`,
              cursor: "pointer", transition: "background 80ms",
            }}
              onClick={() => openDrawer(m.id)}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#fafafa"; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
            >
              <div>
                <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#0a0a0a", fontWeight: isSelected ? 600 : 400 }}>{m.id}</span>
                <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                  {m.tags.map((t) => (
                    <span key={t} style={{ fontFamily: F.sans, fontSize: D.label, color: "#bbb", border: "1px solid #eee", padding: "0 5px" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: m.routes > 1 ? "#555" : "#bbb" }}>{m.routes} {m.routes === 1 ? "route" : "routes"}</span>
                {m.routes > 1 && <div style={{ fontFamily: F.sans, fontSize: 11, color: "#A3A3A3", marginTop: 1 }}>lowest {m.lowestProvider}</div>}
              </div>
              <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#0a0a0a" }}>${m.input.toFixed(2)}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#666" }}>{m.output > 0 ? `$${m.output.toFixed(2)}` : "—"}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#bbb" }}>{m.context}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#999" }}>{m.latency}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: statusDot[(m.status as StatusType)] ?? "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusDot[(m.status as StatusType)] ?? "#aaa", display: "inline-block" }} />
                {m.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Backdrop — ultra-light, click to close ── */}
      {selectedId && (
        <div
          onClick={closeDrawer}
          style={{
            position: "fixed", inset: 0, zIndex: 29,
            background: "rgba(0,0,0,0.04)",
          }}
        />
      )}

      {/* ── Overlay Drawer ── */}
      {active && (
        <div style={{
          position: "fixed",
          top: 48,
          right: 0,
          bottom: 0,
          width: 520,
          minWidth: 480,
          maxWidth: 560,
          zIndex: 30,
          background: "#ffffff",
          borderLeft: "1px solid #E5E5E5",
          boxShadow: "-12px 0 32px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          transform: selectedId ? "translateX(0)" : "translateX(100%)",
          transition: "transform 220ms cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}>

          {/* ── Drawer Header ── */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E5E5", background: "#fff", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ minWidth: 0, flex: 1, marginRight: 12 }}>
                <div style={{ fontFamily: F.mono, fontSize: 13, color: "#111", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{active.id}</div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: "#888", marginTop: 3 }}>
                  {active.provider} · {active.context} context · {active.latency} avg
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <button style={{
                  background: "none", border: B,
                  cursor: "pointer", padding: "3px 10px",
                  color: "#777", gap: 4, fontFamily: F.sans, fontSize: D.label,
                  display: "flex", alignItems: "center", transition: "all 100ms",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  API docs <ExternalLink size={10} style={{ marginLeft: 3 }} />
                </button>
                <button onClick={closeDrawer} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#bbb", padding: 4, display: "flex",
                  transition: "color 100ms",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#bbb")}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {/* Status */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: active.status === "Live" ? "#F0FDF4" : "#FFFBEB",
                border: `1px solid ${active.status === "Live" ? "#BBF7D0" : "#FDE68A"}`,
                borderRadius: 999, padding: "2px 7px",
                fontFamily: F.sans, fontSize: T.meta, fontWeight: 500,
                color: active.status === "Live" ? "#15803D" : "#B45309",
              }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: statusDot[(active.status as StatusType)] ?? "#aaa" }} />
                {active.status}
              </span>
              {/* Supply */}
              {(() => {
                const s = supplyColors[(active.supply as SupplyType)] ?? supplyColors.Limited;
                return (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 3,
                    background: s.bg, border: `1px solid ${s.border}`,
                    borderRadius: 999, padding: "2px 7px",
                    fontFamily: F.sans, fontSize: T.meta, fontWeight: 500, color: s.text,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: s.dot }} />
                    {active.supply}
                  </span>
                );
              })()}
              {/* Tags */}
              {active.tags.map((t) => (
                <span key={t} style={{
                  fontFamily: F.sans, fontSize: T.meta, color: "#666",
                  background: "#F5F5F5", border: "1px solid #E5E5E5",
                  borderRadius: 999, padding: "2px 7px",
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* ── Route summary strip ── */}
          <div style={{ padding: "8px 24px", background: "#FAFAFA", borderBottom: "1px solid #E5E5E5", flexShrink: 0 }}>
            <span style={{ fontFamily: F.sans, fontSize: 12, color: "#666" }}>
              {selectedRoute === "auto"
                ? `Auto route active · lowest available price · ${active.routes} route${active.routes > 1 ? "s" : ""}`
                : `Fixed route · ${selectedRoute} · ${active.routes} route${active.routes > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* ── Scrollable body ── */}
          <div style={{ flex: 1, overflowY: "auto" }}>

            {/* Provider routes */}
            {(() => {
              const modelData = getModelById(active.id);
              const routes = modelData?.providerRoutes ?? [];
              if (routes.length === 0) return null;
              return (
                <div style={{ borderBottom: B }}>
                  <div style={{ padding: "8px 16px 6px", background: "#fafafa", borderBottom: Bs, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>PROVIDER ROUTES</span>
                    <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0" }}>
                      {selectedRoute === "auto" ? "Auto · lowest price" : `Route: ${selectedRoute}`}
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 380 }}>
                      <thead>
                        <tr style={{ background: "#FAFAFA" }}>
                          {["Provider", "Input", "Output", "Latency", "Supply", "Route"].map((h) => (
                            <th key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", padding: "0 16px", height: 36, textAlign: "left", borderBottom: "1px solid #EFEFEF", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {routes.map((r, i) => {
                          const isSelected = selectedRoute === r.provider;
                          const isLowest = i === 0;
                          const supC = { Direct: { text: "#166534", bg: "#f6fef9", border: "#d1fae5", dot: "#16A34A" }, Verified: { text: "#2563eb", bg: "#f5f9ff", border: "#dbeafe", dot: "#3B82F6" }, Limited: { text: "#888", bg: "#f7f7f7", border: "#e8e8e8", dot: "#bbb" } }[r.supply as "Direct" | "Verified" | "Limited"] ?? { text: "#888", bg: "#f7f7f7", border: "#e8e8e8", dot: "#bbb" };
                          return (
                            <tr key={r.provider} style={{
                              background: isSelected ? "#EAF1FF" : "transparent",
                              borderLeft: isSelected ? `2px solid ${blue}` : "2px solid transparent",
                              borderBottom: i < routes.length - 1 ? Bs : "none",
                              transition: "background 80ms",
                            }}
                              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#fafafa"; }}
                              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                              <td style={{ padding: "0 16px", height: 52, verticalAlign: "middle", maxWidth: 130, overflow: "hidden" }}>
                                <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.provider}</div>
                                {isLowest && <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#16A34A", marginTop: 1 }}>Lowest price</div>}
                              </td>
                              <td style={{ padding: "0 16px", height: 52, fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111", verticalAlign: "middle", whiteSpace: "nowrap" }}>${r.input.toFixed(2)}</td>
                              <td style={{ padding: "0 16px", height: 52, fontFamily: F.mono, fontSize: D.body, color: "#555", verticalAlign: "middle", whiteSpace: "nowrap" }}>{r.output > 0 ? `$${r.output.toFixed(2)}` : "—"}</td>
                              <td style={{ padding: "0 16px", height: 52, fontFamily: F.mono, fontSize: D.body, color: "#888", verticalAlign: "middle", whiteSpace: "nowrap" }}>{r.latency}</td>
                              <td style={{ padding: "0 16px", height: 52, verticalAlign: "middle" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", height: 20, fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: supC.text, background: supC.bg, border: `1px solid ${supC.border}`, borderRadius: 999, padding: "0 7px", whiteSpace: "nowrap" }}>
                                  {r.supply}
                                </span>
                              </td>
                              <td style={{ padding: "0 16px", height: 52, verticalAlign: "middle" }}>
                                {isSelected ? (
                                  <button onClick={() => setSelectedRoute("auto")} style={{ width: 64, fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0", height: 26, cursor: "pointer", borderRadius: 4, whiteSpace: "nowrap" }}>✓ Selected</button>
                                ) : (
                                  <button onClick={() => setSelectedRoute(r.provider)} style={{ width: 64, fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#555", background: "none", border: "1px solid #E5E5E5", height: 26, cursor: "pointer", borderRadius: 4, whiteSpace: "nowrap", transition: "border-color 80ms" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#aaa")}
                                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                                  >Select</button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Summary + fallback */}
                  <div style={{ padding: "12px 24px", borderTop: "1px solid #EFEFEF", background: "#FAFAFA" }}>
                    {selectedRoute !== "auto" ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontFamily: F.sans, fontSize: 12, color: "#555" }}>
                          Selected route: <strong style={{ fontWeight: 600 }}>{selectedRoute}</strong> · fixed provider
                        </span>
                        <button onClick={() => setSelectedRoute("auto")} style={{ fontFamily: F.sans, fontSize: D.label, color: "#bbb", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 100ms" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#bbb")}
                        >Reset to auto →</button>
                      </div>
                    ) : (
                      <div style={{ fontFamily: F.sans, fontSize: 12, color: "#555", marginBottom: 4 }}>
                        Selected route: Auto · lowest available live price
                      </div>
                    )}
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: "#A3A3A3", lineHeight: 1.5 }}>
                      {selectedRoute === "auto"
                        ? "Auto route uses the lowest available live provider. If that route becomes unavailable, OpenModels routes to the next available provider."
                        : "Fixed provider requests are sent only to the selected provider."}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Pricing cells */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: B }}>
              {[
                { label: "Input / 1M",  value: `$${active.input.toFixed(2)}`,  mono: true  },
                { label: "Output / 1M", value: `$${active.output > 0 ? active.output.toFixed(2) : "—"}`, mono: true },
                { label: "Context",     value: active.context, mono: false },
                { label: "Latency",     value: active.latency, mono: false },
              ].map((cell, i) => (
                <div key={cell.label} style={{
                  padding: "14px 16px", minHeight: 64,
                  borderRight: i % 2 === 0 ? "1px solid #EFEFEF" : "none",
                  borderBottom: i < 2 ? "1px solid #EFEFEF" : "none",
                }}>
                  <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{cell.label}</div>
                  <div style={{ fontFamily: cell.mono ? F.mono : F.sans, fontSize: D.body, fontWeight: 600, color: "#111", fontVariantNumeric: cell.mono ? undefined : "tabular-nums" }}>{cell.value}</div>
                </div>
              ))}
            </div>

            {/* Quick use — collapsible */}
            <div style={{ borderBottom: B }}>
              <button onClick={() => setShowQuick((v) => !v)} style={{
                width: "100%", height: 32, display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 16px", background: "#FAFAFA", border: "none", cursor: "pointer",
                borderBottom: showQuick ? "1px solid #EFEFEF" : "none",
              }}>
                <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", textTransform: "uppercase", letterSpacing: "0.04em" }}>Quick use</span>
                <ChevronDown size={10} color="#C0C0C0" style={{ transform: showQuick ? "rotate(180deg)" : "none", transition: "transform 150ms" }} />
              </button>

              {showQuick && (
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>System prompt</div>
                    <div style={{ position: "relative" }}>
                      <select value={systemIdx} onChange={(e) => setSystemIdx(Number(e.target.value))}
                        style={{ width: "100%", fontFamily: F.sans, fontSize: D.body, color: "#333", border: "1px solid #E5E5E5", padding: "0 28px 0 10px", height: 36, borderRadius: 6, appearance: "none", background: "#fff", cursor: "pointer", outline: "none" }}>
                        {SYSTEM_PROMPTS.map((sp, i) => <option key={i} value={i}>{sp.label}</option>)}
                      </select>
                      <ChevronDown size={11} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[
                      { label: "Temperature", val: temperature, set: setTemperature, min: 0, max: 2, step: 0.1 },
                      { label: "Max tokens",  val: maxTokens,   set: setMaxTokens,   min: 64, max: 4096, step: 64 },
                    ].map((ctrl) => (
                      <div key={ctrl.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>{ctrl.label.toUpperCase()}</span>
                          <span style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: "#555" }}>{ctrl.val}</span>
                        </div>
                        <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.val}
                          onChange={(e) => ctrl.set(parseFloat(e.target.value) as never)}
                          style={{ width: "100%", accentColor: "#111", cursor: "pointer" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* API endpoint */}
            <div style={{ borderBottom: B }}>
              <DrawerSection label="API endpoint" />
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 16px", minHeight: 44, transition: "background 80ms",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontFamily: F.mono, fontSize: 12, color: "#222", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  openai: /v1/chat/completions
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: D.label, fontWeight: 600, height: 20,
                    display: "inline-flex", alignItems: "center", padding: "0 6px",
                    color: "#0047FF", background: "#EFF6FF", border: "1px solid #BFDBFE",
                    borderRadius: 4,
                  }}>POST</span>
                  <CopyBtn text="https://api.getopenmodels.com/v1/chat/completions" />
                </div>
              </div>
            </div>

            {/* Try prompts — only when no messages */}
            {messages.length === 0 && (
              <div style={{ borderBottom: B }}>
                <DrawerSection label="Try prompts" />
                <div style={{ padding: "10px 16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {["Explain this model's strengths", "Write a Python hello world", "What is a token?"].map((s) => (
                    <button key={s} onClick={() => setPrompt(s)} style={{
                      fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#555", textAlign: "left",
                      background: "#fff", border: "1px solid #E5E5E5", padding: "0 12px", height: 38,
                      borderRadius: 6, cursor: "pointer", transition: "border-color 100ms, background 80ms",
                      width: "100%",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.borderColor = "#C0C0C0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E5E5E5"; }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div style={{ padding: "14px 16px" }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: 14, display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#ccc", marginBottom: 4 }}>
                      {msg.role === "user" ? "You" : active.name}
                      {msg.tokens && <span style={{ marginLeft: 6, fontFamily: F.mono, fontSize: D.label, color: "#ddd" }}>{msg.tokens} tokens</span>}
                    </div>
                    <div style={{
                      maxWidth: "90%", padding: "9px 13px",
                      background: msg.role === "user" ? "#0a0a0a" : "#f7f7f7",
                      color: msg.role === "user" ? "#fff" : "#333",
                      fontFamily: F.sans, fontSize: D.body, lineHeight: 1.65,
                      border: msg.role === "assistant" ? "1px solid #eee" : "none",
                      whiteSpace: "pre-wrap",
                    }}>{msg.content}</div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#ccc" }}>{active.name} is responding</span>
                    <span style={{ fontFamily: F.mono, color: "#ccc", animation: "blink 1s infinite" }}>▌</span>
                  </div>
                )}
                <div ref={msgEnd} />
              </div>
            )}
          </div>

          {/* ── Cost strip ── */}
          {messages.length > 0 && (
            <div style={{ padding: "6px 16px", borderTop: "1px solid #f4f4f4", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#ccc" }}>{totalTokens} output tokens</span>
              <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#aaa" }}>~${estCost}</span>
            </div>
          )}

          {/* ── Input bar ── */}
          <div style={{ borderTop: B, padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
            <textarea
              placeholder={`Message ${active.name}…`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              rows={2}
              style={{ flex: 1, fontFamily: F.sans, fontSize: D.body, border: B, padding: "8px 10px", resize: "none", outline: "none", lineHeight: 1.5, color: "#111", boxSizing: "border-box", transition: "border-color 120ms" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#111")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button onClick={handleSend} disabled={!prompt.trim() || loading} style={{
                background: prompt.trim() && !loading ? "#0a0a0a" : "#e0e0e0",
                border: "none", cursor: prompt.trim() && !loading ? "pointer" : "not-allowed",
                padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", transition: "background 80ms",
              }}>
                <Send size={14} />
              </button>
              <button onClick={() => setMessages([])} style={{
                background: "none", border: B, cursor: "pointer",
                padding: "5px 8px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#ccc", transition: "border-color 80ms",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>

        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 1100px) {
          /* Hide Latency at medium widths */
          .mrow { grid-template-columns: 30% 16% 14% 14% 11% 15% !important; }
          .mrow > *:nth-child(6) { display: none; }
        }
        @media (max-width: 860px) {
          /* Show: Model Routes Input Status */
          .mrow { grid-template-columns: 1fr 18% 14% 12% !important; padding: 0 20px !important; }
          .mrow > *:nth-child(4), .mrow > *:nth-child(5), .mrow > *:nth-child(6) { display: none; }
        }
        @media (max-width: 600px) {
          /* Drawer goes full-screen on mobile */
          [data-drawer] { width: 100vw !important; min-width: 0 !important; max-width: 100vw !important; }
        }
      `}</style>
    </div>
  );
}
