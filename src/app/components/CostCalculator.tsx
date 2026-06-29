import { useState } from "react";
import { Calculator } from "lucide-react";
import { T, F } from "../lib/type";

const B = "1px solid #e2e2e2";

const openModels = [
  { id: "qwen-2.5-72b",  label: "Qwen 2.5 72B",  input: 0.35, output: 0.60 },
  { id: "deepseek-v3",   label: "DeepSeek V3",    input: 0.28, output: 0.55 },
  { id: "llama-3.1-70b", label: "Llama 3.1 70B",  input: 0.40, output: 0.70 },
  { id: "mistral-large", label: "Mistral Large",  input: 0.45, output: 0.80 },
  { id: "deepseek-r1",   label: "DeepSeek R1",    input: 0.50, output: 1.20 },
  { id: "llama-3.1-8b",  label: "Llama 3.1 8B",   input: 0.06, output: 0.12 },
];

const competitors = [
  { id: "gpt4o",     label: "GPT-4o",           input: 2.50,  output: 10.00, provider: "OpenAI" },
  { id: "gpt4omini", label: "GPT-4o mini",      input: 0.15,  output: 0.60,  provider: "OpenAI" },
  { id: "claude35s", label: "Claude 3.5 Sonnet",input: 3.00,  output: 15.00, provider: "Anthropic" },
  { id: "claude35h", label: "Claude 3.5 Haiku", input: 0.80,  output: 4.00,  provider: "Anthropic" },
  { id: "gemini15p", label: "Gemini 1.5 Pro",   input: 1.25,  output: 5.00,  provider: "Google" },
  { id: "gemini15f", label: "Gemini 1.5 Flash", input: 0.075, output: 0.30,  provider: "Google" },
  { id: "togai",     label: "Llama 70B",         input: 0.90,  output: 0.90,  provider: "Together AI" },
];

function fmtMoney(n: number) {
  if (n >= 10000) return `$${(n / 1000).toFixed(1)}k`;
  if (n >= 1000)  return `$${(n / 1000).toFixed(2)}k`;
  if (n >= 1)     return `$${n.toFixed(2)}`;
  return `$${n.toFixed(3)}`;
}

