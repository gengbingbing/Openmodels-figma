import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { BarChart2 } from "lucide-react";
import { T, F } from "../../../lib/type";
import { B, Bs, blue, D } from "../shared";

const tt = { fontFamily: "var(--font-sans, 'Geist', system-ui, sans-serif)", fontSize: 10, border: "1px solid #E5E5E5", borderRadius: 0, boxShadow: "none" };

const data7d = [
  { day: "Jun 6",  input: 1.2, output: 0.3, requests: 210, cost: 0.80 },
  { day: "Jun 7",  input: 3.4, output: 0.8, requests: 580, cost: 1.40 },
  { day: "Jun 8",  input: 0.9, output: 0.2, requests: 140, cost: 0.44 },
  { day: "Jun 9",  input: 0.0, output: 0.0, requests: 0,   cost: 0.00 },
  { day: "Jun 10", input: 2.8, output: 0.6, requests: 440, cost: 1.19 },
  { day: "Jun 11", input: 4.1, output: 1.0, requests: 620, cost: 0.84 },
  { day: "Jun 12", input: 1.8, output: 0.4, requests: 310, cost: 0.65 },
];
const data30d = Array.from({ length: 30 }, (_, i) => ({ day: `Jun ${i + 1}`, input: Math.random() * 4, output: Math.random() * 1, requests: Math.floor(Math.random() * 700), cost: Math.random() * 1.5 }));

const modelBreakdown = [
  { model: "qwen-2.5-72b",       provider: "Novita",      routeMode: "Priority fallback", route: "route:coding-agent",  routeRule: "Priority fallback", fallback: false, reason: "Selected by priority order",                requests: 1840, input: 4.2,  output: 0.9, unitIn: 0.32, unitOut: 0.58, cost: 1.93, pct: 37, inTokens: 4200000,  outTokens: 900000  },
  { model: "deepseek-v3",        provider: "DeepSeek",    routeMode: "Mode mapping",      route: "route:support-chat",  routeRule: "Mode mapping",      fallback: false, reason: "Selected by route_mode: deep",              requests: 920,  input: 2.0,  output: 0.5, unitIn: 0.28, unitOut: 0.55, cost: 0.84, pct: 16, inTokens: 2000000,  outTokens: 500000  },
  { model: "llama-3.1-70b",      provider: "Together AI", routeMode: "Priority fallback", route: "route:coding-agent",  routeRule: "Priority fallback", fallback: true,  reason: "Fallback from qwen-2.5-coder-32b",          requests: 610,  input: 3.1,  output: 0.7, unitIn: 0.38, unitOut: 0.65, cost: 1.73, pct: 33, inTokens: 3100000,  outTokens: 700000  },
  { model: "mistral-large",      provider: "Fireworks",   routeMode: "—",                 route: "—",                   routeRule: "—",                 fallback: false, reason: "No route — default verified supply used",   requests: 280,  input: 0.8,  output: 0.2, unitIn: 0.42, unitOut: 0.76, cost: 0.52, pct: 10, inTokens: 800000,   outTokens: 200000  },
  { model: "qwen-2.5-coder-32b", provider: "Novita",      routeMode: "Priority fallback", route: "route:coding-agent",  routeRule: "Priority fallback", fallback: false, reason: "Selected by priority order",                requests: 140,  input: 0.5,  output: 0.1, unitIn: 0.18, unitOut: 0.38, cost: 0.14, pct: 4,  inTokens: 500000,   outTokens: 100000  },
];
const keyBreakdown = [
  { key: "Production",   requests: 2980, cost: 3.44, pct: 66 },
  { key: "Development",  requests: 710,  cost: 1.29, pct: 25 },
  { key: "CI / Testing", requests: 100,  cost: 0.43, pct: 9  },
];

type Range = "7d" | "30d";
type Mode  = "tokens" | "requests" | "cost";
type View  = "model" | "key";

