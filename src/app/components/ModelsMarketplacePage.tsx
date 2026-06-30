import { useState, useRef, useEffect } from "react";
import { Search, Copy, Check, LayoutGrid, List, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { SEO, JsonLd, breadcrumbLd } from "../lib/seo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SupportButton } from "./SupportButton";
import { allModels } from "../lib/models-data";
import { T, F, WS } from "../lib/type";

const B    = "1px solid #e2e2e2";
const Bs   = "1px solid #eeeeee";
const blue = "#0047FF";
const GRID_BORDER = "1px solid #E5E7EB";
const GRID_DIV    = "1px solid #EEF0F2";

const COLS = 3; /* desktop columns */

const MODEL_TYPES = ["All", "Chat", "Coding", "Reasoning", "Embedding", "Image", "Audio"];

const supplyColor: Record<string, string> = {
  Direct:    "#15803D",
  Verified:  "#2563EB",
  Community: "#92400E",
  Limited:   "#A3A3A3",
};
const statusColor: Record<string, string> = {
  Live:          "#16A34A",
  Limited:       "#D97706",
  "Coming soon": "#A3A3A3",
};

/* ─── Copy button ────────────────────────────────────────── */
function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(id).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      title="Copy model ID"
      style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#16A34A" : "#C0C0C0", padding: 2, display: "flex", flexShrink: 0, transition: "color 100ms" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = copied ? "#16A34A" : "#888")}
      onMouseLeave={(e) => (e.currentTarget.style.color = copied ? "#16A34A" : "#C0C0C0")}
    >
      {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} />}
    </button>
  );
}