export function CostCalculator() {
  const [inputTokens,    setInputTokens]    = useState(10);
  const [outputTokens,   setOutputTokens]   = useState(2);
  const [selectedModel,  setSelectedModel]  = useState(openModels[0]);
  const [selectedComp,   setSelectedComp]   = useState(competitors[0]);

  const omCost   = selectedModel.input * inputTokens + selectedModel.output * outputTokens;
  const compCost = selectedComp.input  * inputTokens + selectedComp.output  * outputTokens;
  const savings  = compCost - omCost;
  const savingsPct = compCost > 0 ? Math.round((savings / compCost) * 100) : 0;

  return (
    <section id="calculator">
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header */}
        <div style={{ padding: "32px 28px 22px", borderBottom: B, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <Calculator size={11} color="#0047FF" strokeWidth={2} />
              <span style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#0047FF", letterSpacing: "0.1em" }}>COST CALCULATOR</span>
            </span>
            <h2 style={{ fontFamily: F.sans, fontSize: T.lg, fontWeight: 700, letterSpacing: "-0.035em", color: "#0a0a0a", marginBottom: 8 }}>See the price difference before you route traffic</h2>
            <p style={{ fontFamily: F.sans, fontSize: T.sm, color: "#777" }}>Estimate monthly token cost across OpenModels and other providers.</p>
          </div>
          <a href="#" style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#fff", background: "#111", textDecoration: "none", padding: "9px 18px", transition: "background 120ms", letterSpacing: "-0.01em" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
          >Get API key →</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="calc-grid">

          {/* ── Left: inputs ── */}
          <div style={{ borderRight: B }}>
            {/* Model select */}
            <div style={{ padding: "20px 24px", borderBottom: B }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 12 }}>SELECT MODEL</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {openModels.map((m) => {
                  const active = selectedModel.id === m.id;
                  return (
                    <button key={m.id} onClick={() => setSelectedModel(m)} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 10px",
                      background: active ? "#111" : "transparent",
                      border: `1px solid ${active ? "#111" : "#eee"}`,
                      cursor: "pointer", textAlign: "left", transition: "all 80ms",
                    }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "#999"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "#eee"; }}
                    >
                      <span style={{ fontFamily: F.mono, fontSize: T.xs, color: active ? "#fff" : "#555" }}>{m.id}</span>
                      <span style={{ fontFamily: F.mono, fontSize: T.xs, color: active ? "#888" : "#ccc" }}>${m.input} · ${m.output}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div style={{ padding: "20px 24px", borderBottom: B }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 16 }}>MONTHLY VOLUME</div>
              {[
                { label: "Input tokens", val: inputTokens, set: setInputTokens, max: 500, step: 0.5 },
                { label: "Output tokens", val: outputTokens, set: setOutputTokens, max: 100, step: 0.1 },
              ].map((s) => (
                <div key={s.label} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontFamily: F.sans, fontSize: T.sm, color: "#555" }}>{s.label}</span>
                    <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 500, color: "#111" }}>
                      {s.val >= 1 ? `${s.val}M` : `${Math.round(s.val * 1000)}K`}
                    </span>
                  </div>
                  <input type="range" min={0.1} max={s.max} step={s.step} value={s.val}
                    onChange={(e) => s.set(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#111", cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                    <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#ccc" }}>100K</span>
                    <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#ccc" }}>{s.max}M</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Compare against */}
            <div style={{ padding: "20px 24px" }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 12 }}>COMPARE AGAINST</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {competitors.map((c) => {
                  const active = selectedComp.id === c.id;
                  return (
                    <button key={c.id} onClick={() => setSelectedComp(c)} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 10px", background: active ? "#fafafa" : "transparent",
                      border: `1px solid ${active ? "#e0e0e0" : "transparent"}`,
                      cursor: "pointer", textAlign: "left", transition: "all 80ms",
                    }}>
                      <div>
                        <span style={{ fontFamily: F.sans, fontSize: T.sm, color: active ? "#111" : "#666", fontWeight: active ? 500 : 400 }}>{c.label}</span>
                        <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#ccc", marginLeft: 6 }}>{c.provider}</span>
                      </div>
                      <span style={{ fontFamily: F.mono, fontSize: T.xs, color: "#ccc" }}>${c.input}↑ ${c.output}↓</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: results ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Big savings */}
            <div style={{ padding: "28px 24px", borderBottom: B }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>MONTHLY SAVINGS</div>
              <div style={{ fontFamily: F.mono, fontSize: T.numLg * 1.5, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1, color: savings > 0 ? "#16A34A" : "#ddd", marginBottom: 8 }}>
                {savings > 0 ? fmtMoney(savings) : "—"}
              </div>
              {savings > 0 ? (
                <p style={{ fontFamily: F.sans, fontSize: T.sm, color: "#888", margin: 0 }}>
                  <strong style={{ color: "#111", fontWeight: 600 }}>{savingsPct}% cheaper</strong> than {selectedComp.label}
                </p>
              ) : (
                <p style={{ fontFamily: F.sans, fontSize: T.sm, color: "#ccc", margin: 0 }}>
                  {selectedComp.label} is already cheaper for this task
                </p>
              )}
            </div>

            {/* Cost comparison bars */}
            <div style={{ padding: "20px 24px", borderBottom: B }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 16 }}>MONTHLY COST</div>
              {[
                { label: `OpenModels · ${selectedModel.id}`, cost: omCost, dark: true },
                { label: `${selectedComp.label} · ${selectedComp.provider}`, cost: compCost, dark: false },
              ].map((row) => (
                <div key={row.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: F.sans, fontSize: T.xs, color: row.dark ? "#111" : "#888", fontWeight: row.dark ? 500 : 400 }}>{row.label}</span>
                    <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: row.dark ? 600 : 400, color: row.dark ? "#111" : "#aaa" }}>{fmtMoney(row.cost)}</span>
                  </div>
                  <div style={{ height: 4, background: "#f0f0f0" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (row.cost / Math.max(omCost, compCost, 0.01)) * 100)}%`, background: row.dark ? "#111" : "#ddd", transition: "width 280ms ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div style={{ padding: "20px 24px", borderBottom: B, flex: 1 }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 12 }}>BREAKDOWN</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ fontFamily: F.sans, fontSize: T.xs, color: "#ccc", textAlign: "left", padding: "4px 0", fontWeight: 400 }} />
                    <th style={{ fontFamily: F.sans, fontSize: T.xs, color: "#999", textAlign: "right", padding: "4px 0", fontWeight: 500 }}>OpenModels</th>
                    <th style={{ fontFamily: F.sans, fontSize: T.xs, color: "#ccc", textAlign: "right", padding: "4px 0", fontWeight: 400 }}>{selectedComp.provider}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: `Input (${inputTokens}M)`,  om: selectedModel.input * inputTokens,  comp: selectedComp.input * inputTokens },
                    { label: `Output (${outputTokens}M)`, om: selectedModel.output * outputTokens, comp: selectedComp.output * outputTokens },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td style={{ fontFamily: F.sans, fontSize: T.sm, color: "#888", padding: "6px 0" }}>{row.label}</td>
                      <td style={{ fontFamily: F.mono, fontSize: T.sm, color: "#555", textAlign: "right", padding: "6px 0" }}>{fmtMoney(row.om)}</td>
                      <td style={{ fontFamily: F.mono, fontSize: T.sm, color: "#ccc", textAlign: "right", padding: "6px 0" }}>{fmtMoney(row.comp)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111", padding: "10px 0 6px", borderTop: "1px solid #eee" }}>Total / month</td>
                    <td style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 600, color: "#111", textAlign: "right", padding: "10px 0 6px", borderTop: "1px solid #eee" }}>{fmtMoney(omCost)}</td>
                    <td style={{ fontFamily: F.mono, fontSize: T.sm, color: "#bbb", textAlign: "right", padding: "10px 0 6px", borderTop: "1px solid #eee", textDecoration: "line-through" }}>{fmtMoney(compCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Unit price grid */}
            <div style={{ padding: "16px 24px" }}>
              <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>UNIT PRICE (per 1M tokens)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "INPUT",  om: `$${selectedModel.input}`, comp: `$${selectedComp.input}` },
                  { label: "OUTPUT", om: `$${selectedModel.output}`, comp: `$${selectedComp.output}` },
                  { label: "RATIO",  ratio: selectedComp.input > selectedModel.input ? `${(selectedComp.input / selectedModel.input).toFixed(1)}×` : "—" },
                ].map((item) => (
                  <div key={item.label} style={{ border: "1px solid #eee", padding: "10px 12px" }}>
                    <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 6 }}>{item.label}</div>
                    {item.ratio !== undefined ? (
                      <div style={{ fontFamily: F.mono, fontSize: T.num, fontWeight: 600, color: "#0047FF" }}>{item.ratio}</div>
                    ) : (
                      <>
                        <div style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 600, color: "#111" }}>{item.om}</div>
                        <div style={{ fontFamily: F.mono, fontSize: T.xs, color: "#ccc", marginTop: 2, textDecoration: "line-through" }}>{item.comp}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .calc-grid { grid-template-columns: 1fr !important; }
          .calc-grid > *:first-child { border-right: none !important; border-bottom: 1px solid #e2e2e2; }
        }
        @media (max-width: 480px) {
          .calc-header { padding: 24px 16px 18px !important; }
          .calc-panel { padding: 16px !important; }
          .calc-unit-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
