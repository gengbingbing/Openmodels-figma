import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Home, Store, Cpu, CreditCard, Search, Eye, Settings, ChevronLeft, X, Check, Plus, Trash2, ExternalLink, BarChart2, DollarSign, Zap, Copy } from "lucide-react";
import { F, D } from "../lib/type";
import { allModels } from "../lib/models-data";

const B  = "1px solid #E5E5E5";
const Bs = "1px solid #EFEFEF";
const blue = "#0047FF";

/* ─── Types ──────────────────────────────────────────────── */
type PartnerPage = "overview" | "storefront" | "models" | "plan" | "seo" | "preview" | "usage" | "payouts" | "quickstart" | "settings";
type PlanStatus  = "" | "launch" | "growth" | "scale";

interface MarketplaceModel {
  modelId:         string;
  provider:        string;
  providerSupply:  string;
  providerLatency: string;
  baseInput:       number;
  baseOutput:      number;
  markup:          string;
  finalInput:      number;
  finalOutput:     number;
}

interface PartnerState {
  name:        string;
  email:       string;
  telegram:    string;
  discord:     string;
  whatsapp:    string;
  wechat:      string;
  desc:        string;
  slug:        string;
  seoTitle:    string;
  seoDesc:     string;
  marketplaceModels: MarketplaceModel[];
  plan:        PlanStatus;
  status:      "draft" | "live";
  brandColor:  string;
}

const PLAN_DATA = [
  { id: "launch" as PlanStatus, label: "Launch", price: 29,  modelLimit: 10,  features: ["Up to 10 models", "Hosted marketplace page", "Basic SEO settings", "Auto pricing markup", "Usage dashboard"], recommended: false },
  { id: "growth" as PlanStatus, label: "Growth", price: 99,  modelLimit: 50,  features: ["Up to 50 models", "Custom domain", "Advanced SEO settings", "Custom pricing rules", "Partner analytics"],  recommended: true  },
  { id: "scale"  as PlanStatus, label: "Scale",  price: 299, modelLimit: 200, features: ["Up to 200 models", "Custom domain", "Bulk pricing", "Route controls", "Priority support"],                  recommended: false },
];

/* Provider routes per model (simplified) */
const MODEL_PROVIDERS: Record<string, { name: string; supply: "Direct" | "Verified" | "Limited"; latency: string; input: number; output: number }[]> = {
  "llama-3.1-70b":      [{ name: "Together AI", supply: "Direct",   latency: "760ms",  input: 0.38, output: 0.65 }, { name: "Groq",       supply: "Verified", latency: "320ms",  input: 0.40, output: 0.70 }],
  "llama-3.1-8b":       [{ name: "Groq",        supply: "Direct",   latency: "180ms",  input: 0.05, output: 0.10 }, { name: "Together AI",supply: "Verified", latency: "340ms",  input: 0.06, output: 0.12 }],
  "deepseek-v3":        [{ name: "DeepSeek",    supply: "Direct",   latency: "910ms",  input: 0.28, output: 0.55 }, { name: "Fireworks",  supply: "Verified", latency: "720ms",  input: 0.31, output: 0.58 }],
  "deepseek-r1":        [{ name: "DeepSeek",    supply: "Direct",   latency: "1240ms", input: 0.50, output: 1.20 }, { name: "Fireworks",  supply: "Verified", latency: "1080ms", input: 0.55, output: 1.28 }],
  "qwen-2.5-72b":       [{ name: "Novita",      supply: "Verified", latency: "780ms",  input: 0.32, output: 0.58 }, { name: "Alibaba",    supply: "Direct",   latency: "540ms",  input: 0.35, output: 0.60 }],
  "qwen-2.5-coder-32b": [{ name: "Novita",      supply: "Verified", latency: "560ms",  input: 0.18, output: 0.38 }, { name: "Alibaba",    supply: "Direct",   latency: "420ms",  input: 0.20, output: 0.40 }],
  "mistral-large":      [{ name: "Fireworks",   supply: "Verified", latency: "760ms",  input: 0.42, output: 0.76 }, { name: "Mistral",    supply: "Direct",   latency: "880ms",  input: 0.45, output: 0.80 }],
  "mistral-7b":         [{ name: "Groq",        supply: "Verified", latency: "180ms",  input: 0.04, output: 0.08 }, { name: "Mistral",    supply: "Direct",   latency: "280ms",  input: 0.04, output: 0.08 }],
  "minimax-m2.7":       [{ name: "Novita",      supply: "Verified", latency: "820ms",  input: 2.00, output: 8.00 }, { name: "MiniMax",    supply: "Direct",   latency: "640ms",  input: 2.10, output: 8.40 }],
};

/* ─── Shared helpers ─────────────────────────────────────── */
const inputSt: React.CSSProperties = { width: "100%", height: 34, padding: "0 10px", fontFamily: F.sans, fontSize: D.body, color: "#111", background: "#fff", border: B, borderRadius: 6, outline: "none", boxSizing: "border-box" };
const textareaSt: React.CSSProperties = { width: "100%", padding: "8px 10px", fontFamily: F.sans, fontSize: D.body, color: "#111", background: "#fff", border: B, borderRadius: 6, outline: "none", boxSizing: "border-box", resize: "vertical" as const, lineHeight: 1.5 };