/* ─── Model grid item ────────────────────────────────────── */
function ModelItem({ m, col, row, onClick }: {
  m: any; col: number; row: number; onClick: () => void;
}) {
  const routeCount  = m.providerRoutes?.length ?? 0;
  const lowestRoute = m.providerRoutes?.[0];
  const supply      = m.supply as string;
  const status      = m.status as string;
  const cache       = m.cache ?? 0;

  const isFirstCol = col === 0;
  const isFirstRow = row === 0;

  return (
    <div
      onClick={onClick}
      className="mmp-item"
      style={{
        padding: "20px 22px",
        cursor: "pointer",
        transition: "background 80ms",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        /* Shared borders — no double lines */
        borderLeft:  isFirstCol ? "none" : GRID_DIV,
        borderTop:   isFirstRow ? "none" : GRID_DIV,
        background: "#fff",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
    >
      {/* Model ID row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#0a0a0a", lineHeight: 1.3, wordBreak: "break-all" as const }}>{m.id}</span>
        <CopyId id={m.id} />
      </div>

      {/* Provider + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
        <span style={{ fontFamily: F.sans, fontSize: 11, color: "#A3A3A3" }}>{m.provider ?? "—"}</span>
        {supply && (
          <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: supplyColor[supply] ?? "#A3A3A3", background: supply === "Verified" ? "#EFF6FF" : supply === "Direct" ? "#F0FDF4" : supply === "Community" ? "#FEF3C7" : "#F5F5F5", border: `1px solid ${supply === "Verified" ? "#BFDBFE" : supply === "Direct" ? "#BBF7D0" : supply === "Community" ? "#FDE68A" : "#E5E5E5"}`, borderRadius: 999, padding: "1px 6px" }}>
            {supply}
          </span>
        )}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: F.sans, fontSize: 10, color: statusColor[status] ?? "#A3A3A3" }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: statusColor[status] ?? "#D1D5DB", flexShrink: 0 }} />
          {status}
        </span>
      </div>

      {/* Pricing */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
        {[
          { label: "Input",  val: m.input  },
          { label: "Output", val: m.output },
          { label: "Cache",  val: cache    },
        ].map(({ label, val }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: F.sans, fontSize: 11, color: "#B0B0B0" }}>{label}</span>
            <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: label === "Input" ? 600 : 400, color: val > 0 ? "#111" : "#DEDEDE", fontVariantNumeric: "tabular-nums" }}>
              {val > 0 ? `$${val.toFixed(3)}` : "—"}
              {val > 0 && <span style={{ fontFamily: F.sans, fontSize: 10, color: "#C0C0C0", marginLeft: 2 }}>/1M</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Footer row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto" }}>
        <span style={{ fontFamily: F.sans, fontSize: 11, color: "#C0C0C0", flexShrink: 0 }}>
          {routeCount > 0 ? `${routeCount} route${routeCount !== 1 ? "s" : ""}` : "—"}
          {lowestRoute?.provider ? ` · ${lowestRoute.provider}` : ""}
          {m.context ? ` · ${m.context}` : ""}
        </span>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {(m.tags ?? []).slice(0, 2).map((t: string) => (
            <span key={t} style={{ fontFamily: F.sans, fontSize: 10, color: "#999", background: "#F5F5F5", border: "1px solid #EBEBEB", borderRadius: 3, padding: "1px 5px" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Search dropdown ────────────────────────────────────── */
function SearchDropdown({ query, models, onSelect, onClose }: {
  query: string; models: any[]; onSelect: (id: string) => void; onClose: () => void;
}) {
  const results = models
    .filter((m) => !query || m.id.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  if (results.length === 0) return (
    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: "#fff", border: B, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "12px 16px", fontFamily: F.sans, fontSize: 13, color: "#A3A3A3" }}>
      No models found
    </div>
  );

  return (
    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: "#fff", border: B, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
      {results.map((m, i) => {
        const routeCount = m.providerRoutes?.length ?? 0;
        return (
          <button key={m.id} onClick={() => { onSelect(m.id); onClose(); }}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", minHeight: 42, background: "none", border: "none", borderBottom: i < results.length - 1 ? Bs : "none", cursor: "pointer", textAlign: "left", transition: "background 60ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#111" }}>{m.id}</span>
            <span style={{ fontFamily: F.sans, fontSize: 11, color: "#B0B0B0", flexShrink: 0, marginLeft: 12 }}>
              {m.provider ?? "—"}{(m.tags ?? [])[0] ? ` · ${m.tags[0]}` : ""}{routeCount > 0 ? ` · ${routeCount} route${routeCount !== 1 ? "s" : ""}` : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export function ModelsMarketplacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const goAuth = () => navigate("/", { state: { openAuth: true } });

  const initialFilter = (location.state as { filter?: string })?.filter ?? "All";
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [sortBy,    setSortBy]    = useState<"input" | "output">("input");
  const [view,      setView]      = useState<"card" | "table">("card");
  const [query,     setQuery]     = useState("");
  const [showDrop,  setShowDrop]  = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = allModels
    .filter((m) => {
      if (activeFilter !== "All" && !m.tags?.includes(activeFilter)) return false;
      if (query && !m.id.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => a[sortBy] - b[sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
      <SEO
        title="Models | OpenModels LLM Token Marketplace"
        description="Compare LLM token prices across provider routes. View input price, output price, context, routes, supply, and live status before choosing a model."
        path="/models"
      />
      <JsonLd id="breadcrumb-models" data={breadcrumbLd([{name:"OpenModels",url:"https://openmodels.market"},{name:"Models",url:"https://openmodels.market/models"}])} />
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

          {/* ── Page Header ── */}
          <div style={{ padding: "28px 32px 24px", borderBottom: B }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>MODELS</span>
                <h1 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 4, letterSpacing: 0 }}>
                  Open marketplace for LLM tokens
                </h1>
                <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.5, marginBottom: 10, maxWidth: 520 }}>
                  Compare LLM token prices across provider routes. Open a model to compare verified and community routes.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>333 models</span>
                  <span style={{ color: "#D5D5D5" }}>·</span>
                  <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>24 providers</span>
                  <span style={{ color: "#D5D5D5" }}>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />
                    <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>live prices</span>
                  </span>
                  <span style={{ color: "#D5D5D5" }}>·</span>
                  <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>updated 2m ago</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: "right", alignSelf: "center" }}>
                <div style={{ fontFamily: F.sans, fontSize: 48, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>41</div>
                <div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: "#333" }}>Total routes</div>
              </div>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div style={{ padding: "10px 28px", borderBottom: B, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

            {/* Search */}
            <div ref={searchRef} style={{ position: "relative", flex: "1 1 200px", minWidth: 160, maxWidth: 300 }}>
              <div style={{ position: "relative" }}>
                <Search size={13} color="#C0C0C0" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
                  onFocus={() => setShowDrop(true)}
                  onKeyDown={(e) => e.key === "Escape" && setShowDrop(false)}
                  placeholder="Search models…"
                  style={{ width: "100%", height: 34, paddingLeft: 32, paddingRight: query ? 28 : 10, fontFamily: F.sans, fontSize: 13, color: "#111", background: "#FAFAFA", border: B, outline: "none", boxSizing: "border-box" as const, transition: "border-color 100ms" }}
                  onFocusCapture={(e) => (e.target.style.borderColor = blue)}
                  onBlurCapture={(e) => (e.target.style.borderColor = "#e2e2e2")}
                />
                {query && (
                  <button onClick={() => { setQuery(""); setShowDrop(false); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#C0C0C0", padding: 0, display: "flex" }}>
                    <X size={12} />
                  </button>
                )}
              </div>
              {showDrop && (
                <SearchDropdown query={query} models={allModels} onSelect={(id) => { setQuery(""); navigate(`/models/${id}`); }} onClose={() => setShowDrop(false)} />
              )}
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              {MODEL_TYPES.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  style={{ height: 30, padding: "0 10px", fontFamily: F.sans, fontSize: 12, fontWeight: activeFilter === f ? 500 : 400, color: activeFilter === f ? blue : "#666", background: activeFilter === f ? "#EFF6FF" : "transparent", border: `1px solid ${activeFilter === f ? "#BFDBFE" : "transparent"}`, borderRadius: 4, cursor: "pointer", transition: "all 80ms", whiteSpace: "nowrap" as const }}
                  onMouseEnter={(e) => { if (activeFilter !== f) { e.currentTarget.style.color = "#111"; e.currentTarget.style.background = "#F5F5F5"; } }}
                  onMouseLeave={(e) => { if (activeFilter !== f) { e.currentTarget.style.color = "#666"; e.currentTarget.style.background = "transparent"; } }}
                >{f}</button>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#B0B0B0" }}>Sort:</span>
              {(["input", "output"] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  style={{ fontFamily: F.sans, fontSize: T.xs, color: sortBy === s ? "#111" : "#bbb", fontWeight: sortBy === s ? 500 : 400, background: "none", border: "none", cursor: "pointer", textDecoration: sortBy === s ? "underline" : "none", padding: "0 2px" }}
                >{s === "input" ? "Input price" : "Output price"}</button>
              ))}
            </div>

            {/* View toggle */}
            <div style={{ display: "flex", alignItems: "center", background: "#F5F5F5", border: B, borderRadius: 4, padding: 2, gap: 1 }}>
              {([["card", LayoutGrid], ["table", List]] as const).map(([v, Icon]) => (
                <button key={v} onClick={() => setView(v as any)} title={v === "card" ? "Grid view" : "Table view"}
                  style={{ width: 28, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: view === v ? "#fff" : "transparent", border: view === v ? B : "none", borderRadius: 3, cursor: "pointer", color: view === v ? "#111" : "#B0B0B0", transition: "all 80ms" }}>
                  <Icon size={13} strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Card / Grid view ── */}
          {view === "card" && (
            <div style={{ padding: "24px 28px 28px" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: "#A3A3A3", fontFamily: F.sans, fontSize: WS.body }}>No models found.</div>
              ) : (
                /* Outer border wraps all items; inner items share dividers */
                <div className="mmp-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, border: GRID_BORDER }}>
                  {filtered.map((m, idx) => {
                    const col = idx % COLS;
                    const row = Math.floor(idx / COLS);
                    return <ModelItem key={m.id} m={m} col={col} row={row} onClick={() => navigate(`/models/${m.id}`)} />;
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Table view ── */}
          {view === "table" && (<>
            <div className="mmp-row" style={{ display: "grid", gridTemplateColumns: "32% 4% 11% 11% 9% 10% 12% 11%", padding: "10px 28px", height: 44, alignItems: "center", background: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              {["Model", "", "Input /1M", "Output /1M", "Context", "Routes", "Supply", "Status"].map((h, idx) => (
                <span key={idx} style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: "#B8B8B8", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: "48px 32px", textAlign: "center", color: "#A3A3A3", fontFamily: F.sans, fontSize: WS.body }}>No models found.</div>
            ) : filtered.map((m, i) => {
              const routeCount = m.providerRoutes?.length ?? 0;
              const supply = m.supply as string;
              const status = m.status as string;
              return (
                <div key={m.id} className="mmp-row"
                  onClick={() => navigate(`/models/${m.id}`)}
                  style={{ display: "grid", gridTemplateColumns: "32% 4% 11% 11% 9% 10% 12% 11%", padding: "0 28px", minHeight: 64, borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none", alignItems: "center", cursor: "pointer", transition: "background 80ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111" }}>{m.id}</span>
                  <span />
                  <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 600, color: "#111" }}>${m.input.toFixed(3)}</span>
                  <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#555" }}>{m.output > 0 ? `$${m.output.toFixed(3)}` : "—"}</span>
                  <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#AAAAAA" }}>{m.context}</span>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: routeCount > 0 ? "#777" : "#C0C0C0" }}>{routeCount > 0 ? `${routeCount} route${routeCount !== 1 ? "s" : ""}` : "—"}</span>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: supplyColor[supply] ?? "#A3A3A3" }}>{m.supply}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 12, color: "#999" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", flexShrink: 0, background: statusColor[status] ?? "#D1D5DB" }} />
                    {m.status}
                  </span>
                </div>
              );
            })}
          </>)}

          {/* Footer note */}
          <div style={{ padding: "12px 28px", borderTop: "1px solid #F0F0F0" }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>
              Prices per 1M tokens · lowest verified route shown by default · open a model to compare all routes
            </span>
          </div>

          {/* Provider CTA strip */}
          <div style={{ padding: "24px 32px", borderTop: B, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 4 }}>For providers</div>
              <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 3 }}>List your token routes on OpenModels</div>
              <div style={{ fontFamily: F.sans, fontSize: WS.body, color: "#888" }}>Community routes can be submitted faster. Verified routes are reviewed for production usage.</div>
            </div>
            <a href="/provider-console" style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", flexShrink: 0, transition: "opacity 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Become a provider →</a>
          </div>

        </div>
      </div>

      <Footer onGetKey={goAuth} />
      <SupportButton />

      <style>{`
        @media (max-width: 900px) {
          .mmp-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mmp-item:nth-child(2n+1) { border-left: none !important; }
          .mmp-item:nth-child(-n+2) { border-top: none !important; }
          .mmp-row { grid-template-columns: 1fr 80px 64px 80px 72px !important; }
          .mmp-row > *:nth-child(3), .mmp-row > *:nth-child(4) { display: none; }
        }
        @media (max-width: 600px) {
          .mmp-grid { grid-template-columns: 1fr !important; }
          .mmp-item { border-left: none !important; border-top: 1px solid #EEF0F2 !important; }
          .mmp-item:first-child { border-top: none !important; }
          .mmp-row { grid-template-columns: 1fr 72px 70px !important; }
          .mmp-row > *:nth-child(3), .mmp-row > *:nth-child(4),
          .mmp-row > *:nth-child(5), .mmp-row > *:nth-child(6) { display: none; }
        }
      `}</style>
    </div>
  );
}
