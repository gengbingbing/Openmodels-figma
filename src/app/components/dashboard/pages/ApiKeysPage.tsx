import { useState } from "react";
import { Copy, Check, Trash2, Plus, Eye, EyeOff, X, AlertTriangle, Key } from "lucide-react";
import { T, F } from "../../../lib/type";
import { D } from "../shared";
import { copyText } from "../../../lib/clipboard";

/* ── landing-matched tokens ── */
const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

interface ApiKey {
  id: number; name: string; prefix: string; suffix: string;
  created: string; status: "active" | "revoked";
  monthlyLimit: number | null; monthlySpend: number;
}

const initialKeys: ApiKey[] = [
  { id: 1, name: "Production",   prefix: "sk-om-", suffix: "x9k2", created: "2026-05-15", status: "active", monthlyLimit: 200,  monthlySpend: 42.30 },
  { id: 2, name: "Development",  prefix: "sk-om-", suffix: "p4m7", created: "2026-05-20", status: "active", monthlyLimit: 20,   monthlySpend: 3.10 },
  { id: 3, name: "CI / Testing", prefix: "sk-om-", suffix: "q8n3", created: "2026-06-01", status: "active", monthlyLimit: null, monthlySpend: 0 },
];

const masked = (p: string, s: string) => `${p}${"•".repeat(20)}${s}`;
const genKey = () => { const c = "abcdefghijklmnopqrstuvwxyz0123456789"; return Array.from({ length: 32 }, () => c[Math.floor(Math.random() * c.length)]).join(""); };

type Lang = "curl" | "python" | "node";

const snippets: Record<Lang, { label: string; lines: { text: string; color: string }[] }> = {
  curl: {
    label: "curl",
    lines: [
      { text: 'curl https://api.getopenmodels.com/v1/chat/completions \\', color: "#79ffe1" },
      { text: '  -H "Authorization: Bearer $OM_API_KEY" \\',           color: "#b3d7ff" },
      { text: '  -H "Content-Type: application/json" \\',              color: "#b3d7ff" },
      { text: "  -d '{",                                                color: "#aaa"    },
      { text: '    "model": "llama-3.1-70b",',                         color: "#ffd87d" },
      { text: '    "messages": [',                                      color: "#aaa"    },
      { text: '      {"role": "user", "content": "Hello"}',            color: "#aaa"    },
      { text: "    ]",                                                  color: "#aaa"    },
      { text: "  }'",                                                   color: "#aaa"    },
    ],
  },
  python: {
    label: "Python",
    lines: [
      { text: "from openai import OpenAI",                             color: "#b3d7ff" },
      { text: "",                                                        color: "#aaa"    },
      { text: "client = OpenAI(",                                       color: "#aaa"    },
      { text: '    base_url="https://api.getopenmodels.com/v1",',         color: "#aaa"    },
      { text: '    api_key="YOUR_API_KEY",',                            color: "#aaa"    },
      { text: ")",                                                       color: "#aaa"    },
      { text: "",                                                        color: "#aaa"    },
      { text: "response = client.chat.completions.create(",             color: "#aaa"    },
      { text: '    model="llama-3.1-70b",',                            color: "#ffd87d" },
      { text: '    messages=[{"role": "user", "content": "Hello"}],',  color: "#aaa"    },
      { text: ")",                                                       color: "#aaa"    },
    ],
  },
  node: {
    label: "Node.js",
    lines: [
      { text: 'import OpenAI from "openai";',                          color: "#b3d7ff" },
      { text: "",                                                        color: "#aaa"    },
      { text: "const client = new OpenAI({",                           color: "#aaa"    },
      { text: '  baseURL: "https://api.getopenmodels.com/v1",',           color: "#aaa"    },
      { text: '  apiKey: "YOUR_API_KEY",',                             color: "#aaa"    },
      { text: "});",                                                     color: "#aaa"    },
      { text: "",                                                        color: "#aaa"    },
      { text: "const res = await client.chat.completions.create({",    color: "#aaa"    },
      { text: '  model: "llama-3.1-70b",',                            color: "#ffd87d" },
      { text: '  messages: [{ role: "user", content: "Hello" }],',    color: "#aaa"    },
      { text: "});",                                                     color: "#aaa"    },
    ],
  },
};

