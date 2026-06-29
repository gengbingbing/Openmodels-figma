import { useState, useEffect } from "react";
import { GitBranch, Plus, X, Check, ChevronUp, ChevronDown, Copy } from "lucide-react";
import { F, D } from "../../../lib/type";
import { B, Bs, blue } from "../shared";

const HEADER_H = 56;

/* ─── Types ──────────────────────────────────────────────── */
type RouteRule   = "priority-fallback" | "mode-mapping";
type RouteStatus = "active" | "paused";

interface ModeMap { fast: string; balanced: string; deep: string }

interface RouteItem {
  id:           string;
  name:         string;
  routeId:      string;   /* "route:coding-agent" */
  rule:         RouteRule;
  ruleName:     string;
  models:       string[]; /* ordered list */
  modeMap:      ModeMap | null;
  defaultModel: string;   /* first model or "balanced" for mode-mapping */
  spend:        number;
  status:       RouteStatus;
  description:  string;
}

/* ─── Static data ────────────────────────────────────────── */
const INITIAL_ROUTES: RouteItem[] = [
  {
    id: "coding-agent", name: "Coding agent",
    routeId: "route:coding-agent",
    rule: "priority-fallback", ruleName: "Priority fallback",
    models: ["qwen-2.5-coder-32b", "llama-3.1-70b", "deepseek-v3"],
    modeMap: null,
    defaultModel: "qwen-2.5-coder-32b",
    spend: 18.20, status: "active",
    description: "Optimized model group for code generation tasks.",
  },
  {
    id: "support-chat", name: "Support chat",
    routeId: "route:support-chat",
    rule: "mode-mapping", ruleName: "Mode mapping",
    models: ["mistral-7b", "qwen-2.5-72b", "deepseek-r1"],
    modeMap: { fast: "mistral-7b", balanced: "qwen-2.5-72b", deep: "deepseek-r1" },
    defaultModel: "balanced",
    spend: 9.40, status: "active",
    description: "Fast/balanced/deep routing for support conversations.",
  },
  {
    id: "batch-summary", name: "Batch summary",
    routeId: "route:batch-summary",
    rule: "priority-fallback", ruleName: "Priority fallback",
    models: ["mistral-7b", "llama-3.1-8b"],
    modeMap: null,
    defaultModel: "mistral-7b",
    spend: 2.80, status: "paused",
    description: "",
  },
];

const AVAILABLE_MODELS = [
  { id: "qwen-2.5-72b",       input: 0.32, output: 0.58, context: "128K", routes: 3, status: "Live"    },
  { id: "deepseek-v3",        input: 0.28, output: 0.55, context: "128K", routes: 2, status: "Live"    },
  { id: "llama-3.1-70b",      input: 0.38, output: 0.65, context: "128K", routes: 4, status: "Live"    },
  { id: "deepseek-r1",        input: 0.50, output: 1.20, context: "64K",  routes: 2, status: "Live"    },
  { id: "mistral-large",      input: 0.42, output: 0.76, context: "128K", routes: 2, status: "Live"    },
  { id: "qwen-2.5-coder-32b", input: 0.18, output: 0.38, context: "128K", routes: 2, status: "Live"    },
  { id: "llama-3.1-8b",       input: 0.05, output: 0.10, context: "128K", routes: 3, status: "Live"    },
  { id: "mistral-7b",         input: 0.04, output: 0.08, context: "32K",  routes: 2, status: "Live"    },
];

const MODES = ["fast", "balanced", "deep"] as const;

/* ─── UI helpers ─────────────────────────────────────────── */
function SL({ label }: { label: string }) {
  return (
    <div style={{ padding: "9px 20px 7px", borderBottom: Bs, background: "#F7F7F7", flexShrink: 0 }}>
      <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>{label}</span>
    </div>
  );
}

function RuleBadge({ rule }: { rule: RouteRule }) {
  const color = rule === "priority-fallback" ? "#15803D" : "#1D4ED8";
  const label = rule === "priority-fallback" ? "Priority fallback" : "Mode mapping";
  return (
    <span style={{ fontFamily: F.sans, fontSize: D.body, color, whiteSpace: "nowrap" as const }}>{label}</span>
  );
}