function SL({ label }: { label: string }) {
  return <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "9px 20px 7px", borderBottom: Bs, background: "#F7F7F7" }}>{label}</div>;
}
function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", letterSpacing: "0.04em", marginBottom: 5 }}>
        {label.toUpperCase()}{required && <span style={{ color: "#DC2626", marginLeft: 2 }}>*</span>}
      </div>
      {children}
      {hint && <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function calcFinal(base: number, markup: string): number {
  const pct = parseFloat(markup) || 0;
  return parseFloat((base * (1 + pct / 100)).toFixed(4));
}

/* ─── Add Model Drawer ───────────────────────────────────── */
function AddModelDrawer({ plan, onAdd, onClose }: { plan: PlanStatus; onAdd: (m: MarketplaceModel) => void; onClose: () => void }) {
  const [step,           setStep]           = useState<1 | 2 | 3>(1);
  const [selectedModel,  setSelectedModel]  = useState("");
  const [routeTab,       setRouteTab]       = useState<"verified" | "community">("verified");
  const [selectedRoute,  setSelectedRoute]  = useState<{ name: string; supply: string; latency: string; input: number; output: number } | null>(null);
  const [markup,         setMarkup]         = useState("20");
  const [customIn,       setCustomIn]       = useState("");
  const [customOut,      setCustomOut]      = useState("");
  const [search,         setSearch]         = useState("");

  const canCustom = true; /* custom is always available; plan check at publish time */
  const filtered  = allModels.filter((m) => !search || m.id.toLowerCase().includes(search.toLowerCase()));
  const routes    = selectedModel ? (MODEL_PROVIDER_ROUTES[selectedModel] ?? []) : [];
  const verifiedRoutes   = routes.filter((r) => r.supply !== "Community");
  const communityRoutes  = routes.filter((r) => r.supply === "Community");
  const displayRoutes    = routeTab === "verified" ? verifiedRoutes : communityRoutes;

  const baseIn  = selectedRoute?.input  ?? 0;
  const baseOut = selectedRoute?.output ?? 0;
  const finalIn  = markup === "custom" ? parseFloat(customIn)  || baseIn  : calcFinal(baseIn,  markup);
  const finalOut = markup === "custom" ? parseFloat(customOut) || baseOut : calcFinal(baseOut, markup);

  const customInValid  = markup !== "custom" || (customIn  !== "" && parseFloat(customIn)  >= baseIn);
  const customOutValid = markup !== "custom" || (customOut !== "" && parseFloat(customOut) >= baseOut);
  const canAdd = !!(selectedModel && selectedRoute && customInValid && customOutValid);

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ modelId: selectedModel, provider: selectedRoute!.name, providerSupply: selectedRoute!.supply, providerLatency: selectedRoute!.latency, baseInput: baseIn, baseOutput: baseOut, markup, finalInput: finalIn, finalOutput: finalOut });
  };

  const supplyColor = (s: string) => s === "Direct" ? "#15803D" : s === "Verified" ? "#2563EB" : "#A3A3A3";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.18)" }} />
      <div style={{ width: 560, background: "#fff", borderLeft: B, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111" }}>Add model</div>
            <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginTop: 2 }}>
              Step {step} of 3 — {step === 1 ? "Select model" : step === 2 ? "Select provider route" : "Set price"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0C0C0", padding: 4, transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#555")} onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}>
            <X size={14} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", borderBottom: B }}>
          {["Select model", "Provider route", "Set price"].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "8px 14px", fontFamily: F.sans, fontSize: D.label, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? blue : step > i + 1 ? "#15803D" : "#A3A3A3", borderBottom: `2px solid ${step === i + 1 ? blue : step > i + 1 ? "#16A34A" : "transparent"}`, textAlign: "center", background: step === i + 1 ? "#FAFAFA" : "transparent" }}>
              {step > i + 1 ? "✓ " : ""}{s}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Step 1: Select model */}
          {step === 1 && (
            <div>
              <div style={{ padding: "12px 20px", borderBottom: Bs }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search models…" style={{ ...inputSt, height: 32 }} />
              </div>
              {filtered.map((m, i) => (
                <div key={m.id} onClick={() => setSelectedModel(m.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 20px", borderBottom: i < filtered.length - 1 ? Bs : "none", background: selectedModel === m.id ? "#F5F8FF" : "transparent", cursor: "pointer", transition: "background 80ms" }}
                  onMouseEnter={(e) => { if (selectedModel !== m.id) e.currentTarget.style.background = "#FAFAFA"; }}
                  onMouseLeave={(e) => { if (selectedModel !== m.id) e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${selectedModel === m.id ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selectedModel === m.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: blue }} />}
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#111" }}>{m.id}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontFamily: F.sans, fontSize: D.label, color: "#888" }}>
                    <span>{m.context}</span>
                    <span>{(MODEL_PROVIDERS[m.id] ?? []).length} routes</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Provider route */}
          {step === 2 && (
            <div>
              <div style={{ display: "flex", borderBottom: B }}>
                {(["verified", "community"] as const).map((t) => (
                  <button key={t} onClick={() => setRouteTab(t)} style={{ flex: 1, padding: "10px", fontFamily: F.sans, fontSize: D.body, fontWeight: routeTab === t ? 600 : 400, color: routeTab === t ? "#111" : "#888", background: "none", border: "none", borderBottom: `2px solid ${routeTab === t ? "#111" : "transparent"}`, cursor: "pointer", marginBottom: -1, textTransform: "capitalize" as const }}>
                    {t}
                  </button>
                ))}
              </div>
              {routeTab === "community" && (
                <div style={{ padding: "10px 20px", background: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}>
                  <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#92400E" }}>Community routes may be cheaper but are not reviewed for production reliability.</span>
                </div>
              )}
              {displayRoutes.length === 0 ? (
                <div style={{ padding: "32px 20px", textAlign: "center", fontFamily: F.sans, fontSize: D.body, color: "#A3A3A3" }}>No {routeTab} routes available for this model.</div>
              ) : displayRoutes.map((r, i) => {
                const sel = selectedRoute?.name === r.name;
                return (
                  <div key={r.name} onClick={() => setSelectedRoute(r)} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 68px 60px", padding: "12px 20px", borderBottom: i < displayRoutes.length - 1 ? Bs : "none", alignItems: "center", background: sel ? "#F5F8FF" : "transparent", cursor: "pointer", transition: "background 80ms" }}
                    onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "#FAFAFA"; }}
                    onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
                    <div>
                      <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111" }}>{r.name}</div>
                      <div style={{ fontFamily: F.sans, fontSize: D.label, color: supplyColor(r.supply) }}>{r.supply} · {r.latency}</div>
                    </div>
                    <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111", textAlign: "right" }}>${r.input.toFixed(2)}</span>
                    <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555", textAlign: "right" }}>${r.output.toFixed(2)}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 10, color: "#15803D" }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A" }} />Live
                    </span>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${sel ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {sel && <span style={{ width: 6, height: 6, borderRadius: "50%", background: blue }} />}
                      </span>
                    </div>
                  </div>
                );
              })}
              {!selectedRoute && verifiedRoutes.length > 0 && routeTab === "verified" && (
                <div style={{ padding: "10px 20px", borderTop: Bs }}>
                  <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Default: lowest verified route is selected automatically if none chosen.</span>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Set price */}
          {step === 3 && selectedRoute && (
            <div style={{ padding: "20px" }}>
              {/* Base prices */}
              <div style={{ border: B, borderRadius: 6, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "10px 14px", background: "#FAFAFA", borderBottom: Bs }}>
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginBottom: 3 }}>BASE INPUT / 1M</div>
                    <div style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111" }}>${baseIn.toFixed(4)}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginBottom: 3 }}>BASE OUTPUT / 1M</div>
                    <div style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111" }}>${baseOut.toFixed(4)}</div>
                  </div>
                </div>
                <div style={{ padding: "8px 14px" }}>
                  <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>Provider: {selectedRoute.name} · {selectedRoute.supply}</span>
                </div>
              </div>

              {/* Markup */}
              <Field label="Markup">
                <div style={{ display: "flex", gap: 6 }}>
                  {["10", "20", "30"].map((v) => (
                    <button key={v} onClick={() => setMarkup(v)} style={{ height: 32, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: markup === v ? 600 : 400, color: markup === v ? "#fff" : "#555", background: markup === v ? "#111" : "#F5F5F5", border: `1px solid ${markup === v ? "#111" : "#E5E5E5"}`, borderRadius: 6, cursor: "pointer", transition: "all 100ms" }}>{v}%</button>
                  ))}
                  <button onClick={() => setMarkup("custom")} style={{ height: 32, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: markup === "custom" ? 600 : 400, color: markup === "custom" ? "#fff" : "#555", background: markup === "custom" ? "#111" : "#F5F5F5", border: `1px solid ${markup === "custom" ? "#111" : "#E5E5E5"}`, borderRadius: 6, cursor: "pointer", transition: "all 100ms" }}>Custom</button>
                </div>
              </Field>

              {markup === "custom" && (() => {
                const parsedIn  = parseFloat(customIn);
                const parsedOut = parseFloat(customOut);
                const badIn     = customIn  !== "" && !isNaN(parsedIn)  && parsedIn  < baseIn;
                const badOut    = customOut !== "" && !isNaN(parsedOut) && parsedOut < baseOut;
                const estMarkupIn  = customIn  && !isNaN(parsedIn)  && parsedIn  > 0 ? `${((parsedIn  / baseIn  - 1) * 100).toFixed(1)}%` : "—";
                return (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", letterSpacing: "0.04em", marginBottom: 5 }}>FINAL INPUT / 1M</div>
                        <input value={customIn} onChange={(e) => setCustomIn(e.target.value)} placeholder={`${calcFinal(baseIn, "20").toFixed(4)}`} style={{ ...inputSt, border: badIn ? "1px solid #DC2626" : B }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", letterSpacing: "0.04em", marginBottom: 5 }}>FINAL OUTPUT / 1M</div>
                        <input value={customOut} onChange={(e) => setCustomOut(e.target.value)} placeholder={`${calcFinal(baseOut, "20").toFixed(4)}`} style={{ ...inputSt, border: badOut ? "1px solid #DC2626" : B }} />
                      </div>
                    </div>
                    {(badIn || badOut) && (
                      <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#DC2626", marginBottom: 8 }}>Final price must be equal to or higher than the base route price.</div>
                    )}
                    <div style={{ background: "#FAFAFA", border: Bs, borderRadius: 6, padding: "10px 12px", fontFamily: F.sans, fontSize: D.label, color: "#888", lineHeight: 1.7 }}>
                      <div>Base price: <span style={{ fontFamily: F.mono, color: "#555" }}>${baseIn.toFixed(4)} input · ${baseOut.toFixed(4)} output</span></div>
                      <div>Your price: <span style={{ fontFamily: F.mono, color: "#111" }}>{customIn || "—"} input · {customOut || "—"} output</span></div>
                      <div>Estimated markup: <span style={{ fontFamily: F.mono, color: "#555" }}>{estMarkupIn}</span></div>
                    </div>
                    <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 6 }}>Custom pricing may require a paid partner plan before publishing.</div>
                  </div>
                );
              })()}

              {/* Result summary — shown for % markups */}
              {markup !== "custom" && (
              <div style={{ border: B, borderRadius: 6, overflow: "hidden" }}>
                {[
                  { label: "Base price",        input: baseIn,  output: baseOut,  muted: true  },
                  { label: `Your price (+${markup}%)`, input: finalIn, output: finalOut, muted: false },
                  { label: "Est. margin / 1M",  input: parseFloat((finalIn - baseIn).toFixed(4)), output: parseFloat((finalOut - baseOut).toFixed(4)), muted: false, green: true },
                ].map((r, i, arr) => (
                  <div key={r.label} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px", padding: "10px 14px", borderBottom: i < arr.length - 1 ? Bs : "none", alignItems: "center" }}>
                    <span style={{ fontFamily: F.sans, fontSize: D.label, color: r.muted ? "#A3A3A3" : "#333" }}>{r.label}</span>
                    <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: r.muted ? 400 : 600, color: r.green ? "#15803D" : (r.muted ? "#AAAAAA" : "#111"), textAlign: "right" }}>${r.input.toFixed(4)}</span>
                    <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: r.muted ? 400 : 600, color: r.green ? "#15803D" : (r.muted ? "#AAAAAA" : "#111"), textAlign: "right" }}>${r.output.toFixed(4)}</span>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: B, display: "flex", gap: 8 }}>
          {step > 1 && <button onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} style={{ height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, color: "#555", background: "#fff", border: B, borderRadius: 6, cursor: "pointer" }}>Back</button>}
          {step < 3 && (
            <button onClick={() => { if (step === 1 && !selectedModel) return; if (step === 2 && !selectedRoute) { setSelectedRoute(displayRoutes[0] ?? null); } setStep((s) => (s + 1) as 2 | 3); }} style={{ flex: 1, height: 34, fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: blue, border: "none", borderRadius: 6, cursor: "pointer", opacity: (step === 1 && !selectedModel) ? 0.5 : 1 }}>
              Continue
            </button>
          )}
          {step === 3 && (
            <button onClick={handleAdd} disabled={!canAdd} style={{ flex: 1, height: 34, fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: canAdd ? "#111" : "#D0D0D0", border: "none", borderRadius: 6, cursor: canAdd ? "pointer" : "not-allowed", transition: "opacity 120ms" }}
              onMouseEnter={(e) => { if (canAdd) e.currentTarget.style.opacity = "0.82"; }}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Add to marketplace</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Publish Modal ──────────────────────────────────────── */
function PublishModal({ state, onClose, onConfirm }: { state: PartnerState; onClose: () => void; onConfirm: (plan: PlanStatus) => void }) {
  const [sel, setSel] = useState<PlanStatus>(state.plan || "growth");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", border: B, borderRadius: 8, maxWidth: 520, width: "100%", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: B, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 3 }}>Choose a partner plan to publish</div>
            <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#666" }}>Your marketplace is ready. Select a plan to publish it live.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0C0C0", padding: 4, flexShrink: 0 }}><X size={14} /></button>
        </div>
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {PLAN_DATA.map((p) => (
            <button key={p.id} onClick={() => setSel(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: sel === p.id ? "#F5F8FF" : "#FAFAFA", border: `1px solid ${sel === p.id ? blue : "#E5E5E5"}`, borderRadius: 6, cursor: "pointer", textAlign: "left", transition: "all 100ms" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${sel === p.id ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {sel === p.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: blue }} />}
                </span>
                <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111" }}>{p.label}</span>
                <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>Up to {p.modelLimit} models</span>
                {p.recommended && <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 7px", borderRadius: 999 }}>Recommended</span>}
              </div>
              <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111", flexShrink: 0 }}>${p.price}/mo</span>
            </button>
          ))}
        </div>
        <div style={{ padding: "12px 24px 20px", borderTop: Bs, display: "flex", gap: 8 }}>
          <button onClick={() => onConfirm(sel)} style={{ flex: 1, height: 36, fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: blue, border: "none", borderRadius: 6, cursor: "pointer" }}>Continue to payment</button>
          <button onClick={onClose} style={{ height: 36, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, background: "#fff", color: "#555", border: B, borderRadius: 6, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page components ────────────────────────────────────── */
function OverviewPage({ state, setPage, openPlanModal }: { state: PartnerState; setPage: (p: PartnerPage) => void; openPlanModal: () => void }) {
  const steps = [
    { n: 1, label: "Storefront", desc: "Add marketplace name, description, and support email.", done: !!(state.name && state.email), page: "storefront" as PartnerPage },
    { n: 2, label: "Models",     desc: "Choose models, select provider routes, and set pricing.", done: state.marketplaceModels.length > 0, page: "models" as PartnerPage },
    { n: 3, label: "SEO",        desc: "Add page title, meta description, and slug.", done: !!(state.seoTitle && state.seoDesc && state.slug), page: "seo" as PartnerPage },
    { n: 4, label: "Preview",    desc: "Review your marketplace before publishing.", done: false, page: "preview" as PartnerPage },
    { n: 5, label: "Publish",    desc: "Choose a partner plan, pay, and launch.", done: state.status === "live", page: "preview" as PartnerPage },
  ];
  const partnerId = state.slug || "your-partner-id";
  const [pidCopied, setPidCopied] = useState(false);
  const copyPid = () => { navigator.clipboard.writeText(partnerId).catch(() => {}); setPidCopied(true); setTimeout(() => setPidCopied(false), 1600); };

  return (
    <div>
      {/* ── Partner stats ── */}
      <div style={{ display: "flex", borderBottom: B }}>
        {/* Partner ID cell */}
        <div style={{ padding: "16px 20px", borderRight: Bs, minWidth: 180 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em", marginBottom: 5 }}>PARTNER ID</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111" }}>{partnerId}</span>
            <button onClick={copyPid} title="Copy partner ID" style={{ background: "none", border: "none", cursor: "pointer", color: pidCopied ? "#16A34A" : "#C0C0C0", padding: 2, display: "flex", transition: "color 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#555")} onMouseLeave={(e) => (e.currentTarget.style.color = pidCopied ? "#16A34A" : "#C0C0C0")}>
              {pidCopied ? <Check size={11} /> : <Copy size={11} />}
            </button>
          </div>
        </div>
        <div style={{ padding: "16px 20px", borderRight: Bs, flex: 1 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em", marginBottom: 5 }}>REFERRED USERS</div>
          <div style={{ fontFamily: F.mono, fontSize: 20, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.04em" }}>24</div>
        </div>
        <div style={{ padding: "16px 20px", borderRight: Bs, flex: 1 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em", marginBottom: 5 }}>USAGE VOLUME</div>
          <div style={{ fontFamily: F.mono, fontSize: 20, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.04em" }}>11.4B</div>
          <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 2 }}>tokens this month</div>
        </div>
        <div style={{ padding: "16px 20px", flex: 1 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em", marginBottom: 5 }}>ESTIMATED PAYOUT</div>
          <div style={{ fontFamily: F.mono, fontSize: 20, fontWeight: 700, color: blue, letterSpacing: "-0.04em" }}>$48.20</div>
          <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 2 }}>pending this month</div>
        </div>
      </div>

    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 6 }}>Create your partner marketplace</h1>
          <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 460 }}>Configure your storefront, model catalog, and SEO. Choose a plan only when you are ready to publish.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: B, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
            {steps.map((s, i) => (
              <button key={s.n} onClick={() => setPage(s.page)} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 16px", background: "transparent", border: "none", borderBottom: i < steps.length - 1 ? Bs : "none", cursor: "pointer", textAlign: "left", transition: "background 80ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: s.done ? "#16A34A" : "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {s.done ? <Check size={11} color="#fff" strokeWidth={2.5} /> : <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#A3A3A3" }}>{s.n}</span>}
                </span>
                <div>
                  <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111", marginBottom: 1 }}>{s.label}</div>
                  <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>{s.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setPage("storefront")} style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer" }}>Continue setup</button>
        </div>
        {/* Summary */}
        <div style={{ width: 210, border: B, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "9px 14px", background: "#FAFAFA", borderBottom: Bs }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em" }}>SUMMARY</span>
          </div>
          {[
            { label: "Status",  value: state.status === "live" ? "Live" : "Draft", color: state.status === "live" ? "#15803D" : "#888" },
            { label: "Models",  value: String(state.marketplaceModels.length), color: "#333" },
            { label: "SEO",     value: (state.seoTitle && state.seoDesc) ? "Complete" : "Missing", color: (state.seoTitle && state.seoDesc) ? "#15803D" : "#C0C0C0" },
          ].map((r, i, arr) => (
            <div key={r.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "9px 14px", borderBottom: Bs, alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>{r.label}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: r.color, textAlign: "right" }}>{r.value}</span>
            </div>
          ))}
          <div style={{ padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Plan</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: state.plan ? "#333" : "#C0C0C0" }}>{state.plan ? state.plan.charAt(0).toUpperCase() + state.plan.slice(1) : "None"}</span>
              <button onClick={openPlanModal} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.sans, fontSize: D.label, color: blue, padding: 0, fontWeight: 500 }}>{state.plan ? "Change →" : "Choose →"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function StorefrontPage({ state, setState }: { state: PartnerState; setState: (s: Partial<PartnerState>) => void }) {
  return (
    <div style={{ padding: "28px 32px", maxWidth: 540 }}>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>Storefront</h2>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 20 }}>This information appears on your partner marketplace page.</p>

      <Field label="Marketplace name" required>
        <input value={state.name} onChange={(e) => setState({ name: e.target.value })} placeholder="My LLM Marketplace" style={inputSt} />
      </Field>
      <Field label="Short description" required>
        <textarea value={state.desc} onChange={(e) => setState({ desc: e.target.value })} placeholder="What your marketplace offers." style={{ ...textareaSt, height: 72 }} />
      </Field>

      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 12, marginTop: 4 }}>CONTACT</div>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#A3A3A3", marginBottom: 16, marginTop: -8 }}>Fill in any channels you want shown on your public page. Empty fields are hidden.</p>

      <Field label="Email">
        <input value={state.email} onChange={(e) => setState({ email: e.target.value })} placeholder="support@example.com" type="email" style={inputSt} />
      </Field>
      <Field label="Telegram" hint="e.g. t.me/yourhandle or @yourhandle">
        <input value={state.telegram} onChange={(e) => setState({ telegram: e.target.value })} placeholder="@yourhandle" style={inputSt} />
      </Field>
      <Field label="Discord" hint="e.g. discord.gg/yourserver">
        <input value={state.discord} onChange={(e) => setState({ discord: e.target.value })} placeholder="discord.gg/yourserver" style={inputSt} />
      </Field>
      <Field label="WhatsApp" hint="e.g. wa.me/+1234567890">
        <input value={state.whatsapp} onChange={(e) => setState({ whatsapp: e.target.value })} placeholder="wa.me/+1234567890" style={inputSt} />
      </Field>
      <Field label="WeChat" hint="WeChat ID shown as plain text">
        <input value={state.wechat} onChange={(e) => setState({ wechat: e.target.value })} placeholder="yourWeChatID" style={inputSt} />
      </Field>

      <button style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer" }}>Save changes</button>
    </div>
  );
}

function ModelsPage({ state, setState, plan }: { state: PartnerState; setState: (s: Partial<PartnerState>) => void; plan: PlanStatus }) {
  const [drawer, setDrawer] = useState(false);
  const planLimit = PLAN_DATA.find((p) => p.id === plan)?.modelLimit ?? 999;

  const removeModel = (modelId: string) => setState({ marketplaceModels: state.marketplaceModels.filter((m) => m.modelId !== modelId) });

  const addModel = (m: MarketplaceModel) => {
    setState({ marketplaceModels: [...state.marketplaceModels.filter((x) => x.modelId !== m.modelId), m] });
    setDrawer(false);
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 3 }}>MODELS</span>
          <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 3 }}>Add models to your marketplace</h2>
          <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", margin: 0 }}>Choose models, select provider routes, and set your final token price.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {plan && <span style={{ fontFamily: F.sans, fontSize: D.label, color: state.marketplaceModels.length >= planLimit ? "#B45309" : "#888", background: "#F5F5F5", border: Bs, borderRadius: 4, padding: "3px 10px" }}>{state.marketplaceModels.length} / {planLimit}</span>}
          <button onClick={() => setDrawer(true)} style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer" }}>
            <Plus size={13} />Add model
          </button>
        </div>
      </div>

      {state.marketplaceModels.length === 0 ? (
        <div style={{ border: B, borderRadius: 8, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#A3A3A3", marginBottom: 12 }}>No models added yet.</div>
          <button onClick={() => setDrawer(true)} style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Add your first model →</button>
        </div>
      ) : (
        <div style={{ border: B, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 60px 90px 90px 60px 40px", padding: "9px 16px", background: "#F7F7F7", borderBottom: Bs }}>
            {["Model", "Route", "Base in", "Base out", "Markup", "Final in", "Final out", "Status", ""].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#BBBBBB", letterSpacing: "0.04em" }}>{h.toUpperCase()}</span>
            ))}
          </div>
          {state.marketplaceModels.map((m, i) => (
            <div key={m.modelId} style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 60px 90px 90px 60px 40px", padding: "0 16px", minHeight: 52, borderBottom: i < state.marketplaceModels.length - 1 ? Bs : "none", alignItems: "center" }}>
              <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.modelId}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.provider}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#AAAAAA", textAlign: "right" }}>${m.baseInput.toFixed(2)}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#AAAAAA", textAlign: "right" }}>${m.baseOutput.toFixed(2)}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#555", textAlign: "right" }}>{m.markup === "custom" ? "Custom" : `${m.markup}%`}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.label, fontWeight: 600, color: "#111", textAlign: "right" }}>${m.finalInput.toFixed(4)}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#555", textAlign: "right" }}>${m.finalOutput.toFixed(4)}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 10, color: "#15803D" }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A" }} />Live
              </span>
              <button onClick={() => removeModel(m.modelId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D0D0D0", padding: 4, display: "flex", transition: "color 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")} onMouseLeave={(e) => (e.currentTarget.style.color = "#D0D0D0")}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {drawer && <AddModelDrawer plan={plan} onAdd={addModel} onClose={() => setDrawer(false)} />}
    </div>
  );
}

function PlanPage({ state, openPlanModal }: { state: PartnerState; openPlanModal: () => void }) {
  const current = PLAN_DATA.find((p) => p.id === state.plan);
  return (
    <div style={{ padding: "28px 32px" }}>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>Choose a plan to publish</h2>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 24 }}>Configure your marketplace first. Choose a plan when you are ready to publish.</p>
      {current && (
        <div style={{ border: "1px solid #BBF7D0", borderRadius: 8, background: "#F0FDF4", padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#15803D", fontWeight: 500 }}>Current plan: {current.label} — ${current.price}/mo</span>
          <button onClick={openPlanModal} style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Change plan →</button>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: B, borderRadius: 8, overflow: "hidden" }}>
        {PLAN_DATA.map((p, idx) => (
          <div key={p.id} style={{ borderRight: idx < PLAN_DATA.length - 1 ? Bs : "none", padding: "20px 20px 16px", position: "relative" }}>
            {p.recommended && <div style={{ height: 3, background: blue, position: "absolute", top: 0, left: 0, right: 0 }} />}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>{p.label.toUpperCase()}</span>
              {p.recommended && <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 7px", borderRadius: 999 }}>Recommended</span>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontFamily: F.sans, fontSize: 24, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.03em" }}>${p.price}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginLeft: 3 }}>/month</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
              {p.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Check size={11} style={{ color: "#16A34A", flexShrink: 0 }} strokeWidth={2.5} />
                  <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#555" }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={openPlanModal} style={{ width: "100%", height: 32, fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: state.plan === p.id ? "#16A34A" : (p.recommended ? blue : "#111"), border: "none", borderRadius: 6, cursor: "pointer" }}>
              {state.plan === p.id ? "Current plan" : `Select ${p.label}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SEOPage({ state, setState }: { state: PartnerState; setState: (s: Partial<PartnerState>) => void }) {
  return (
    <div style={{ padding: "28px 32px", maxWidth: 540 }}>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>SEO</h2>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 20 }}>SEO settings help your marketplace and model pages appear in search results.</p>
      <Field label="Page title" required><input value={state.seoTitle} onChange={(e) => setState({ seoTitle: e.target.value })} placeholder={`${state.name || "My Marketplace"} | LLM Token Marketplace`} style={inputSt} /></Field>
      <Field label="Slug" required hint={`openmodels.market/p/${state.slug || "your-slug"}`}>
        <input value={state.slug} onChange={(e) => setState({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} placeholder="my-marketplace" style={inputSt} />
      </Field>
      <Field label="Meta description" required><textarea value={state.seoDesc} onChange={(e) => setState({ seoDesc: e.target.value })} placeholder="A brief description for search engines." style={{ ...textareaSt, height: 64 }} /></Field>
      {state.seoTitle && (
        <div style={{ border: Bs, borderRadius: 6, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginBottom: 8 }}>GOOGLE PREVIEW</div>
          <div style={{ fontFamily: F.sans, fontSize: 14, color: "#1a0dab", marginBottom: 2 }}>{state.seoTitle}</div>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: "#006621", marginBottom: 2 }}>openmodels.market/p/{state.slug || "your-slug"}</div>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: "#545454" }}>{state.seoDesc || "Add a meta description."}</div>
        </div>
      )}
      <button style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer" }}>Save changes</button>
    </div>
  );
}

function PreviewPage({ state, onPublish }: { state: PartnerState; onPublish: () => void }) {
  const ready = !!(state.name && state.email && state.marketplaceModels.length > 0 && state.seoTitle && state.seoDesc && state.slug);
  const previewSlug = state.slug || "acme-ai";
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111" }}>Preview</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!ready && <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#B45309" }}>Complete required setup before publishing.</span>}
          <a href={`/p/${previewSlug}`} target="_blank" rel="noopener noreferrer"
            style={{ height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#444", background: "#fff", border: B, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", transition: "border-color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#B0B0B0")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
          ><ExternalLink size={12} strokeWidth={1.5} />Open preview</a>
          <button onClick={ready ? onPublish : undefined} disabled={!ready} style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: ready ? "#111" : "#D0D0D0", border: "none", borderRadius: 6, cursor: ready ? "pointer" : "not-allowed" }}>Publish</button>
        </div>
      </div>
      <div style={{ border: B, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "24px", background: "#FAFAFA", borderBottom: B }}>
          <div style={{ fontFamily: F.sans, fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>{state.name || "Your marketplace name"}</div>
          <div style={{ fontFamily: F.sans, fontSize: 13, color: "#666" }}>{state.desc || "Your marketplace description."}</div>
        </div>
        <div style={{ padding: "16px 24px", borderBottom: B }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>MODELS ({state.marketplaceModels.length})</div>
          {state.marketplaceModels.length === 0 ? (
            <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#C0C0C0" }}>No models added yet.</div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {state.marketplaceModels.slice(0, 8).map((m) => (
                <span key={m.modelId} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#555", background: "#F0F0F0", padding: "3px 8px", borderRadius: 4 }}>{m.modelId}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0" }}>Powered by OpenModels</span>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ state, setState, openPlanModal }: { state: PartnerState; setState: (s: Partial<PartnerState>) => void; openPlanModal: () => void }) {
  const planLabel = state.plan ? state.plan.charAt(0).toUpperCase() + state.plan.slice(1) : "Not selected";
  return (
    <div style={{ padding: "28px 32px", maxWidth: 540 }}>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 24 }}>Settings</h2>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 10, textTransform: "uppercase" as const }}>Plan & Billing</div>
        <div style={{ border: B, borderRadius: 8, overflow: "hidden" }}>
          {[{ label: "Current plan", value: planLabel, accent: !!state.plan }, { label: "Billing status", value: state.status === "live" ? "Active" : "Draft", accent: false }].map((r, i, arr) => (
            <div key={r.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "12px 16px", borderBottom: i < arr.length - 1 ? Bs : "none", alignItems: "center" }}>
              <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{r.label}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.body, color: r.accent ? "#111" : "#888", fontWeight: r.accent ? 500 : 400 }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "12px 16px", alignItems: "center" }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>Actions</span>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={openPlanModal} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: blue, padding: 0 }}>{state.plan ? "Change plan" : "Choose plan"}</button>
              {state.plan && <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.sans, fontSize: D.body, color: "#A3A3A3", padding: 0, transition: "color 100ms" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")} onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}>Cancel plan</button>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 10, textTransform: "uppercase" as const }}>Marketplace URL</div>
        <div style={{ border: B, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "12px 16px", alignItems: "center" }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>Public URL</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{state.slug ? `openmodels.market/p/${state.slug}` : "—"}</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: B, paddingTop: 20 }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10, textTransform: "uppercase" as const }}>Danger zone</div>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.sans, fontSize: D.body, color: "#A3A3A3", padding: 0, transition: "color 100ms" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")} onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}>Unpublish marketplace</button>
      </div>
    </div>
  );
}

/* ─── Usage ──────────────────────────────────────────────── */
function UsagePage({ state }: { state: PartnerState }) {
  const partnerId = state.slug || "your-partner-id";
  const rows = [
    { date: "2026-06-28", customer: "user_8k2m", key: "sk-om-••••x9k2", model: "deepseek-v3",   route: "DeepSeek / Direct",    req: 1240, tokens: "4.2M",  spend: "$1.43", pid: partnerId },
    { date: "2026-06-28", customer: "user_p4q7", key: "sk-om-••••p4m7", model: "llama-3.1-70b",  route: "Together AI / Direct", req: 880,  tokens: "3.1M",  spend: "$1.17", pid: partnerId },
    { date: "2026-06-27", customer: "user_8k2m", key: "sk-om-••••x9k2", model: "qwen-2.5-72b",   route: "Alibaba / Direct",     req: 640,  tokens: "2.4M",  spend: "$0.83", pid: partnerId },
    { date: "2026-06-27", customer: "user_n3r1", key: "sk-om-••••n3r1", model: "deepseek-v3",   route: "Fireworks / Verified",  req: 420,  tokens: "1.8M",  spend: "$0.56", pid: partnerId },
    { date: "2026-06-26", customer: "user_p4q7", key: "sk-om-••••p4m7", model: "mistral-large", route: "Fireworks / Verified",  req: 310,  tokens: "1.2M",  spend: "$0.49", pid: partnerId },
  ];
  return (
    <div>
      <div style={{ padding: "18px 28px 14px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 2 }}>USAGE</div>
        <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", margin: 0 }}>Partner-attributed usage</h2>
        <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#888", marginTop: 3 }}>
          Usage attributed to this partner through API requests carrying the partner ID.
        </p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "88px 90px 120px 1fr 130px 64px 64px 70px 90px", padding: "8px 28px", background: "#F7F7F7", borderBottom: Bs, minWidth: 900 }}>
          {["Date", "Customer", "API key", "Model", "Route", "Req", "Tokens", "Spend", "Partner ID"].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em" }}>{h.toUpperCase()}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "88px 90px 120px 1fr 130px 64px 64px 70px 90px", padding: "10px 28px", borderBottom: i < rows.length - 1 ? Bs : "none", alignItems: "center", minWidth: 900, transition: "background 80ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#B0B0B0" }}>{r.date}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#555" }}>{r.customer}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#888" }}>{r.key}</span>
            <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#111" }}>{r.model}</span>
            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#777" }}>{r.route}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555", fontVariantNumeric: "tabular-nums" }}>{r.req.toLocaleString()}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{r.tokens}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums" }}>{r.spend}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: blue }}>{r.pid}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Payouts ─────────────────────────────────────────────── */
function PayoutsPage() {
  const stats = [
    { label: "PENDING PAYOUT",      value: "$28.40" },
    { label: "PAID OUT",            value: "$0.00"  },
    { label: "THIS MONTH EARNINGS", value: "$48.20" },
    { label: "PAYOUT RATE",         value: "20%",   note: "of referred spend" },
  ];
  const rows = [
    { period: "Jun 2026", spend: "$241.00", commission: "$48.20", status: "pending",  paid: "—" },
    { period: "May 2026", spend: "$0.00",   commission: "$0.00",  status: "approved", paid: "—" },
  ];
  const statusStyle = (s: string) =>
    s === "paid"     ? { c: "#15803D", bg: "#F0FDF4", b: "#BBF7D0" } :
    s === "approved" ? { c: "#1D4ED8", bg: "#EFF6FF", b: "#BFDBFE" } :
                       { c: "#92400E", bg: "#FEF3C7", b: "#FDE68A" };
  return (
    <div>
      <div style={{ padding: "18px 28px 14px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 2 }}>PAYOUTS</div>
        <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", margin: 0 }}>Partner payouts</h2>
        <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#888", marginTop: 3 }}>Commissions are calculated monthly based on usage attributed to your partner ID.</p>
      </div>
      {/* Stats strip */}
      <div style={{ display: "flex", borderBottom: B }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: "16px 20px", borderRight: i < stats.length - 1 ? Bs : "none" }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: 20, fontWeight: 700, color: i === 0 ? blue : "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
            {s.note && <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 3 }}>{s.note}</div>}
          </div>
        ))}
      </div>
      {/* Payout history */}
      <div style={{ padding: "20px 28px" }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 12 }}>PAYOUT HISTORY</div>
        <div style={{ border: B, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 100px 120px", padding: "8px 16px", background: "#F7F7F7", borderBottom: Bs }}>
            {["Period", "Usage spend", "Commission", "Status", "Paid at"].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em" }}>{h.toUpperCase()}</span>
            ))}
          </div>
          {rows.map((r, i) => {
            const sc = statusStyle(r.status);
            return (
              <div key={r.period} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 100px 120px", padding: "11px 16px", borderBottom: i < rows.length - 1 ? Bs : "none", alignItems: "center" }}>
                <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{r.period}</span>
                <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{r.spend}</span>
                <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#111" }}>{r.commission}</span>
                <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: sc.c, background: sc.bg, border: `1px solid ${sc.b}`, borderRadius: 999, padding: "2px 8px", width: "fit-content" }}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
                <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#B0B0B0" }}>{r.paid}</span>
              </div>
            );
          })}
        </div>
        <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 12 }}>
          Payout method not configured. Contact OpenModels to set up monthly payouts.
        </p>
      </div>
    </div>
  );
}

/* ─── Quickstart ──────────────────────────────────────────── */
function QuickstartPage({ state }: { state: PartnerState }) {
  const partnerId = state.slug || "your-partner-id";
  const [copied, setCopied] = useState(false);

  const curl = `curl https://api.getopenmodels.com/v1/chat/completions \\
  -H "Authorization: Bearer $OPENMODELS_API_KEY" \\
  -H "X-OpenModels-Partner: ${partnerId}" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"deepseek-v3","messages":[{"role":"user","content":"Hello"}]}'`;

  const copyCode = () => {
    navigator.clipboard.writeText(curl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const partnerName = state.name || partnerId;

  return (
    <div style={{ padding: "24px 28px", maxWidth: 640 }}>
      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 3 }}>QUICKSTART</div>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>Customer quickstart</h2>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 24, lineHeight: 1.65 }}>
        Share this example with customers. Your Partner ID is already included for attribution.
      </p>

      {/* Code block */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ background: "#0a0a0a", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid #1a1a1a" }}>
            <span style={{ fontFamily: F.mono, fontSize: 11, color: "#555" }}>bash</span>
            <button onClick={copyCode} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "3px 9px", cursor: "pointer", fontFamily: F.sans, fontSize: 11, color: copied ? "#22c55e" : "#888", transition: "color 100ms" }}>
              {copied ? <Check size={10} /> : <Copy size={10} />}{copied ? "Copied" : "Copy customer quickstart"}
            </button>
          </div>
          <pre style={{ margin: 0, padding: "14px", fontFamily: F.mono, fontSize: 12, color: "#e5e5e5", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.75 }}>{curl}</pre>
        </div>
        <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#B0B0B0", margin: "7px 0 0" }}>
          Requests using this header are attributed to {partnerName} for usage and payout tracking.
        </p>
      </div>

      {/* Attribution fields */}
      <div style={{ border: B, overflow: "hidden" }}>
        <div style={{ padding: "9px 14px", background: "#F7F7F7", borderBottom: Bs }}>
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>ATTRIBUTION FIELDS RECORDED</span>
        </div>
        {[
          { k: "partner_id",     v: partnerId },
          { k: "customer",       v: "linked OpenModels account" },
          { k: "usage",          v: "tokens, requests per model" },
          { k: "payout amount",  v: "calculated from attributed usage" },
        ].map((r, i, arr) => (
          <div key={r.k} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "9px 14px", borderBottom: i < arr.length - 1 ? Bs : "none" }}>
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#A3A3A3" }}>{r.k}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#555" }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Partner ID chip ───────────────────────────────────── */
function PartnerIdChip({ partnerId }: { partnerId: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(partnerId).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F5F5F5", border: "1px solid #E5E5E5", borderRadius: 4, padding: "4px 8px 4px 10px", height: 28 }}>
      <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>Partner ID</span>
      <span style={{ fontFamily: F.mono, fontSize: D.label, fontWeight: 600, color: "#111" }}>{partnerId}</span>
      <button onClick={copy} title="Copy" style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#16A34A" : "#C0C0C0", padding: 0, display: "flex", transition: "color 100ms", marginLeft: 2 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#555")} onMouseLeave={(e) => (e.currentTarget.style.color = copied ? "#16A34A" : "#C0C0C0")}>
        {copied ? <Check size={10} /> : <Copy size={10} />}
      </button>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────── */
const nav: { id: PartnerPage; label: string; Icon: typeof Home; group?: string }[] = [
  { id: "overview",   label: "Overview",   Icon: Home,       group: "setup"    },
  { id: "storefront", label: "Storefront", Icon: Store,      group: "setup"    },
  { id: "models",     label: "Models",     Icon: Cpu,        group: "setup"    },
  { id: "plan",       label: "Plan",       Icon: CreditCard, group: "setup"    },
  { id: "seo",        label: "SEO",        Icon: Search,     group: "setup"    },
  { id: "preview",    label: "Preview",    Icon: Eye,        group: "setup"    },
  { id: "quickstart", label: "Quickstart", Icon: Zap,        group: "data"     },
  { id: "usage",      label: "Usage",      Icon: BarChart2,  group: "data"     },
  { id: "payouts",    label: "Payouts",    Icon: DollarSign, group: "data"     },
  { id: "settings",   label: "Settings",   Icon: Settings,   group: "settings" },
];

/* This is referenced in drawer but needs to be after component definitions */
const MODEL_PROVIDER_ROUTES = MODEL_PROVIDERS;

export function PartnerApp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [page,      setPage]      = useState<PartnerPage>("overview");
  const [modal,     setModal]     = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [success,   setSuccess]   = useState(false);

  const openPlanModal = () => setPlanModal(true);

  const [state, setStateRaw] = useState<PartnerState>({
    name: "", email: "", telegram: "", discord: "", whatsapp: "", wechat: "",
    desc: "", slug: "", seoTitle: "", seoDesc: "",
    marketplaceModels: [],
    plan: (searchParams.get("plan") as PlanStatus) || "",
    status: "draft", brandColor: "#0047FF",
  });
  const setState = (partial: Partial<PartnerState>) => setStateRaw((p) => ({ ...p, ...partial }));

  const handlePublish = () => { if (!state.plan) { setModal(true); return; } setSuccess(true); };
  const handlePlanConfirm = (plan: PlanStatus) => { setState({ plan }); setModal(false); setSuccess(true); };

  if (success) {
    const url = `https://openmodels.market/p/${state.slug || "my-marketplace"}`;
    return (
      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, textAlign: "center", padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={22} color="#16A34A" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontFamily: F.sans, fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8 }}>Marketplace published</h1>
          <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 24 }}>Your branded LLM token marketplace is live and powered by OpenModels.</p>
          <div style={{ border: B, borderRadius: 8, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{url}</span>
            <button onClick={() => navigator.clipboard.writeText(url).catch(() => {})} style={{ fontFamily: F.sans, fontSize: D.label, color: blue, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Copy</button>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#fff", background: "#111", textDecoration: "none", height: 36, padding: "0 16px", borderRadius: 6, display: "inline-flex", alignItems: "center" }}>View marketplace</a>
            <button onClick={() => setSuccess(false)} style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", background: "#fff", border: B, height: 36, padding: "0 16px", borderRadius: 6, cursor: "pointer" }}>Edit marketplace</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F7F7F7", fontFamily: F.sans, overflow: "hidden" }}>
      <aside style={{ width: 220, background: "#FAFAFA", borderRight: B, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: "14px 16px", borderBottom: B }}>
          <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", letterSpacing: "-0.02em" }}>
            <span style={{ color: blue }}>Open</span>Models
            <span style={{ color: "#A3A3A3", fontWeight: 400, fontSize: 11 }}> Partner</span>
          </div>
        </div>

        {/* Workspace info */}
        <div style={{ padding: "10px 16px 10px", borderBottom: B }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Partner workspace</span>
            <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: state.status === "live" ? "#15803D" : "#888", background: state.status === "live" ? "#F0FDF4" : "#F5F5F5", border: `1px solid ${state.status === "live" ? "#BBF7D0" : "#E5E5E5"}`, borderRadius: 999, padding: "1px 6px" }}>
              {state.status === "live" ? "Live" : "Draft"}
            </span>
          </div>
          <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111", marginTop: 4 }}>{state.name || "Draft marketplace"}</div>
          <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>team@example.com</div>
        </div>
        <nav style={{ padding: "6px 8px", flex: 1 }}>
          {nav.map(({ id, label, Icon, group }, i) => {
            const active   = page === id;
            const prevGroup = i > 0 ? nav[i - 1].group : group;
            const showDivider = i > 0 && group !== prevGroup;
            return (
              <div key={id}>
                {showDivider && <div style={{ height: 1, background: "#F0F0F0", margin: "5px 0" }} />}
                <button onClick={() => setPage(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", height: 34, marginBottom: 1, background: active ? "#EAF1FF" : "transparent", border: "none", borderRadius: 6, borderLeft: `2px solid ${active ? blue : "transparent"}`, cursor: "pointer", textAlign: "left", color: active ? blue : "#555", transition: "background 80ms" }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#F0F0F0"; e.currentTarget.style.color = "#111"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}>
                  <Icon size={14} strokeWidth={active ? 1.75 : 1.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: active ? 500 : 400 }}>{label}</span>
                </button>
              </div>
            );
          })}
        </nav>
        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: B }}>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", padding: 0, transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}
          >
            <ChevronLeft size={12} strokeWidth={1.5} />Back to OpenModels
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {/* Topbar */}
        <div style={{ height: 52, borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "#fff", flexShrink: 0 }}>
          <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111" }}>{nav.find((n) => n.id === page)?.label}</span>
          {/* Partner ID chip */}
          {state.slug && (
            <PartnerIdChip partnerId={state.slug} />
          )}
        </div>
        {page === "overview"   && <OverviewPage   state={state} setPage={setPage} openPlanModal={openPlanModal} />}
        {page === "storefront" && <StorefrontPage state={state} setState={setState} />}
        {page === "models"     && <ModelsPage     state={state} setState={setState} plan={state.plan} />}
        {page === "plan"       && <PlanPage       state={state} openPlanModal={openPlanModal} />}
        {page === "seo"        && <SEOPage        state={state} setState={setState} />}
        {page === "preview"    && <PreviewPage    state={state} onPublish={handlePublish} />}
        {page === "quickstart" && <QuickstartPage state={state} />}
        {page === "usage"      && <UsagePage      state={state} />}
        {page === "payouts"    && <PayoutsPage />}
        {page === "settings"   && <SettingsPage   state={state} setState={setState} openPlanModal={openPlanModal} />}
      </div>

      {modal     && <PublishModal state={state} onClose={() => setModal(false)} onConfirm={handlePlanConfirm} />}
      {planModal && <PublishModal state={state} onClose={() => setPlanModal(false)} onConfirm={(plan) => { setState({ plan }); setPlanModal(false); }} />}
    </div>
  );
}