export function UsagePage() {
  const [range, setRange]         = useState<Range>("7d");
  const [chartMode, setChartMode] = useState<Mode>("tokens");
  const [view, setView]           = useState<View>("model");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const data = range === "7d" ? data7d : data30d;
  const totalRequests = data.reduce((s, d) => s + d.requests, 0);
  const totalInput    = data.reduce((s, d) => s + d.input, 0);
  const totalOutput   = data.reduce((s, d) => s + d.output, 0);
  const totalCost     = data.reduce((s, d) => s + d.cost, 0);


  const Toggle = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div style={{ display: "flex", border: B }}>
      {options.map((o, i) => (
        <button key={o} onClick={() => onChange(o)} style={{
          fontFamily: F.sans, fontSize: D.label, fontWeight: value === o ? 500 : 400,
          padding: "5px 14px", background: value === o ? "#f7f7f7" : "transparent",
          color: value === o ? "#111" : "#aaa", border: "none",
          borderLeft: i > 0 ? B : "none", cursor: "pointer",
        }}>{o}</button>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: F.sans }}>
      {/* Header */}
      <div style={{ padding: "32px 28px 24px", borderBottom: B, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <BarChart2 size={11} color={blue} strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em" }}>USAGE</span>
          </span>
          <h1 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 6, lineHeight: 1.2 }}>Token consumption</h1>
          <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#777", lineHeight: 1.65, marginBottom: 4 }}>Spend and token volume across all models and API keys.</p>
          <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", margin: 0 }}>Usage is charged from your credits balance based on the selected model route and live token pricing.</p>
        </div>
        <Toggle options={["7d", "30d"]} value={range} onChange={(v) => setRange(v as Range)} />
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: B }}>
        {[
          { label: "REQUESTS",      value: totalRequests.toLocaleString() },
          { label: "INPUT TOKENS",  value: `${totalInput.toFixed(1)}M` },
          { label: "OUTPUT TOKENS", value: `${totalOutput.toFixed(1)}M` },
          { label: "TOTAL SPEND",   value: `$${totalCost.toFixed(2)}` },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: "20px 28px", borderRight: i < 3 ? B : "none" }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: F.sans, fontSize: 18, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "#0a0a0a", letterSpacing: "-0.035em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: "24px 28px", borderBottom: B }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>
            {chartMode === "tokens" ? "TOKENS / DAY (millions)" : chartMode === "requests" ? "REQUESTS / DAY" : "SPEND / DAY (USD)"}
          </div>
          <Toggle options={["tokens", "requests", "cost"]} value={chartMode} onChange={(v) => setChartMode(v as Mode)} />
        </div>
        <ResponsiveContainer key={chartMode} width="100%" height={170}>
          {chartMode === "tokens" ? (
            <BarChart data={data} barSize={range === "7d" ? 18 : 5} barGap={2} margin={{ left: -10 }}>
              <CartesianGrid vertical={false} stroke="#f2f2f2" />
              <XAxis dataKey="day" tick={{ fontFamily: F.sans, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} interval={range === "7d" ? 0 : 4} />
              <YAxis tick={{ fontFamily: F.mono, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} width={34} />
              <Tooltip formatter={(v: number, n: string) => [`${v.toFixed(2)}M`, n === "input" ? "Input" : "Output"]} contentStyle={tt} animationDuration={0} />
              <Bar dataKey="input" fill="#111" radius={0} name="input" isAnimationActive={false} />
              <Bar dataKey="output" fill="#ddd" radius={0} name="output" isAnimationActive={false} />
            </BarChart>
          ) : chartMode === "requests" ? (
            <BarChart data={data} barSize={range === "7d" ? 18 : 5} margin={{ left: -10 }}>
              <CartesianGrid vertical={false} stroke="#f2f2f2" />
              <XAxis dataKey="day" tick={{ fontFamily: F.sans, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} interval={range === "7d" ? 0 : 4} />
              <YAxis tick={{ fontFamily: F.mono, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip formatter={(v: number) => [v.toLocaleString(), "Requests"]} contentStyle={tt} animationDuration={0} />
              <Bar dataKey="requests" fill={blue} radius={0} isAnimationActive={false} />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ left: -10 }}>
              <CartesianGrid vertical={false} stroke="#f2f2f2" />
              <XAxis dataKey="day" tick={{ fontFamily: F.sans, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} interval={range === "7d" ? 0 : 4} />
              <YAxis tick={{ fontFamily: F.mono, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={34} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Spend"]} contentStyle={tt} animationDuration={0} />
              <Line dataKey="cost" stroke="#111" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
        {chartMode === "tokens" && (
          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
            {[{ color: "#111", label: "Input" }, { color: "#ddd", label: "Output", border: "1px solid #ccc" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, background: l.color, border: (l as any).border, display: "inline-block" }} />
                <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>{l.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div style={{ padding: "24px 28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>BREAKDOWN</div>
          <Toggle options={["model", "key"]} value={view} onChange={(v) => setView(v as View)} />
        </div>
        <div style={{ border: B }}>
          {view === "model" ? (
            <>
              <div className="usage-row" style={{ display: "grid", gridTemplateColumns: "1fr 110px 140px 90px 130px 90px 110px", height: 40, alignItems: "center", padding: "0 24px", background: "#f7f7f7", borderBottom: B }}>
                {["Model", "Provider", "Route mode", "Requests", "Unit price", "Cost", "Share"].map((h) => (
                  <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {modelBreakdown.map((row, i) => {
                const isExpanded = expandedRow === row.model;
                return (
                  <div key={row.model}>
                    <div className="usage-row" style={{ display: "grid", gridTemplateColumns: "1fr 110px 140px 90px 130px 90px 110px", minHeight: 52, padding: "0 24px", borderBottom: isExpanded ? "none" : i < modelBreakdown.length - 1 ? Bs : "none", alignItems: "center", transition: "background 80ms", cursor: "pointer" }}
                      onClick={() => setExpandedRow(isExpanded ? null : row.model)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#0a0a0a" }}>{row.model}</span>
                        <span style={{ fontFamily: F.sans, fontSize: D.label, color: isExpanded ? blue : "#C0C0C0", transition: "color 100ms" }}>▾</span>
                      </div>
                      <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#555" }}>{row.provider}</span>
                      <span style={{ fontFamily: F.sans, fontSize: D.body, color: row.routeMode.startsWith("Fixed") ? "#B45309" : "#555", whiteSpace: "nowrap" }}>{row.routeMode}</span>
                      <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555", fontVariantNumeric: "tabular-nums" }}>{row.requests.toLocaleString()}</span>
                      <div>
                        <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 500, color: "#333", fontVariantNumeric: "tabular-nums" }}>${row.unitIn}</span>
                        <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#ccc", margin: "0 4px" }}>/</span>
                        <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#666", fontVariantNumeric: "tabular-nums" }}>${row.unitOut}</span>
                      </div>
                      <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#0a0a0a", fontVariantNumeric: "tabular-nums" }}>${row.cost.toFixed(2)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 48, height: 2, background: "#f0f0f0", flexShrink: 0 }}>
                          <div style={{ height: "100%", width: `${row.pct}%`, background: "#555" }} />
                        </div>
                        <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#bbb", fontVariantNumeric: "tabular-nums" }}>{row.pct}%</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: "12px 24px 14px 24px", background: "#FAFAFA", borderBottom: i < modelBreakdown.length - 1 ? Bs : "none", borderTop: "1px solid #EFEFEF" }}>
                        <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>BILLING PROOF</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "4px 12px", marginBottom: 8 }}>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Route ID</span>
                            <span style={{ fontFamily: F.mono, fontSize: D.label, color: row.route === "—" ? "#C0C0C0" : "#333" }}>{row.route}</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Route rule</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: row.routeRule === "—" ? "#C0C0C0" : "#555" }}>{row.routeRule}</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Selected model</span>
                            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#333" }}>{row.model}</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Selected provider</span>
                            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#333" }}>{row.provider}</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Fallback</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: row.fallback ? "#B45309" : "#C0C0C0" }}>{row.fallback ? "Yes" : "No"}</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Selection reason</span>
                            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#555", fontStyle: "italic" }}>{row.reason}</span>
                          </div>
                          <div style={{ paddingTop: 8, borderTop: "1px solid #EFEFEF" }}>
                            <div style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>
                              Input: {(row.inTokens / 1000000).toFixed(1)}M tokens × ${row.unitIn} / 1M = <span style={{ color: "#111", fontWeight: 600 }}>${((row.inTokens * row.unitIn) / 1000000).toFixed(2)}</span>
                            </div>
                            <div style={{ fontFamily: F.mono, fontSize: D.body, color: "#555", marginTop: 3 }}>
                              Output: {(row.outTokens / 1000000).toFixed(1)}M tokens × ${row.unitOut} / 1M = <span style={{ color: "#111", fontWeight: 600 }}>${((row.outTokens * row.unitOut) / 1000000).toFixed(2)}</span>
                            </div>
                            <div style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111", paddingTop: 6, borderTop: "1px solid #EFEFEF", marginTop: 6 }}>
                              Total charged: ${row.cost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 100px 100px 100px", padding: "8px 16px", background: "#f7f7f7", borderBottom: B }}>
                {["API Key", "Requests", "Cost", "Share"].map((h) => (
                  <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3" }}>{h}</span>
                ))}
              </div>
              {keyBreakdown.map((row, i) => (
                <div key={row.key} style={{ display: "grid", gridTemplateColumns: "2fr 100px 100px 100px", padding: "12px 16px", borderBottom: i < keyBreakdown.length - 1 ? Bs : "none", alignItems: "center", transition: "background 80ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#0a0a0a" }}>{row.key}</span>
                  <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{row.requests.toLocaleString()}</span>
                  <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#0a0a0a" }}>${row.cost.toFixed(2)}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 2, background: "#f0f0f0" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, background: blue }} />
                    </div>
                    <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#bbb", width: 26, textAlign: "right" }}>{row.pct}%</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .usage-row { grid-template-columns: 1fr 110px 90px 90px !important; padding: 0 16px !important; }
          .usage-row > *:nth-child(3), .usage-row > *:nth-child(5), .usage-row > *:nth-child(7) { display: none; }
        }
        @media (max-width: 640px) {
          .usage-row { grid-template-columns: 1fr 90px 90px !important; }
          .usage-row > *:nth-child(3), .usage-row > *:nth-child(4), .usage-row > *:nth-child(5), .usage-row > *:nth-child(7) { display: none; }
        }
      `}</style>
    </div>
  );
}