function ModelSnippet() {
  const [open, setOpen]   = useState(false);
  const [lang, setLang]   = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);

  const snippet = snippets[lang];
  const raw = snippet.lines.map((l) => l.text).join("\n");

  const handleCopy = () => {
    copyText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ borderBottom: "1px solid #e2e2e2" }}>
      {/* collapsed toggle bar */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 28px", background: "#fafafa", border: "none", cursor: "pointer", textAlign: "left", transition: "background 100ms" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f3f3")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fafafa")}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: "0.06em", textTransform: "uppercase" }}>Model ID usage</span>
          <span style={{ fontFamily: F.mono, fontSize: 11, color: "#bbb" }}>— how to pass a model in your request</span>
        </span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: "#bbb", transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms", display: "inline-block" }}>▾</span>
      </button>

      {open && (
        <>
          {/* tabs + copy */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "#111", borderBottom: "1px solid #222" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {(["curl", "python", "node"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)} style={{
                  fontFamily: F.mono, fontSize: 11, background: "none", border: "none",
                  borderBottom: lang === l ? `2px solid ${blue}` : "2px solid transparent",
                  color: lang === l ? "#fff" : "#555",
                  padding: "9px 12px", cursor: "pointer", transition: "color 100ms",
                }}>{snippets[l].label}</button>
              ))}
            </div>
            <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#16A34A" : "#555", display: "flex", alignItems: "center", gap: 5, fontFamily: F.sans, fontSize: 11, padding: 0, transition: "color 100ms" }}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* code */}
          <pre style={{ margin: 0, padding: "14px 28px", fontFamily: F.mono, fontSize: 12, lineHeight: 1.85, background: "#111", overflowX: "auto" }}>
            {snippet.lines.map((line, i) => (
              <span key={i} style={{ display: "block", color: line.color, minHeight: "1em" }}>{line.text || " "}</span>
            ))}
          </pre>

          {/* footer */}
          <div style={{ padding: "9px 28px", background: "#0d0d0d", borderTop: "1px solid #1e1e1e" }}>
            <span style={{ fontFamily: F.sans, fontSize: 11, color: "#444" }}>
              Replace <code style={{ fontFamily: F.mono, color: "#ffd87d" }}>"llama-3.1-70b"</code> with any model ID from the{" "}
              <a href="#" style={{ color: "#555", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >Marketplace →</a>
            </span>
          </div>

          {/* Provider route example */}
          <div style={{ borderTop: "1px solid #1e1e1e" }}>
            <div style={{ padding: "9px 28px", background: "#111", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: "#666" }}>To specify a provider route</span>
            </div>
            <pre style={{ margin: 0, padding: "14px 28px", fontFamily: F.mono, fontSize: 12, lineHeight: 1.8, background: "#111", color: "#aaa", overflowX: "auto" }}>
              <span style={{ display: "block", color: "#ffd87d" }}>{`{`}</span>
              <span style={{ display: "block", color: "#aaa" }}>{`  "model": "qwen-2.5-72b",`}</span>
              <span style={{ display: "block", color: "#b3d7ff" }}>{`  "route": { "provider": "alibaba" },`}</span>
              <span style={{ display: "block", color: "#aaa" }}>{`  "messages": [...]`}</span>
              <span style={{ display: "block", color: "#ffd87d" }}>{`}`}</span>
            </pre>
            <div style={{ padding: "9px 28px", background: "#0d0d0d", borderTop: "1px solid #1e1e1e" }}>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: "#444" }}>
                If no provider is specified, OpenModels uses the lowest available live route by default.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ApiKeysPage() {
  const [keys, setKeys]           = useState<ApiKey[]>(initialKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]     = useState("");
  const [newLimit, setNewLimit]   = useState("");
  const [limitOn, setLimitOn]     = useState(false);
  const [createdKey, setCreatedKey] = useState<{ key: string; name: string } | null>(null);
  const [copied, setCopied]       = useState<number | string | null>(null);
  const [revealed, setRevealed]   = useState<Set<number>>(new Set());
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);

  const copy = (text: string, id: number | string) => {
    copyText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const closeCreate = () => { setShowCreate(false); setNewName(""); setNewLimit(""); setLimitOn(false); };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const raw = `sk-om-${genKey()}`;
    const suffix = raw.slice(-4);
    const limit = limitOn && newLimit ? parseFloat(newLimit) : null;
    setKeys((p) => [{ id: Date.now(), name: newName.trim(), prefix: "sk-om-", suffix, created: new Date().toISOString().slice(0, 10), status: "active", monthlyLimit: limit, monthlySpend: 0 }, ...p]);
    setCreatedKey({ key: raw, name: newName.trim() });
    closeCreate();
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;
    setKeys((p) => p.map((k) => k.id === revokeTarget.id ? { ...k, status: "revoked" } : k));
    setRevokeTarget(null);
  };

  const toggleReveal = (id: number) => setRevealed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const active = keys.filter((k) => k.status === "active").length;

  /* ── shared sub-components ── */
  const SectionLabel = ({ text, icon: Icon }: { text: string; icon?: React.ElementType }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
      {Icon && <Icon size={11} color={blue} strokeWidth={2} />}
      <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 700, color: blue, letterSpacing: "0.06em" }}>{text}</span>
    </span>
  );

  const Btn = ({ onClick, children, variant = "dark", disabled }: { onClick?: () => void; children: React.ReactNode; variant?: "dark" | "ghost" | "danger"; disabled?: boolean }) => {
    const styles: Record<string, React.CSSProperties> = {
      dark:  { background: disabled ? "#e0e0e0" : "#111", color: "#fff", border: "none" },
      ghost: { background: "none", color: "#555", border: B },
      danger:{ background: "#dc2626", color: "#fff", border: "none" },
    };
    return (
      <button onClick={onClick} disabled={disabled} style={{
        fontFamily: F.sans, fontSize: D.body, fontWeight: 600,
        padding: "8px 20px", cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 6,
        transition: "all 150ms", ...styles[variant],
      }}
        onMouseEnter={(e) => { if (!disabled && variant === "dark") e.currentTarget.style.background = "#2a2a2a"; if (variant === "ghost") e.currentTarget.style.borderColor = "#999"; }}
        onMouseLeave={(e) => { if (!disabled && variant === "dark") e.currentTarget.style.background = "#111"; if (variant === "ghost") e.currentTarget.style.borderColor = "#e2e2e2"; }}
      >{children}</button>
    );
  };

  return (
    <div style={{ fontFamily: F.sans }}>

      {/* ── Page header ── */}
      <div className="apikeys-header" style={{ padding: "32px 28px 24px", borderBottom: B, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <SectionLabel text="API KEYS" icon={Key} />
          <h1 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 8, lineHeight: 1.2 }}>
            Manage your API keys
          </h1>
          <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#777", lineHeight: 1.65 }}>
            Keys authenticate your requests. Treat them like passwords — never commit to source control.
          </p>
          {/* Mobile-only: full-width Create key button below description */}
          <button
            className="apikeys-create-mobile"
            onClick={() => setShowCreate(true)}
            style={{
              display: "none", width: "100%", marginTop: 16,
              fontFamily: F.sans, fontSize: D.body, fontWeight: 600,
              background: "#111", color: "#fff", border: "none",
              height: 40, cursor: "pointer", borderRadius: 4,
              alignItems: "center", justifyContent: "center", gap: 6,
              transition: "background 150ms",
            }}
          >
            <Plus size={13} strokeWidth={2.5} /> Create key
          </button>
        </div>
        {/* Desktop-only: button beside title */}
        <div className="apikeys-create-desktop">
          <Btn onClick={() => setShowCreate(true)}>
            <Plus size={13} strokeWidth={2.5} />Create key
          </Btn>
        </div>
      </div>

      {/* ── API Endpoint block — 3 clean rows on mobile ── */}
      <div style={{ borderBottom: B, background: "#fff" }}>

        {/* Row 1: Base URL */}
        <div style={{ padding: "11px 28px", borderBottom: Bs, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Base URL</div>
            <code style={{ fontFamily: F.mono, fontSize: 12, color: "#222", display: "block", wordBreak: "break-all" }}>
              https://api.getopenmodels.com/v1
            </code>
            <span style={{ fontFamily: F.sans, fontSize: 10, color: "#ccc", marginTop: 1, display: "block" }}>Powered by alephant.io</span>
          </div>
          <button
            onClick={() => copy("https://api.getopenmodels.com/v1", "baseurl")}
            style={{ background: "none", border: "1px solid #eee", cursor: "pointer", color: copied === "baseurl" ? "#16A34A" : "#ccc", padding: "4px 6px", display: "flex", alignItems: "center", flexShrink: 0, transition: "all 100ms" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#555"; }}
            onMouseLeave={(e) => { if (copied !== "baseurl") { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#ccc"; } }}
          >{copied === "baseurl" ? <Check size={11} /> : <Copy size={11} />}</button>
        </div>

        {/* Row 2: Authorization */}
        <div style={{ padding: "11px 28px", borderBottom: Bs, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Authorization</div>
            <code style={{ fontFamily: F.mono, fontSize: 12, color: "#222", display: "block" }}>
              Bearer YOUR_API_KEY
            </code>
          </div>
          <button
            onClick={() => copy("Bearer YOUR_API_KEY", "auth")}
            style={{ background: "none", border: "1px solid #eee", cursor: "pointer", color: copied === "auth" ? "#16A34A" : "#ccc", padding: "4px 6px", display: "flex", alignItems: "center", flexShrink: 0, transition: "all 100ms" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#555"; }}
            onMouseLeave={(e) => { if (copied !== "auth") { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#ccc"; } }}
          >{copied === "auth" ? <Check size={11} /> : <Copy size={11} />}</button>
        </div>

        {/* Row 3: Authorization + note */}
        <div style={{ padding: "11px 28px", borderBottom: Bs, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Note</div>
            <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#555" }}>
              Set <code style={{ fontFamily: F.mono, fontSize: 12, color: "#333", background: "#F5F5F5", padding: "0 4px", borderRadius: 3 }}>Authorization: Bearer YOUR_API_KEY</code> on every request.
            </span>
          </div>
        </div>
        <div style={{ padding: "10px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", lineHeight: 1.5 }}>
            One API key works across all verified open-source model routes.
          </span>
          <a href="#" style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: blue, textDecoration: "none", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >API docs →</a>
        </div>
      </div>

      {/* ── Model ID usage snippet ── */}
      <ModelSnippet />

      {/* ── Created key banner ── */}
      {createdKey && (
        <div style={{ margin: "24px 28px 0", border: "1px solid #bbf7d0", background: "#f0fdf4", padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#166534", marginBottom: 10 }}>
                ✓ Key created — <span style={{ fontWeight: 400 }}>{createdKey.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #bbf7d0", padding: "8px 12px" }}>
                <code style={{ fontFamily: F.mono, fontSize: D.label, color: "#111", flex: 1, wordBreak: "break-all" }}>{createdKey.key}</code>
                <button onClick={() => copy(createdKey.key, "new")} style={{ background: "none", border: "none", cursor: "pointer", color: copied === "new" ? "#16A34A" : "#aaa", flexShrink: 0 }}>
                  {copied === "new" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
                <AlertTriangle size={11} style={{ color: "#d97706" }} />
                <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#92400e" }}>Copy now — this key will not be shown again.</span>
              </div>
            </div>
            <button onClick={() => setCreatedKey(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 2, flexShrink: 0 }}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Stat strip ── */}
      <div className="stat-strip" style={{ display: "flex", borderBottom: B, marginTop: createdKey ? 24 : 0 }}>
        {[
          { label: "Total keys", value: String(keys.length) },
          { label: "Active",     value: String(active),       accent: true },
          { label: "Revoked",    value: String(keys.length - active) },
        ].map((s, i) => (
          <div key={s.label} className="stat-cell" style={{ padding: "16px 24px", borderRight: B, flex: 1 }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 6, whiteSpace: "nowrap" }}>{s.label.toUpperCase()}</div>
            <div style={{ fontFamily: F.sans, fontSize: 18, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: s.accent ? blue : "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
        {/* Spacer — hidden on mobile so stats share full width */}
        <div className="stat-spacer" style={{ flex: 3 }} />
      </div>

      {/* ── Table ── */}
      <div style={{ padding: "24px 28px 28px" }}>
        <div className="key-row" style={{ display: "grid", gridTemplateColumns: "150px 1fr 185px 100px 80px", padding: "8px 16px", background: "#f7f7f7", border: B, borderBottom: Bs }}>
          {["Name", "Key", "Monthly limit", "Status", ""].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, color: "#bbb", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {keys.map((k) => {
          const isRevealed = revealed.has(k.id);
          const isRevoked  = k.status === "revoked";
          const pct = k.monthlyLimit ? Math.min(100, (k.monthlySpend / k.monthlyLimit) * 100) : 0;
          const warn = pct > 80;
          return (
            <div key={k.id} className="key-row" style={{
              display: "grid", gridTemplateColumns: "150px 1fr 185px 100px 80px",
              padding: "11px 16px",
              border: B, borderTop: "none",
              alignItems: "center",
              opacity: isRevoked ? 0.4 : 1,
              transition: "background 80ms",
            }}
              onMouseEnter={(e) => { if (!isRevoked) e.currentTarget.style.background = "#fafafa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              {/* Name */}
              <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#0a0a0a" }}>{k.name}</span>

              {/* Key */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <code className="key-chip" style={{ fontFamily: F.mono, fontSize: D.label, color: "#666", background: "#f5f5f5", padding: "3px 8px", border: "1px solid #ededed", letterSpacing: isRevealed ? "0" : "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                  {isRevealed ? `${k.prefix}${"a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6".slice(0, 20)}${k.suffix}` : masked(k.prefix, k.suffix)}
                </code>
                {!isRevoked && (
                  <button onClick={() => toggleReveal(k.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", padding: 2, display: "flex", transition: "color 100ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ddd")}
                  >{isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                )}
              </div>

              {/* Monthly limit */}
              <div className="key-col-limit" style={{ paddingRight: 16 }}>
                {k.monthlyLimit !== null ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 5 }}>
                      <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 500, color: "#333" }}>
                        ${k.monthlySpend.toFixed(2)}
                      </span>
                      <span style={{ fontFamily: F.sans, fontSize: 11, color: "#ccc" }}>/ ${k.monthlyLimit}</span>
                    </div>
                    <div style={{ height: 2, background: "#f0f0f0", borderRadius: 1 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: warn ? "#f59e0b" : blue, transition: "width 400ms ease", borderRadius: 1 }} />
                    </div>
                  </>
                ) : (
                  <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#ddd" }}>Unlimited</span>
                )}
              </div>

              {/* Status */}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: isRevoked ? "#bbb" : "#16A34A" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: isRevoked ? "#bbb" : "#16A34A", display: "inline-block", flexShrink: 0 }} />
                {isRevoked ? "Revoked" : "Active"}
              </span>

              {/* Actions */}
              <div className="key-col-actions" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {!isRevoked && (
                  <>
                    <button onClick={() => copy(`${k.prefix}${"x".repeat(24)}${k.suffix}`, k.id)} title="Copy"
                      style={{ background: "none", border: "1px solid #e8e8e8", cursor: "pointer", color: copied === k.id ? "#16A34A" : "#ccc", padding: "5px 7px", display: "flex", alignItems: "center", transition: "all 100ms" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#555"; }}
                      onMouseLeave={(e) => { if (copied !== k.id) { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#ccc"; } }}
                    >{copied === k.id ? <Check size={12} /> : <Copy size={12} />}</button>
                    <button onClick={() => setRevokeTarget(k)} title="Revoke"
                      style={{ background: "none", border: "1px solid #e8e8e8", cursor: "pointer", color: "#ccc", padding: "5px 7px", display: "flex", alignItems: "center", transition: "all 100ms" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#ccc"; }}
                    ><Trash2 size={12} /></button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create modal ── */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={closeCreate}
        >
          <div style={{ background: "#fff", border: B, width: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.10)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "22px 24px 18px", borderBottom: Bs, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#0a0a0a", letterSpacing: 0 }}>Create API key</h2>
              <button onClick={closeCreate} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 2 }}><X size={16} /></button>
            </div>
            <div style={{ padding: "22px 24px" }}>
              <label style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 700, color: "#888", display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>KEY NAME</label>
              <input type="text" autoFocus placeholder="e.g. Production, Development, CI"
                value={newName} onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                style={{ width: "100%", height: 40, border: B, padding: "0 12px", fontFamily: F.sans, fontSize: D.body, color: "#111", outline: "none", boxSizing: "border-box" as const, transition: "border-color 150ms" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = blue)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
              />

              {/* Monthly limit toggle */}
              <div style={{ marginTop: 22, paddingTop: 20, borderTop: Bs }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: limitOn ? 16 : 0 }}>
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#333" }}>Monthly spend limit</div>
                    <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#aaa", marginTop: 2 }}>Block requests when limit is reached</div>
                  </div>
                  <button onClick={() => { setLimitOn(!limitOn); setNewLimit(""); }} style={{
                    width: 40, height: 22, borderRadius: 11, background: limitOn ? blue : "#e0e0e0",
                    border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 150ms",
                  }}>
                    <span style={{ position: "absolute", top: 3, left: limitOn ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 150ms", display: "block", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </button>
                </div>
                {limitOn && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#aaa" }}>$</span>
                      <input type="number" placeholder="0.00" min={1} autoFocus value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        style={{ width: 120, height: 36, border: B, padding: "0 10px", fontFamily: F.mono, fontSize: D.body, color: "#111", outline: "none", transition: "border-color 150ms" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = blue)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
                      />
                      <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#aaa" }}>per month</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {[10, 20, 50, 100, 200].map((p) => (
                        <button key={p} onClick={() => setNewLimit(String(p))} style={{
                          fontFamily: F.mono, fontSize: D.label, padding: "4px 12px",
                          border: `1px solid ${newLimit === String(p) ? "#111" : "#e2e2e2"}`,
                          background: newLimit === String(p) ? "#111" : "transparent",
                          color: newLimit === String(p) ? "#fff" : "#666",
                          cursor: "pointer", transition: "all 80ms",
                        }}>${p}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#bbb", marginTop: 16 }}>
                This key is shown once after creation. Save it somewhere secure.
              </p>
            </div>
            <div style={{ padding: "14px 24px 22px", display: "flex", justifyContent: "flex-end", gap: 8, borderTop: Bs }}>
              <Btn onClick={closeCreate} variant="ghost">Cancel</Btn>
              <Btn onClick={handleCreate} disabled={!newName.trim()}>Create key</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── Revoke modal ── */}
      {revokeTarget && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setRevokeTarget(null)}
        >
          <div style={{ background: "#fff", border: B, width: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.10)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "22px 24px 18px", borderBottom: Bs, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#0a0a0a", letterSpacing: 0 }}>Revoke key</h2>
              <button onClick={() => setRevokeTarget(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 2 }}><X size={16} /></button>
            </div>
            <div style={{ padding: "22px 24px" }}>
              <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", lineHeight: 1.7 }}>
                Revoking <strong style={{ color: "#111" }}>{revokeTarget.name}</strong> immediately invalidates it.
                All requests using this key will fail. This cannot be undone.
              </p>
            </div>
            <div style={{ padding: "14px 24px 22px", display: "flex", justifyContent: "flex-end", gap: 8, borderTop: Bs }}>
              <Btn onClick={() => setRevokeTarget(null)} variant="ghost">Cancel</Btn>
              <Btn onClick={handleRevoke} variant="danger">Revoke key</Btn>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .apikeys-header { padding: 24px 16px 20px !important; flex-direction: column !important; align-items: stretch !important; }
          .apikeys-create-desktop { display: none !important; }
          .apikeys-create-mobile { display: flex !important; }
          /* Remove spacer so 3 stats share full width equally */
          .stat-spacer { display: none !important; }
          .stat-cell { padding: 14px 16px !important; }
        }
        @media (max-width: 768px) {
          /* Hide Monthly limit column at tablet */
          .key-row { grid-template-columns: 140px 1fr 90px 64px !important; }
          .key-col-limit { display: none !important; }
        }
        @media (max-width: 520px) {
          /* 2-column: Name | Key+Status stacked */
          .key-row { grid-template-columns: 1fr auto !important; gap: 0 !important; padding: 12px 16px !important; }
          .key-col-limit { display: none !important; }
          .key-col-actions { display: none !important; }
          /* Name takes col 1, Status takes col 2 on row 1 */
          /* Key takes full row 2 */
          .key-row { grid-template-rows: auto auto; grid-template-areas: "name status" "key key"; }
          .key-row > *:nth-child(1) { grid-area: name; align-self: center; }
          .key-row > *:nth-child(2) { grid-area: key; padding-top: 6px; min-width: 0; overflow: hidden; }
          .key-row > *:nth-child(4) { grid-area: status; align-self: center; justify-self: end; }
          .key-chip { max-width: 180px !important; }
        }
      `}</style>
    </div>
  );
}
