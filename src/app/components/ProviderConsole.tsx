import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home, Cpu, Globe, Activity, BarChart2, DollarSign, Settings,
  ChevronLeft, Plus, X, Check, Pause, Play, RefreshCw, AlertTriangle,
  ExternalLink, Copy,
} from "lucide-react";
import { F, D } from "../lib/type";

/* ─── Design tokens ─────────────────────────────────────── */
const B   = "1px solid #e2e2e2";
const Bs  = "1px solid #eeeeee";
const blue = "#0047FF";

/* ─── Types ──────────────────────────────────────────────── */
type ProviderPage = "overview" | "routes" | "models-api" | "health" | "usage" | "payouts" | "settings";
type ProviderStatus = "pending" | "community" | "verified" | "suspended" | "attention";

interface ProviderRoute {
  id:        string;
  model:     string;
  inputPer1M:  number;
  outputPer1M: number;
  cachePer1M:  number;
  context:   string;
  status:    "live" | "paused" | "draft";
  health:    "healthy" | "degraded" | "down";
  lastCheck: string;
  latency:   number;  /* ms */
}

interface ProviderState {
  name:      string;
  slug:      string;
  email:     string;
  telegram:  string;
  discord:   string;
  whatsapp:  string;
  wechat:    string;
  inferenceRegion: string;
  dataLogging: boolean;
  providerType: "community" | "verified";
  status:    ProviderStatus;
  apiBaseUrl:  string;
  modelsUrl:   string;
  authType:    "bearer" | "api-key" | "none";
  providerKey: string;
  lastSync:    string;
  modelsDiscovered: number;
  routes:    ProviderRoute[];
}

/* ─── Mock data ──────────────────────────────────────────── */
const MOCK_ROUTES: ProviderRoute[] = [
  { id: "r1", model: "llama-3.1-70b",  inputPer1M: 0.38, outputPer1M: 0.65, cachePer1M: 0.10, context: "128K", status: "live",   health: "healthy",  lastCheck: "2m ago",   latency: 760  },
  { id: "r2", model: "deepseek-v3",    inputPer1M: 0.28, outputPer1M: 0.55, cachePer1M: 0.08, context: "128K", status: "live",   health: "healthy",  lastCheck: "2m ago",   latency: 910  },
  { id: "r3", model: "qwen-2.5-72b",   inputPer1M: 0.32, outputPer1M: 0.58, cachePer1M: 0.09, context: "128K", status: "live",   health: "degraded", lastCheck: "5m ago",   latency: 1840 },
  { id: "r4", model: "llama-3.1-8b",   inputPer1M: 0.05, outputPer1M: 0.10, cachePer1M: 0.02, context: "128K", status: "paused", health: "down",     lastCheck: "12m ago",  latency: 0    },
  { id: "r5", model: "mistral-large",  inputPer1M: 0.42, outputPer1M: 0.76, cachePer1M: 0.12, context: "128K", status: "live",   health: "healthy",  lastCheck: "2m ago",   latency: 760  },
];

/* ─── Helpers ────────────────────────────────────────────── */
const inputSt: React.CSSProperties = {
  width: "100%", height: 34, padding: "0 10px",
  fontFamily: F.sans, fontSize: D.body, color: "#111",
  background: "#fff", border: B, borderRadius: 6, outline: "none", boxSizing: "border-box" as const,
};
const selectSt: React.CSSProperties = { ...inputSt, cursor: "pointer" };

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", letterSpacing: "0.04em", marginBottom: 5 }}>{label.toUpperCase()}</div>
      {children}
      {hint && <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function StatusPill({ status }: { status: ProviderStatus }) {
  const map: Record<ProviderStatus, { label: string; color: string; bg: string; border: string }> = {
    pending:   { label: "Pending review",  color: "#92400E", bg: "#FEF3C7", border: "#FDE68A" },
    community: { label: "Community live",  color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0" },
    verified:  { label: "Verified live",   color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
    suspended: { label: "Suspended",       color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
    attention: { label: "Needs attention", color: "#9A3412", bg: "#FFF7ED", border: "#FDBA74" },
  };
  const s = map[status];
  return (
    <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 999, padding: "2px 9px", letterSpacing: "0.01em" }}>
      {s.label}
    </span>
  );
}

function HealthDot({ health }: { health: ProviderRoute["health"] }) {
  const c = health === "healthy" ? "#16A34A" : health === "degraded" ? "#D97706" : "#DC2626";
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />;
}

function SectionLabel({ text }: { text: string }) {
  return <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "9px 20px 7px", borderBottom: Bs, background: "#F7F7F7" }}>{text}</div>;
}