function StatusPill({ status }: { status: RouteStatus }) {
  const on = status === "active";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: on ? "#15803D" : "#A3A3A3", background: on ? "#F0FDF4" : "#F5F5F5", border: `1px solid ${on ? "#BBF7D0" : "#E5E5E5"}`, borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" as const }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: on ? "#16A34A" : "#D1D5DB" }} />
      {on ? "Active" : "Paused"}
    </span>
  );
}

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", background: "#0a0a0a", borderRadius: 6, overflow: "hidden" }}>
      <button onClick={() => { navigator.clipboard.writeText(children).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
        style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: copied ? "#22c55e" : "#555", padding: "2px 6px", transition: "color 100ms" }}>
        {copied ? <Check size={11} /> : <span style={{ fontFamily: F.sans, fontSize: 10 }}>copy</span>}
      </button>
      <pre style={{ margin: 0, padding: "14px 40px 14px 16px", fontFamily: F.mono, fontSize: 11, color: "#e5e5e5", overflowX: "auto", whiteSpace: "pre", lineHeight: 1.7 }}>{children}</pre>
    </div>
  );
}

function RouteIdCell({ routeId }: { routeId: string }) {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(routeId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, overflow: "hidden" }}>
      <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{routeId}</span>
      <button onClick={copy} title="Copy route ID" style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 3px", color: copied ? "#16A34A" : "#C0C0C0", display: "flex", alignItems: "center", flexShrink: 0, transition: "color 100ms" }}
        onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#777"; }}
        onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#C0C0C0"; }}
      >
        {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} />}
      </button>
    </div>
  );
}

