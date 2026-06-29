import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { SEO, JsonLd, breadcrumbLd } from "../lib/seo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { allModels } from "../lib/models-data";
import { T, F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

const filters = ["All", "Chat", "Coding", "Reasoning", "Embedding"];

const supplyColor: Record<string, string> = {
  Direct:   "#15803D",
  Verified: "#2563EB",
  Limited:  "#A3A3A3",
};
const statusColor: Record<string, string> = {
  Live:          "#16A34A",
  Limited:       "#D97706",
  "Coming soon": "#A3A3A3",
};

export function ModelsMarketplacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const goAuth = () => navigate("/", { state: { openAuth: true } });

  const initialFilter = (location.state as { filter?: string })?.filter ?? "All";
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState<"input" | "output">("input");

  const filtered = allModels
    .filter((m) => activeFilter === "All" || m.tags.includes(activeFilter))
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
              {/* Left */}
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

              {/* Right: Total routes stat — centered in the column */}
              <div style={{ flexShrink: 0, width: 150, alignSelf: "center" }}>
                <div style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 700, color: blue, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>41</div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: "#666" }}>Total routes</div>
              </div>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #F0F0F0", flexWrap: "wrap" }}>
            {/* Left: filter tabs */}
            <div style={{ display: "flex", alignItems: "center", padding: "0 28px" }}>
              {filters.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{
                  fontFamily: F.sans, fontSize: T.sm,
                  color: activeFilter === f ? blue : "#8a8a8a",
                  fontWeight: activeFilter === f ? 500 : 400,
                  background: "none", border: "none",
                  borderBottom: activeFilter === f ? `2px solid ${blue}` : "2px solid transparent",
                  padding: "10px 14px", cursor: "pointer", transition: "color 100ms", marginBottom: -1,
                }}
                  onMouseEnter={(e) => { if (activeFilter !== f) e.currentTarget.style.color = "#333"; }}
                  onMouseLeave={(e) => { if (activeFilter !== f) e.currentTarget.style.color = "#8a8a8a"; }}
                >{f}</button>
              ))}
            </div>

            {/* Right: label + sort */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, padding: "0 28px" }}>
              <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#C0C0C0" }}>
                Prices per 1M tokens · lowest verified route shown by default
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ArrowUpDown size={11} color="#ccc" />
                <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#ccc" }}>Sort:</span>
                {(["input", "output"] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)} style={{
                    fontFamily: F.sans, fontSize: T.xs,
                    color: sortBy === s ? "#111" : "#bbb", fontWeight: sortBy === s ? 500 : 400,
                    background: "none", border: "none", cursor: "pointer",
                    textDecoration: sortBy === s ? "underline" : "none",
                  }}>{s === "input" ? "Input" : "Output"}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Table header ── */}
          <div className="mmp-row" style={{
            display: "grid", gridTemplateColumns: "32% 4% 11% 11% 9% 10% 12% 11%",
            padding: "10px 28px", height: 44, alignItems: "center",
            background: "#FAFAFA", borderBottom: "1px solid #F0F0F0",
          }}>
            {["Model", "", "Input /1M", "Output /1M", "Context", "Routes", "Supply", "Status"].map((h, idx) => (
              <span key={idx} style={{
                fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500,
                color: "#B8B8B8", letterSpacing: "0.04em", textTransform: "uppercase",
              }}>{h}</span>
            ))}
          </div>

          {/* ── Table body ── */}
          {filtered.length === 0 ? (
            <div style={{ padding: "48px 32px", textAlign: "center", color: "#A3A3A3", fontFamily: F.sans, fontSize: WS.body }}>
              No models found in this category.
            </div>
          ) : (
            filtered.map((m, i) => {
              const routeCount = m.providerRoutes?.length ?? 0;
              const supply = m.supply as string;
              const status = m.status as string;
              return (
                <div
                  key={m.id}
                  className="mmp-row"
                  onClick={() => navigate(`/models/${m.id}`)}
                  style={{
                    display: "grid", gridTemplateColumns: "32% 4% 11% 11% 9% 10% 12% 11%",
                    padding: "0 28px", minHeight: 64,
                    borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none",
                    alignItems: "center", cursor: "pointer", transition: "background 80ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#111" }}>{m.id}</span>
                  <span />{/* spacer */}
                  <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 600, color: "#111" }}>${m.input.toFixed(2)}</span>
                  <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#555" }}>{m.output > 0 ? `$${m.output.toFixed(2)}` : "—"}</span>
                  <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#AAAAAA" }}>{m.context}</span>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: routeCount > 0 ? "#777" : "#C0C0C0" }}>
                    {routeCount > 0 ? `${routeCount} route${routeCount !== 1 ? "s" : ""}` : "—"}
                  </span>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: supplyColor[supply] ?? "#A3A3A3" }}>
                    {m.supply}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 12, color: "#999" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", flexShrink: 0, background: statusColor[status] ?? "#D1D5DB" }} />
                    {m.status}
                  </span>
                </div>
              );
            })
          )}

          {/* Footer note */}
          <div style={{ padding: "12px 28px", borderTop: "1px solid #F0F0F0" }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>
              Default prices use the lowest verified route. Open a model to compare all verified and community provider routes.
            </span>
          </div>

          {/* Provider CTA strip */}
          <div style={{ padding: "24px 32px", borderTop: B, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 4 }}>For providers</div>
              <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 3 }}>List your token routes on OpenModels</div>
              <div style={{ fontFamily: F.sans, fontSize: WS.body, color: "#888" }}>Community routes can be submitted faster. Verified routes are reviewed for production usage.</div>
            </div>
            <a href="/providers/apply" style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", flexShrink: 0, transition: "opacity 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Become a provider →</a>
          </div>

        </div>
      </div>

      <Footer onGetKey={goAuth} />

      <style>{`
        @media (max-width: 900px) {
          .mmp-row { grid-template-columns: 1fr 80px 64px 80px 72px !important; }
          .mmp-row > *:nth-child(3), .mmp-row > *:nth-child(4) { display: none; }
        }
        @media (max-width: 600px) {
          .mmp-row { grid-template-columns: 1fr 72px 70px !important; }
          .mmp-row > *:nth-child(3), .mmp-row > *:nth-child(4),
          .mmp-row > *:nth-child(5), .mmp-row > *:nth-child(6) { display: none; }
        }
      `}</style>
    </div>
  );
}