/* ─── Stat cell ──────────────────────────────────────────── */
function StatCell({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{ padding: "18px 24px", borderRight: Bs, flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#B0B0B0", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700, color: accent ? blue : "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: sub ? 4 : 0 }}>{value}</div>
      {sub && <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#B0B0B0" }}>{sub}</div>}
    </div>
  );
}

/* ─── Add Route Drawer ───────────────────────────────────── */
function AddRouteDrawer({ onAdd, onClose }: { onAdd: (r: ProviderRoute) => void; onClose: () => void }) {
  const [step, setStep]         = useState<1 | 2 | 3 | 4 | 5>(1);
  const [model, setModel]       = useState("");
  const [inputP, setInputP]     = useState("");
  const [outputP, setOutputP]   = useState("");
  const [cacheP, setCacheP]     = useState("");
  const [tpm, setTpm]           = useState("");
  const [rpm, setRpm]           = useState("");
  const [ctx, setCtx]           = useState("128K");
  const [logging, setLogging]   = useState(false);
  const [training, setTraining] = useState(false);
  const [region, setRegion]     = useState("US");
  const [mode, setMode]         = useState<"draft" | "community">("community");

  const MODELS = ["llama-3.1-70b", "llama-3.1-8b", "deepseek-v3", "deepseek-r1", "qwen-2.5-72b", "qwen-2.5-coder-32b", "mistral-large", "mistral-7b"];
  const steps = ["Model", "Pricing", "Capacity", "Policy", "Publish"];
  const canNext1 = !!model;
  const canNext2 = !!inputP && !!outputP;

  const handlePublish = () => {
    onAdd({
      id: `r${Date.now()}`, model,
      inputPer1M: parseFloat(inputP) || 0,
      outputPer1M: parseFloat(outputP) || 0,
      cachePer1M: parseFloat(cacheP) || 0,
      context: ctx, status: mode === "draft" ? "draft" : "live",
      health: "healthy", lastCheck: "just now", latency: 0,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.18)" }} />
      <div style={{ width: 560, background: "#fff", borderLeft: B, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111" }}>Add route</div>
            <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginTop: 2 }}>Step {step} of 5 — {steps[step - 1]}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0C0C0", padding: 4, transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#555")} onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}>
            <X size={14} />
          </button>
        </div>

        {/* Step bar */}
        <div style={{ display: "flex", borderBottom: B }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "7px 0", fontFamily: F.sans, fontSize: 11, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? blue : step > i + 1 ? "#15803D" : "#C0C0C0", borderBottom: `2px solid ${step === i + 1 ? blue : step > i + 1 ? "#16A34A" : "transparent"}`, textAlign: "center" }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {/* Step 1: Model */}
          {step === 1 && (
            <div>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 16 }}>Select the model you want to publish a supply route for.</p>
              {MODELS.map((m) => (
                <div key={m} onClick={() => setModel(m)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 4, border: model === m ? `1px solid ${blue}` : Bs, background: model === m ? "#F5F8FF" : "#fff", cursor: "pointer", transition: "all 80ms", borderRadius: 4 }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${model === m ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {model === m && <span style={{ width: 6, height: 6, borderRadius: "50%", background: blue }} />}
                  </span>
                  <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#111" }}>{m}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Pricing */}
          {step === 2 && (
            <div>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 16 }}>Set your supply prices. OpenModels uses these to calculate margin and route priority.</p>
              <Field label="Input / 1M tokens" hint="USD per million input tokens">
                <input value={inputP} onChange={(e) => setInputP(e.target.value)} placeholder="0.38" type="number" min={0} step={0.01} style={inputSt} />
              </Field>
              <Field label="Output / 1M tokens" hint="USD per million output tokens">
                <input value={outputP} onChange={(e) => setOutputP(e.target.value)} placeholder="0.65" type="number" min={0} step={0.01} style={inputSt} />
              </Field>
              <Field label="Cache read / 1M tokens" hint="Optional. USD per million cached input tokens">
                <input value={cacheP} onChange={(e) => setCacheP(e.target.value)} placeholder="0.10" type="number" min={0} step={0.01} style={inputSt} />
              </Field>
            </div>
          )}

          {/* Step 3: Capacity */}
          {step === 3 && (
            <div>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 16 }}>Describe the throughput limits for this route.</p>
              <Field label="Max context" hint="e.g. 128K">
                <select value={ctx} onChange={(e) => setCtx(e.target.value)} style={selectSt}>
                  {["8K", "16K", "32K", "64K", "128K", "200K"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="TPM (tokens/min)" hint="Optional">
                  <input value={tpm} onChange={(e) => setTpm(e.target.value)} placeholder="1000000" type="number" min={0} style={inputSt} />
                </Field>
                <Field label="RPM (requests/min)" hint="Optional">
                  <input value={rpm} onChange={(e) => setRpm(e.target.value)} placeholder="10000" type="number" min={0} style={inputSt} />
                </Field>
              </div>
            </div>
          )}

          {/* Step 4: Policy */}
          {step === 4 && (
            <div>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 16 }}>Declare your data handling policies. These are shown to consumers.</p>
              <Field label="Inference region">
                <select value={region} onChange={(e) => setRegion(e.target.value)} style={selectSt}>
                  {["US", "EU", "AP", "Global"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              {[
                { label: "Log request/response data",   value: logging,  set: setLogging  },
                { label: "Use prompts for model training", value: training, set: setTraining },
              ].map(({ label, value, set }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: Bs }}>
                  <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#444" }}>{label}</span>
                  <button onClick={() => set(!value)} style={{ width: 36, height: 20, borderRadius: 10, background: value ? blue : "#E0E0E0", border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 150ms" }}>
                    <span style={{ position: "absolute", top: 2, left: value ? 17 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 150ms", display: "block", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Step 5: Publish */}
          {step === 5 && (
            <div>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 20 }}>Review and publish your route to OpenModels marketplace.</p>
              {/* Summary */}
              <div style={{ border: B, borderRadius: 6, overflow: "hidden", marginBottom: 20 }}>
                {[
                  { k: "Model",    v: model },
                  { k: "Input",   v: `$${inputP} / 1M` },
                  { k: "Output",  v: `$${outputP} / 1M` },
                  { k: "Cache",   v: cacheP ? `$${cacheP} / 1M` : "—" },
                  { k: "Context", v: ctx },
                  { k: "Region",  v: region },
                  { k: "Logging", v: logging ? "Yes" : "No" },
                ].map((r, i, arr) => (
                  <div key={r.k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", padding: "9px 14px", borderBottom: i < arr.length - 1 ? Bs : "none" }}>
                    <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#B0B0B0", letterSpacing: "0.04em" }}>{r.k.toUpperCase()}</span>
                    <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#FAFAFA", border: Bs, borderRadius: 6, padding: "12px 14px", marginBottom: 20 }}>
                <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#888", margin: 0, lineHeight: 1.6 }}>Community routes are measured automatically and may be suspended if health checks fail.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: B, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          {step > 1 ? (
            <button onClick={() => setStep((p) => (p - 1) as any)} style={{ height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, color: "#555", background: "#fff", border: B, borderRadius: 6, cursor: "pointer" }}>Back</button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep((p) => (p + 1) as any)}
              disabled={step === 1 ? !canNext1 : step === 2 ? !canNext2 : false}
              style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: (step === 1 ? !canNext1 : step === 2 ? !canNext2 : false) ? "#C0C0C0" : "#111", border: "none", borderRadius: 6, cursor: "pointer" }}
            >Continue</button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setMode("draft"); handlePublish(); }} style={{ height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#555", background: "#fff", border: B, borderRadius: 6, cursor: "pointer" }}>Save as draft</button>
              <button onClick={() => { setMode("community"); handlePublish(); }} style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer" }}>Publish community route</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Overview ───────────────────────────────────────────── */
function OverviewPage({ state, setPage }: { state: ProviderState; setPage: (p: ProviderPage) => void }) {
  const live     = state.routes.filter((r) => r.status === "live").length;
  const degraded = state.routes.filter((r) => r.health === "degraded" || r.health === "down").length;
  return (
    <div>
      {/* Status banner */}
      <div style={{ padding: "16px 28px", borderBottom: B, background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 4 }}>PROVIDER STATUS</div>
          <StatusPill status={state.status} />
        </div>
        <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#888", maxWidth: 380, textAlign: "right" }}>
          {state.status === "community"
            ? "Community routes are measured automatically and may be suspended if health checks fail."
            : state.status === "verified"
            ? "Verified routes are reviewed for production marketplace usage."
            : state.status === "pending"
            ? "Your provider application is under review. We'll notify you by email."
            : ""}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", borderBottom: B, flexWrap: "wrap" }}>
        <StatCell label="ROUTES"        value={String(state.routes.length)} />
        <StatCell label="LIVE ROUTES"   value={String(live)} accent />
        <StatCell label="REQUESTS (24H)" value="48.2K" sub="↑ 12% vs yesterday" />
        <StatCell label="TOKENS SERVED" value="2.4B"   sub="input + output" />
        <StatCell label="EST. EARNINGS" value="$184.20" sub="this month" />
        <div style={{ flex: 1, padding: "18px 24px", minWidth: 0, borderLeft: Bs }}>
          {degraded > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={13} color="#D97706" />
              <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#92400E" }}>{degraded} route{degraded > 1 ? "s" : ""} need attention</span>
              <button onClick={() => setPage("health")} style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>View →</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Check size={12} color="#16A34A" strokeWidth={2.5} />
              <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#15803D" }}>All routes healthy</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent health checks */}
      <div style={{ padding: "24px 28px" }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 14 }}>RECENT HEALTH CHECKS</div>
        <div style={{ border: B, borderRadius: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 80px", padding: "8px 16px", background: "#F7F7F7", borderBottom: Bs }}>
            {["Route", "Status", "Latency", "Uptime", "Last"].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em" }}>{h.toUpperCase()}</span>
            ))}
          </div>
          {state.routes.slice(0, 5).map((r, i) => (
            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 80px", padding: "10px 16px", borderBottom: i < 4 ? Bs : "none", alignItems: "center" }}>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{r.model}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <HealthDot health={r.health} />
                <span style={{ fontFamily: F.sans, fontSize: D.label, color: r.health === "healthy" ? "#15803D" : r.health === "degraded" ? "#92400E" : "#DC2626" }}>
                  {r.health.charAt(0).toUpperCase() + r.health.slice(1)}
                </span>
              </span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: r.latency > 1500 ? "#D97706" : "#555" }}>{r.latency ? `${r.latency}ms` : "—"}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{r.health === "down" ? "0%" : r.health === "degraded" ? "94.2%" : "99.9%"}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#B0B0B0" }}>{r.lastCheck}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Routes ─────────────────────────────────────────────── */
function RoutesPage({ state, setState }: { state: ProviderState; setState: (s: Partial<ProviderState>) => void }) {
  const [drawer, setDrawer] = useState(false);

  const togglePause = (id: string) => {
    setState({
      routes: state.routes.map((r) =>
        r.id === id ? { ...r, status: r.status === "live" ? "paused" : "live" } : r
      ),
    });
  };

  const addRoute = (r: ProviderRoute) => { setState({ routes: [...state.routes, r] }); setDrawer(false); };

  const statusColor = (s: ProviderRoute["status"]) =>
    s === "live" ? { c: "#15803D", bg: "#F0FDF4", b: "#BBF7D0" } :
    s === "paused" ? { c: "#555", bg: "#F5F5F5", b: "#E5E5E5" } :
    { c: "#888", bg: "#F5F5F5", b: "#E5E5E5" };

  return (
    <div>
      <div style={{ padding: "20px 28px 16px", borderBottom: B, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 2 }}>ROUTES</div>
          <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", margin: 0 }}>Published model routes</h2>
          <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#888", margin: "3px 0 0" }}>Each route represents one model endpoint offered to OpenModels marketplace.</p>
        </div>
        <button onClick={() => setDrawer(true)} style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer" }}>
          <Plus size={13} />Add route
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 80px 72px 80px 80px 90px 60px", padding: "8px 28px", background: "#F7F7F7", borderBottom: Bs, minWidth: 860 }}>
          {["Model", "Input /1M", "Output /1M", "Cache /1M", "Context", "Status", "Health", "Last check", ""].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em" }}>{h.toUpperCase()}</span>
          ))}
        </div>
        {state.routes.length === 0 ? (
          <div style={{ padding: "48px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#B0B0B0", marginBottom: 10 }}>No routes yet.</div>
            <button onClick={() => setDrawer(true)} style={{ fontFamily: F.sans, fontSize: D.body, color: blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Add your first route →</button>
          </div>
        ) : state.routes.map((r, i) => {
          const sc = statusColor(r.status);
          return (
            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 80px 72px 80px 80px 90px 60px", padding: "0 28px", minHeight: 52, borderBottom: i < state.routes.length - 1 ? Bs : "none", alignItems: "center", minWidth: 860, transition: "background 80ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#111", fontWeight: 500 }}>{r.model}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333", fontVariantNumeric: "tabular-nums" }}>${r.inputPer1M.toFixed(2)}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555", fontVariantNumeric: "tabular-nums" }}>${r.outputPer1M.toFixed(2)}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#888", fontVariantNumeric: "tabular-nums" }}>{r.cachePer1M ? `$${r.cachePer1M.toFixed(2)}` : "—"}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#AAAAAA" }}>{r.context}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: sc.c, background: sc.bg, border: `1px solid ${sc.b}`, borderRadius: 999, padding: "2px 8px", width: "fit-content" }}>
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <HealthDot health={r.health} />
                <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>{r.health.charAt(0).toUpperCase() + r.health.slice(1)}</span>
              </span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#B0B0B0" }}>{r.lastCheck}</span>
              <button onClick={() => togglePause(r.id)} title={r.status === "live" ? "Pause" : "Resume"}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#C0C0C0", padding: 4, display: "flex", transition: "color 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}
              >{r.status === "live" ? <Pause size={13} /> : <Play size={13} />}</button>
            </div>
          );
        })}
      </div>

      {drawer && <AddRouteDrawer onAdd={addRoute} onClose={() => setDrawer(false)} />}
    </div>
  );
}

/* ─── Models API ─────────────────────────────────────────── */
function ModelsApiPage({ state, setState }: { state: ProviderState; setState: (s: Partial<ProviderState>) => void }) {
  const [testing,  setTesting]  = useState(false);
  const [syncing,  setSyncing]  = useState(false);
  const [testOk,   setTestOk]   = useState<boolean | null>(null);
  const [syncMsg,  setSyncMsg]  = useState("");

  const handleTest = () => {
    setTesting(true); setTestOk(null);
    setTimeout(() => { setTesting(false); setTestOk(true); }, 1200);
  };
  const handleSync = () => {
    setSyncing(true); setSyncMsg("");
    setTimeout(() => { setSyncing(false); setSyncMsg(`${state.modelsDiscovered} models discovered`); setState({ lastSync: "just now" }); }, 1400);
  };

  return (
    <div style={{ padding: "24px 28px", maxWidth: 560 }}>
      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 3 }}>MODELS API</div>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>Configure your /models endpoint</h2>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 24 }}>OpenModels syncs your available models automatically. Used to populate route selection.</p>

      <Field label="API Base URL" hint="e.g. https://api.yourprovider.com/v1">
        <input value={state.apiBaseUrl} onChange={(e) => setState({ apiBaseUrl: e.target.value })} placeholder="https://api.yourprovider.com/v1" style={inputSt} />
      </Field>
      <Field label="Models endpoint URL" hint="Full URL to your /models list">
        <input value={state.modelsUrl} onChange={(e) => setState({ modelsUrl: e.target.value })} placeholder="https://api.yourprovider.com/v1/models" style={inputSt} />
      </Field>
      <Field label="Auth type">
        <select value={state.authType} onChange={(e) => setState({ authType: e.target.value as any })} style={selectSt}>
          <option value="bearer">Bearer token</option>
          <option value="api-key">API key header</option>
          <option value="none">No auth</option>
        </select>
      </Field>
      {state.authType !== "none" && (
        <Field label="Provider API key" hint="Stored encrypted. Only used for sync.">
          <input value={state.providerKey} onChange={(e) => setState({ providerKey: e.target.value })} placeholder="sk-..." type="password" style={inputSt} />
        </Field>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={handleTest} disabled={testing} style={{ height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#444", background: "#fff", border: B, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          {testing ? <RefreshCw size={12} style={{ animation: "spin 0.8s linear infinite" }} /> : <Activity size={12} />}
          Test connection
        </button>
        <button onClick={handleSync} disabled={syncing} style={{ height: 34, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          {syncing ? <RefreshCw size={12} style={{ animation: "spin 0.8s linear infinite" }} /> : <RefreshCw size={12} />}
          Sync models
        </button>
        {testOk === true && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: F.sans, fontSize: D.body, color: "#15803D" }}><Check size={12} />Connected</span>}
      </div>

      {/* Sync status */}
      <div style={{ border: B, borderRadius: 0, overflow: "hidden" }}>
        <SectionLabel text="Sync status" />
        {[
          { label: "Last sync",          value: state.lastSync || "Never" },
          { label: "Models discovered",  value: String(state.modelsDiscovered) },
          { label: "Sync status",        value: syncMsg || "Ready" },
        ].map((row, i, arr) => (
          <div key={row.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "10px 16px", borderBottom: i < arr.length - 1 ? Bs : "none" }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#B0B0B0", letterSpacing: "0.04em" }}>{row.label.toUpperCase()}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{row.value}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Health ─────────────────────────────────────────────── */
function HealthPage({ state }: { state: ProviderState }) {
  const healthy  = state.routes.filter((r) => r.health === "healthy").length;
  const degraded = state.routes.filter((r) => r.health === "degraded").length;
  const down     = state.routes.filter((r) => r.health === "down").length;

  return (
    <div>
      <div style={{ padding: "20px 28px 16px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 2 }}>HEALTH</div>
        <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", margin: 0 }}>Route health monitoring</h2>
        <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#888", marginTop: 3 }}>OpenModels probes your routes every 2 minutes. Degraded or failing routes may be deprioritised or suspended.</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: "flex", borderBottom: B }}>
        {[
          { label: "HEALTHY",  value: String(healthy),  color: "#15803D" },
          { label: "DEGRADED", value: String(degraded), color: "#D97706" },
          { label: "DOWN",     value: String(down),     color: "#DC2626" },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: "14px 24px", borderRight: i < 2 ? Bs : "none" }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: "-0.04em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Per-route health table */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 90px 1fr", padding: "8px 28px", background: "#F7F7F7", borderBottom: Bs, minWidth: 720 }}>
          {["Route", "Health", "Latency", "Uptime", "Last check", "Note"].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em" }}>{h.toUpperCase()}</span>
          ))}
        </div>
        {state.routes.map((r, i) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 90px 1fr", padding: "11px 28px", borderBottom: i < state.routes.length - 1 ? Bs : "none", alignItems: "center", minWidth: 720 }}>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#111" }}>{r.model}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <HealthDot health={r.health} />
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: r.health === "healthy" ? "#15803D" : r.health === "degraded" ? "#92400E" : "#DC2626" }}>
                {r.health.charAt(0).toUpperCase() + r.health.slice(1)}
              </span>
            </span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: r.latency > 1500 ? "#D97706" : "#555" }}>{r.latency ? `${r.latency}ms` : "—"}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{r.health === "down" ? "0%" : r.health === "degraded" ? "94.2%" : "99.9%"}</span>
            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#B0B0B0" }}>{r.lastCheck}</span>
            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>
              {r.health === "degraded" ? "High latency — route deprioritised" : r.health === "down" ? "No response — route suspended" : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Usage (simplified stub) ───────────────────────────── */
function UsagePage() {
  const rows = [
    { date: "2026-06-28", model: "llama-3.1-70b",  req: "18,402", inTok: "12.4M",  outTok: "4.2M",  rev: "$7.84",  err: "0.1%" },
    { date: "2026-06-28", model: "deepseek-v3",     req: "11,290", inTok: "9.8M",   outTok: "3.1M",  rev: "$4.44",  err: "0.0%" },
    { date: "2026-06-28", model: "qwen-2.5-72b",    req: "7,104",  inTok: "6.1M",   outTok: "2.0M",  rev: "$3.10",  err: "1.2%" },
    { date: "2026-06-27", model: "llama-3.1-70b",   req: "14,880", inTok: "10.2M",  outTok: "3.8M",  rev: "$6.24",  err: "0.2%" },
    { date: "2026-06-27", model: "deepseek-v3",     req: "9,440",  inTok: "7.9M",   outTok: "2.6M",  rev: "$3.63",  err: "0.0%" },
  ];
  return (
    <div>
      <div style={{ padding: "20px 28px 16px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 2 }}>USAGE</div>
        <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", margin: 0 }}>Request and revenue summary</h2>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 80px 80px 80px 80px 60px", padding: "8px 28px", background: "#F7F7F7", borderBottom: Bs, minWidth: 660 }}>
          {["Date", "Model", "Requests", "Input", "Output", "Revenue", "Errors"].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", letterSpacing: "0.06em" }}>{h.toUpperCase()}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 80px 80px 80px 80px 60px", padding: "10px 28px", borderBottom: i < rows.length - 1 ? Bs : "none", alignItems: "center", minWidth: 660 }}>
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#B0B0B0" }}>{r.date}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{r.model}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{r.req}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{r.inTok}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>{r.outTok}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#111", fontWeight: 600 }}>{r.rev}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.label, color: parseFloat(r.err) > 0.5 ? "#D97706" : "#B0B0B0" }}>{r.err}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Payouts (stub) ─────────────────────────────────────── */
function PayoutsPage() {
  return (
    <div style={{ padding: "28px" }}>
      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 3 }}>PAYOUTS</div>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>Payout settings</h2>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#888", marginBottom: 24, maxWidth: 480 }}>Revenue accumulates in your provider balance and can be withdrawn monthly. Payout setup coming soon.</p>
      <div style={{ border: B, borderRadius: 0, overflow: "hidden", maxWidth: 460 }}>
        {[
          { label: "Pending balance",  value: "$184.20" },
          { label: "Total paid out",   value: "$0.00"   },
          { label: "Payout method",    value: "Not configured" },
          { label: "Next payout",      value: "—" },
        ].map((r, i, arr) => (
          <div key={r.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "11px 16px", borderBottom: i < arr.length - 1 ? Bs : "none" }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#B0B0B0", letterSpacing: "0.04em" }}>{r.label.toUpperCase()}</span>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings ───────────────────────────────────────────── */
function SettingsPage({ state, setState }: { state: ProviderState; setState: (s: Partial<ProviderState>) => void }) {
  return (
    <div style={{ padding: "24px 28px", maxWidth: 540 }}>
      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: 3 }}>SETTINGS</div>
      <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>Provider profile</h2>
      <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 20 }}>This information is shown on your provider page and in the OpenModels marketplace.</p>

      <Field label="Provider name">
        <input value={state.name} onChange={(e) => setState({ name: e.target.value })} placeholder="My Inference Co." style={inputSt} />
      </Field>
      <Field label="Slug" hint="openmodels.market/providers/your-slug">
        <input value={state.slug} onChange={(e) => setState({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} placeholder="my-inference-co" style={inputSt} />
      </Field>

      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 12, marginTop: 4 }}>CONTACT</div>
      <Field label="Contact email">
        <input value={state.email} onChange={(e) => setState({ email: e.target.value })} placeholder="hello@yourprovider.com" type="email" style={inputSt} />
      </Field>
      <Field label="Telegram" hint="e.g. @yourhandle">
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

      <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", marginBottom: 12, marginTop: 4 }}>INFRASTRUCTURE</div>
      <Field label="Inference region">
        <select value={state.inferenceRegion} onChange={(e) => setState({ inferenceRegion: e.target.value })} style={{ ...inputSt, cursor: "pointer" } as React.CSSProperties}>
          {["US", "EU", "AP", "Global"].map((r) => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Provider type">
        <select value={state.providerType} onChange={(e) => setState({ providerType: e.target.value as any })} style={{ ...inputSt, cursor: "pointer" } as React.CSSProperties}>
          <option value="community">Community</option>
          <option value="verified">Verified</option>
        </select>
      </Field>
      <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#B0B0B0", marginBottom: 20, marginTop: -8, lineHeight: 1.6 }}>
        {state.providerType === "community"
          ? "Community routes are publicly listed and measured automatically."
          : "Verified routes are reviewed by OpenModels for production marketplace use."}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
        <button style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 6, cursor: "pointer" }}>Save changes</button>
        <button style={{ fontFamily: F.sans, fontSize: D.body, color: "#C0C0C0", background: "none", border: "none", cursor: "pointer", transition: "color 100ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}
        >Remove provider account</button>
      </div>
    </div>
  );
}

/* ─── Nav definition ─────────────────────────────────────── */
const NAV: { id: ProviderPage; label: string; Icon: typeof Home }[] = [
  { id: "overview",   label: "Overview",   Icon: Home       },
  { id: "routes",     label: "Routes",     Icon: Cpu        },
  { id: "models-api", label: "Models API", Icon: Globe      },
  { id: "health",     label: "Health",     Icon: Activity   },
  { id: "usage",      label: "Usage",      Icon: BarChart2  },
  { id: "payouts",    label: "Payouts",    Icon: DollarSign },
  { id: "settings",   label: "Settings",   Icon: Settings   },
];

/* ─── Main ───────────────────────────────────────────────── */
export function ProviderConsole() {
  const navigate = useNavigate();
  const [page, setPage] = useState<ProviderPage>("overview");

  const [state, setStateRaw] = useState<ProviderState>({
    name: "My Provider", slug: "my-provider",
    email: "", telegram: "", discord: "", whatsapp: "", wechat: "",
    inferenceRegion: "US", dataLogging: false,
    providerType: "community", status: "community",
    apiBaseUrl: "", modelsUrl: "", authType: "bearer", providerKey: "",
    lastSync: "12m ago", modelsDiscovered: 8,
    routes: MOCK_ROUTES,
  });
  const setState = (p: Partial<ProviderState>) => setStateRaw((prev) => ({ ...prev, ...p }));

  const liveCount = state.routes.filter((r) => r.status === "live").length;
  const hasIssue  = state.routes.some((r) => r.health !== "healthy");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F7F7F7", fontFamily: F.sans, overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 220, background: "#FAFAFA", borderRight: B, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: "14px 16px", borderBottom: B }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 700, color: "#111", letterSpacing: "-0.025em" }}>
            <span style={{ color: blue }}>Open</span>Models
            <span style={{ color: "#A3A3A3", fontWeight: 400 }}> Provider</span>
          </div>
        </div>

        {/* Workspace info */}
        <div style={{ padding: "10px 16px 10px", borderBottom: B }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>Provider workspace</span>
            <StatusPill status={state.status} />
          </div>
          <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111", marginTop: 4 }}>{state.name}</div>
          <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>{liveCount} live routes</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "6px 8px", flex: 1 }}>
          {NAV.map(({ id, label, Icon }) => {
            const active = page === id;
            const showAlert = id === "health" && hasIssue;
            return (
              <button key={id} onClick={() => setPage(id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", height: 34, marginBottom: 1, background: active ? "#EAF1FF" : "transparent", border: "none", borderRadius: 6, borderLeft: `2px solid ${active ? blue : "transparent"}`, cursor: "pointer", textAlign: "left", color: active ? blue : "#555", transition: "background 80ms" }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#F0F0F0"; e.currentTarget.style.color = "#111"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}
              >
                <Icon size={14} strokeWidth={active ? 1.75 : 1.5} style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: active ? 500 : 400, flex: 1 }}>{label}</span>
                {showAlert && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />}
              </button>
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

      {/* ── Main ── */}
      <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
        {page === "overview"   && <OverviewPage   state={state} setPage={setPage} />}
        {page === "routes"     && <RoutesPage     state={state} setState={setState} />}
        {page === "models-api" && <ModelsApiPage  state={state} setState={setState} />}
        {page === "health"     && <HealthPage     state={state} />}
        {page === "usage"      && <UsagePage />}
        {page === "payouts"    && <PayoutsPage />}
        {page === "settings"   && <SettingsPage   state={state} setState={setState} />}
      </div>
    </div>
  );
}