function routeSlug(name: string) {
  return "route:" + name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ─── Main component ─────────────────────────────────────── */
export function RoutesPage() {
  const [routes,     setRoutes]     = useState<RouteItem[]>(INITIAL_ROUTES);
  const [detailId,   setDetailId]   = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId,     setEditId]     = useState<string | null>(null);

  /* Form state */
  const [fname,     setFname]     = useState("");
  const [fdesc,     setFdesc]     = useState("");
  const [fstatus,   setFstatus]   = useState<RouteStatus>("active");
  const [fmodels,   setFmodels]   = useState<string[]>([]);
  const [forder,    setForder]    = useState<string[]>([]); /* priority order */
  const [frule,     setFrule]     = useState<RouteRule>("priority-fallback");
  const [ffast,     setFfast]     = useState("");
  const [fbalanced, setFbalanced] = useState("");
  const [fdeep,     setFdeep]     = useState("");

  const detailRoute = routes.find((r) => r.id === detailId) ?? null;
  const editRoute   = routes.find((r) => r.id === editId)   ?? null;
  const formOpen    = createOpen || editId !== null;
  const anyOpen     = !!detailRoute || formOpen;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAll(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeAll = () => { setDetailId(null); setCreateOpen(false); setEditId(null); };

  const resetForm = () => {
    setFname(""); setFdesc(""); setFstatus("active");
    setFmodels([]); setForder([]); setFrule("priority-fallback");
    setFfast(""); setFbalanced(""); setFdeep("");
  };

  const openCreate = () => { resetForm(); setEditId(null); setDetailId(null); setCreateOpen(true); };

  const openEdit = (r: RouteItem) => {
    setFname(r.name); setFdesc(r.description); setFstatus(r.status);
    setFmodels([...r.models]); setForder([...r.models]);
    setFrule(r.rule);
    setFfast(r.modeMap?.fast ?? ""); setFbalanced(r.modeMap?.balanced ?? ""); setFdeep(r.modeMap?.deep ?? "");
    setCreateOpen(false); setDetailId(null); setEditId(r.id);
  };

  const saveForm = () => {
    const slug = routeSlug(fname) || "route:new-route";
    const orderedModels = frule === "priority-fallback" ? forder.filter((x) => fmodels.includes(x)) : fmodels;
    const modeMap: ModeMap | null = frule === "mode-mapping" ? { fast: ffast, balanced: fbalanced, deep: fdeep } : null;
    const newRoute: RouteItem = {
      id:           editId ?? (fname.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "new-route"),
      name:         fname || "New route",
      routeId:      editRoute?.routeId ?? slug,
      rule:         frule,
      ruleName:     frule === "priority-fallback" ? "Priority fallback" : "Mode mapping",
      models:       orderedModels,
      modeMap,
      defaultModel: frule === "priority-fallback" ? (orderedModels[0] ?? "") : "balanced",
      spend:        editRoute?.spend ?? 0,
      status:       fstatus,
      description:  fdesc,
    };
    setRoutes((prev) => editId ? prev.map((r) => r.id === editId ? newRoute : r) : [...prev, newRoute]);
    closeAll();
  };

  const toggleModel = (id: string) => {
    const removing = fmodels.includes(id);
    setFmodels((p) => removing ? p.filter((x) => x !== id) : [...p, id]);
    setForder((p) => removing ? p.filter((x) => x !== id) : [...p, id]);
    if (removing) {
      if (ffast === id) setFfast("");
      if (fbalanced === id) setFbalanced("");
      if (fdeep === id) setFdeep("");
    }
  };

  const moveUp   = (idx: number) => setForder((p) => { const n = [...p]; [n[idx-1], n[idx]] = [n[idx], n[idx-1]]; return n; });
  const moveDown = (idx: number) => setForder((p) => { const n = [...p]; [n[idx], n[idx+1]] = [n[idx+1], n[idx]]; return n; });

  const priorityList = forder.filter((x) => fmodels.includes(x));

  const apiSnippet = (r: RouteItem) => {
    if (r.rule === "mode-mapping") {
      return `// Default (balanced mode)\n{\n  "model": "${r.routeId}",\n  "messages": [{ "role": "user", "content": "..." }]\n}\n\n// Specify mode\n{\n  "model": "${r.routeId}",\n  "route_mode": "deep",\n  "messages": [{ "role": "user", "content": "..." }]\n}`;
    }
    return `{\n  "model": "${r.routeId}",\n  "messages": [{ "role": "user", "content": "..." }]\n}`;
  };

  const formRouteId = fname ? routeSlug(fname) : "route:your-route";
  const formSnippet = frule === "mode-mapping"
    ? `// Default (balanced mode)\n{\n  "model": "${formRouteId}",\n  "messages": [{ "role": "user", "content": "..." }]\n}\n\n// Specify mode\n{\n  "model": "${formRouteId}",\n  "route_mode": "deep",\n  "messages": [{ "role": "user", "content": "..." }]\n}`
    : `{\n  "model": "${formRouteId}",\n  "messages": [{ "role": "user", "content": "..." }]\n}`;

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <div style={{ height: "100%", overflowY: "auto", fontFamily: F.sans }}>

      {/* Header */}
      <div style={{ padding: "32px 28px 24px", borderBottom: B, background: "#fff" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <GitBranch size={11} color={blue} strokeWidth={2} />
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em" }}>ROUTES</span>
        </span>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 6, lineHeight: 1.2 }}>Model route groups</h1>
            <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
              Create stable route IDs for groups of models. Change routing logic without changing application code. Each model uses verified provider supply by default.
            </p>
          </div>
          <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F.sans, fontSize: D.body, fontWeight: 600, background: "#111", color: "#fff", border: "none", height: 34, padding: "0 14px", borderRadius: 6, cursor: "pointer", flexShrink: 0, transition: "opacity 120ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          ><Plus size={13} />Create route</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff" }}>
        <div className="rrow" style={{ display: "grid", gridTemplateColumns: "160px 170px 70px 140px 1fr 75px 80px", height: 40, alignItems: "center", padding: "0 28px", background: "#F7F7F7", borderBottom: B }}>
          {["Route", "Route ID", "Models", "Rule", "Default", "Spend", "Status"].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {routes.length === 0 && (
          <div style={{ padding: "48px 28px", textAlign: "center", color: "#A3A3A3", fontFamily: F.sans, fontSize: D.body }}>
            No routes yet.{" "}<button onClick={openCreate} style={{ background: "none", border: "none", cursor: "pointer", color: blue, fontFamily: F.sans, fontSize: D.body, padding: 0, fontWeight: 500 }}>Create your first route.</button>
          </div>
        )}

        {routes.map((r, i) => {
          const isActive = detailId === r.id;
          return (
            <div key={r.id} className="rrow"
              style={{ display: "grid", gridTemplateColumns: "160px 170px 70px 140px 1fr 75px 80px", minHeight: 54, padding: "0 28px", borderBottom: i < routes.length - 1 ? Bs : "none", alignItems: "center", background: isActive ? "#F5F8FF" : "transparent", borderLeft: `2px solid ${isActive ? blue : "transparent"}`, cursor: "pointer", transition: "background 80ms" }}
              onClick={() => setDetailId(isActive ? null : r.id)}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#FAFAFA"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div>
                <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#111", fontWeight: isActive ? 600 : 500 }}>{r.name}</span>
                {r.description && <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{r.description}</div>}
              </div>
              <RouteIdCell routeId={r.routeId} />
              <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#555" }}>{r.models.length}</span>
              <RuleBadge rule={r.rule} />
              <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.defaultModel}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: r.spend > 0 ? "#111" : "#C0C0C0", fontVariantNumeric: "tabular-nums" }}>
                {r.spend > 0 ? `$${r.spend.toFixed(2)}` : "—"}
              </span>
              <StatusPill status={r.status} />
            </div>
          );
        })}
      </div>

      <div style={{ padding: "18px 28px" }}>
        <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", margin: 0, lineHeight: 1.6 }}>
          Use <code style={{ fontFamily: F.mono }}>route:id</code> as the model name in your API calls. OpenModels selects the best available model and verified provider route automatically.
        </p>
      </div>

      {/* Backdrop */}
      {anyOpen && <div onClick={closeAll} style={{ position: "fixed", inset: 0, top: HEADER_H, zIndex: 40, background: "rgba(0,0,0,0.06)" }} />}

      {/* ── Detail drawer ── */}
      {detailRoute && !formOpen && (
        <div style={{ position: "fixed", right: 0, top: HEADER_H, bottom: 0, width: 560, zIndex: 50, background: "#fff", borderLeft: B, display: "flex", flexDirection: "column", overflowY: "auto" }}>

          <div style={{ padding: "20px 20px 16px", borderBottom: B, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 3 }}>{detailRoute.name}</div>
                <div style={{ fontFamily: F.mono, fontSize: D.label, color: "#888" }}>{detailRoute.routeId}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(detailRoute)} style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", background: "none", border: "1px solid #E5E5E5", borderRadius: 6, padding: "4px 10px", cursor: "pointer", transition: "background 80ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >Edit</button>
                <button onClick={() => setDetailId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#BBBBBB", padding: 4, display: "flex", transition: "color 100ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#BBBBBB")}
                ><X size={14} /></button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <RuleBadge rule={detailRoute.rule} />
              <StatusPill status={detailRoute.status} />
            </div>
          </div>

          {/* Models */}
          <SL label={`Models (${detailRoute.models.length})`} />
          <div style={{ flexShrink: 0 }}>
            {detailRoute.models.map((mid, i) => {
              const m = AVAILABLE_MODELS.find((x) => x.id === mid);
              return (
                <div key={mid} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: i < detailRoute.models.length - 1 ? Bs : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {detailRoute.rule === "priority-fallback" && (
                      <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#C0C0C0", width: 16 }}>{i + 1}</span>
                    )}
                    <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{mid}</span>
                  </div>
                  {m && <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#AAAAAA" }}>${m.input} / ${m.output} · {m.routes} routes</span>}
                </div>
              );
            })}
          </div>

          {/* Mode mapping detail */}
          {detailRoute.rule === "mode-mapping" && detailRoute.modeMap && (
            <>
              <SL label="Mode mapping" />
              <div style={{ flexShrink: 0 }}>
                {MODES.map((mode, i) => (
                  <div key={mode} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: i < MODES.length - 1 ? Bs : "none" }}>
                    <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#888", width: 70 }}>{mode}</span>
                    <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{detailRoute.modeMap![mode]}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Rule */}
          <SL label="Routing rule" />
          <div style={{ padding: "12px 20px", flexShrink: 0 }}>
            <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#111", marginBottom: 4 }}>{detailRoute.ruleName}</div>
            <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#888", lineHeight: 1.55 }}>
              {detailRoute.rule === "priority-fallback"
                ? "Use models in order. If the first model is unavailable, OpenModels falls back to the next model."
                : "Let your application switch between fast, balanced, and deep modes without changing model IDs."}
            </div>
          </div>

          {/* Usage */}
          <SL label="Usage (30d)" />
          <div style={{ padding: "12px 20px 4px", flexShrink: 0 }}>
            <div style={{ fontFamily: F.mono, fontSize: D.numLg, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
              {detailRoute.spend > 0 ? `$${detailRoute.spend.toFixed(2)}` : "$0.00"}
            </div>
          </div>

          {/* API example */}
          <SL label="API example" />
          <div style={{ padding: "14px 20px 20px", flexShrink: 0 }}>
            <CodeBlock>{apiSnippet(detailRoute)}</CodeBlock>
          </div>
        </div>
      )}

      {/* ── Create / Edit drawer ── */}
      {formOpen && (
        <div style={{ position: "fixed", right: 0, top: HEADER_H, bottom: 0, width: 560, zIndex: 50, background: "#fff", borderLeft: B, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <div style={{ padding: "18px 20px", borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111" }}>{editId ? "Edit route" : "Create route"}</span>
            <button onClick={closeAll} style={{ background: "none", border: "none", cursor: "pointer", color: "#BBBBBB", padding: 4, display: "flex", transition: "color 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#BBBBBB")}
            ><X size={14} /></button>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>

            {/* 1. BASIC */}
            <SL label="Basic" />
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", marginBottom: 5 }}>ROUTE NAME</div>
                <input value={fname} onChange={(e) => setFname(e.target.value)} placeholder="e.g. Coding agent"
                  style={{ width: "100%", height: 34, padding: "0 10px", fontFamily: F.sans, fontSize: D.body, color: "#111", background: "#fff", border: B, borderRadius: 6, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", marginBottom: 5 }}>ROUTE ID</div>
                <div style={{ height: 34, padding: "0 10px", display: "flex", alignItems: "center", background: "#F7F7F7", border: "1px solid #EFEFEF", borderRadius: 6 }}>
                  <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#888" }}>{formRouteId}</span>
                </div>
                <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginTop: 3 }}>Use this as the model name in your API calls.</div>
              </div>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", marginBottom: 5 }}>DESCRIPTION <span style={{ color: "#C0C0C0", fontWeight: 400 }}>(optional)</span></div>
                <input value={fdesc} onChange={(e) => setFdesc(e.target.value)} placeholder="e.g. Coding tasks with fallback"
                  style={{ width: "100%", height: 34, padding: "0 10px", fontFamily: F.sans, fontSize: D.body, color: "#111", background: "#fff", border: B, borderRadius: 6, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#777", marginBottom: 5 }}>STATUS</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["active", "paused"] as RouteStatus[]).map((s) => (
                    <button key={s} onClick={() => setFstatus(s)} style={{ height: 30, padding: "0 14px", fontFamily: F.sans, fontSize: D.body, fontWeight: fstatus === s ? 600 : 400, color: fstatus === s ? "#fff" : "#555", background: fstatus === s ? "#111" : "#F5F5F5", border: `1px solid ${fstatus === s ? "#111" : "#E5E5E5"}`, borderRadius: 6, cursor: "pointer", transition: "all 100ms", textTransform: "capitalize" }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. MODELS */}
            <SL label="Models" />
            <div style={{ padding: "10px 20px 4px" }}>
              <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#888", marginBottom: 10 }}>
                Select the models this route can use. OpenModels uses verified provider routes for each model by default.
              </div>
              <div style={{ border: B, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 64px 60px 50px 54px", padding: "6px 12px", background: "#F7F7F7", borderBottom: Bs }}>
                  {["Model", "Input", "Output", "Context", "Routes", "Status"].map((h) => (
                    <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#BBBBBB", letterSpacing: "0.04em" }}>{h.toUpperCase()}</span>
                  ))}
                </div>
                {AVAILABLE_MODELS.map((m, i) => {
                  const checked = fmodels.includes(m.id);
                  return (
                    <div key={m.id} onClick={() => toggleModel(m.id)} style={{ display: "grid", gridTemplateColumns: "1fr 60px 64px 60px 50px 54px", padding: "9px 12px", borderBottom: i < AVAILABLE_MODELS.length - 1 ? Bs : "none", alignItems: "center", cursor: "pointer", background: checked ? "#F5F8FF" : "transparent", transition: "background 80ms" }}
                      onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "#FAFAFA"; }}
                      onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${checked ? blue : "#D5D5D5"}`, background: checked ? blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 100ms" }}>
                          {checked && <Check size={9} color="#fff" strokeWidth={2.5} />}
                        </span>
                        <span style={{ fontFamily: F.mono, fontSize: 11, color: "#333" }}>{m.id}</span>
                      </div>
                      <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#888" }}>${m.input}</span>
                      <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#888" }}>${m.output}</span>
                      <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>{m.context}</span>
                      <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#888" }}>{m.routes}</span>
                      <span style={{ fontFamily: F.sans, fontSize: D.label, color: m.status === "Live" ? "#15803D" : "#B45309" }}>{m.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. ROUTING RULE */}
            <SL label="Routing rule" />
            <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                { id: "priority-fallback" as RouteRule, name: "Priority fallback", desc: "Use models in order. If the first model is unavailable, OpenModels falls back to the next model." },
                { id: "mode-mapping"      as RouteRule, name: "Mode mapping",      desc: "Let your application switch between fast, balanced, and deep modes without changing model IDs." },
              ]).map((rule) => {
                const active = frule === rule.id;
                return (
                  <button key={rule.id} onClick={() => setFrule(rule.id)} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "10px 14px", background: active ? "#F5F8FF" : "#FAFAFA", border: `1px solid ${active ? blue : "#E5E5E5"}`, borderRadius: 6, cursor: "pointer", textAlign: "left", transition: "all 100ms" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${active ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: blue }} />}
                      </span>
                      <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: active ? "#111" : "#444" }}>{rule.name}</span>
                    </div>
                    <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#888", marginLeft: 22, lineHeight: 1.5 }}>{rule.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* PRIORITY ORDER — when rule = priority-fallback */}
            {frule === "priority-fallback" && priorityList.length > 0 && (
              <div style={{ padding: "0 20px 14px" }}>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 8 }}>PRIORITY ORDER</div>
                {priorityList.length < 2 ? (
                  <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#AAAAAA", padding: "10px 12px", background: "#F7F7F7", border: "1px solid #EFEFEF", borderRadius: 6 }}>
                    Add at least two models to define priority order.
                  </div>
                ) : (
                  <div style={{ border: B, borderRadius: 6, overflow: "hidden" }}>
                    {priorityList.map((mid, idx) => (
                      <div key={mid} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderBottom: idx < priorityList.length - 1 ? Bs : "none" }}>
                        <span style={{ fontFamily: F.mono, fontSize: D.label, color: "#C0C0C0", width: 18, flexShrink: 0 }}>{idx + 1}</span>
                        <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333", flex: 1 }}>{mid}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <button onClick={() => idx > 0 && moveUp(forder.indexOf(mid))} disabled={idx === 0}
                            style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", padding: "1px 4px", color: idx === 0 ? "#E0E0E0" : "#999", display: "flex", transition: "color 80ms" }}
                            onMouseEnter={(e) => { if (idx > 0) e.currentTarget.style.color = "#111"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = idx === 0 ? "#E0E0E0" : "#999"; }}
                          ><ChevronUp size={13} /></button>
                          <button onClick={() => idx < priorityList.length - 1 && moveDown(forder.indexOf(mid))} disabled={idx === priorityList.length - 1}
                            style={{ background: "none", border: "none", cursor: idx === priorityList.length - 1 ? "default" : "pointer", padding: "1px 4px", color: idx === priorityList.length - 1 ? "#E0E0E0" : "#999", display: "flex", transition: "color 80ms" }}
                            onMouseEnter={(e) => { if (idx < priorityList.length - 1) e.currentTarget.style.color = "#111"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = idx === priorityList.length - 1 ? "#E0E0E0" : "#999"; }}
                          ><ChevronDown size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MODE MAPPING — when rule = mode-mapping */}
            {frule === "mode-mapping" && fmodels.length >= 1 && (
              <div style={{ padding: "0 20px 14px" }}>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: "#C0C0C0", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 8 }}>MODE ASSIGNMENT</div>
                <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#888", marginBottom: 10 }}>
                  Assign one model to each mode. Default mode is <strong>balanced</strong>.
                </div>
                <div style={{ border: B, borderRadius: 6, overflow: "hidden" }}>
                  {([
                    { mode: "fast", label: "Fast", val: ffast, set: setFfast, hint: "Fastest, lowest cost" },
                    { mode: "balanced", label: "Balanced", val: fbalanced, set: setFbalanced, hint: "Default mode" },
                    { mode: "deep", label: "Deep", val: fdeep, set: setFdeep, hint: "Highest quality" },
                  ] as const).map((row, i) => (
                    <div key={row.mode} style={{ padding: "12px 14px", borderBottom: i < 2 ? Bs : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#333" }}>{row.label}</span>
                          <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginLeft: 8 }}>{row.hint}</span>
                          {row.mode === "balanced" && <span style={{ fontFamily: F.sans, fontSize: D.label, color: blue, marginLeft: 6, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 999, padding: "0 6px" }}>default</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {fmodels.map((m) => {
                          const active = (row.val as string) === m;
                          return (
                            <button key={m} onClick={() => (row.set as (v: string) => void)(m)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: active ? "#F5F8FF" : "#FAFAFA", border: `1px solid ${active ? blue : "#E5E5E5"}`, borderRadius: 6, cursor: "pointer", textAlign: "left", transition: "all 100ms" }}>
                              <span style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${active ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {active && <span style={{ width: 5, height: 5, borderRadius: "50%", background: blue }} />}
                              </span>
                              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{m}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. API EXAMPLE */}
            <SL label="API example" />
            <div style={{ padding: "14px 20px 24px" }}>
              <CodeBlock>{formSnippet}</CodeBlock>
            </div>
          </div>

          <div style={{ padding: "14px 20px", borderTop: B, display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={saveForm} disabled={fmodels.length < 1} style={{ flex: 1, height: 36, fontFamily: F.sans, fontSize: D.body, fontWeight: 600, background: fmodels.length < 1 ? "#D0D0D0" : "#111", color: "#fff", border: "none", borderRadius: 6, cursor: fmodels.length < 1 ? "not-allowed" : "pointer", transition: "opacity 120ms" }}
              onMouseEnter={(e) => { if (fmodels.length >= 1) e.currentTarget.style.opacity = "0.8"; }}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >{editId ? "Save changes" : "Create route"}</button>
            <button onClick={closeAll} style={{ height: 36, padding: "0 16px", fontFamily: F.sans, fontSize: D.body, fontWeight: 500, background: "#fff", color: "#555", border: B, borderRadius: 6, cursor: "pointer", transition: "background 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >Cancel</button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .rrow { grid-template-columns: 150px 170px 70px 130px 1fr 70px !important; padding: 0 16px !important; }
          .rrow > *:nth-child(7) { display: none; }
        }
        @media (max-width: 768px) {
          .rrow { grid-template-columns: 1fr 130px 70px !important; }
          .rrow > *:nth-child(2), .rrow > *:nth-child(4), .rrow > *:nth-child(5), .rrow > *:nth-child(6) { display: none; }
        }
      `}</style>
    </div>
  );
}
