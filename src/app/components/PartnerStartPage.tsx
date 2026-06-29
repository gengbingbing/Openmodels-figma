import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Check, X } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SEO } from "../lib/seo";
import { F, WS } from "../lib/type";

const blue = "#0047FF";
const B    = "1px solid #e2e2e2";
const Bs   = "1px solid #eeeeee";

/* ─── Model selector data ────────────────────────────────── */
const AVAILABLE_MODELS = [
  "llama-3.1-70b", "llama-3.1-8b", "deepseek-v3", "deepseek-r1",
  "qwen-2.5-72b", "qwen-2.5-coder-32b", "mistral-large", "mistral-7b",
  "gemma-2-27b", "minimax-m2.7",
];

const PLAN_DATA = [
  { id: "launch", label: "Launch", price: 29, modelLimit: 10,  recommended: false },
  { id: "growth", label: "Growth", price: 99, modelLimit: 50,  recommended: true  },
  { id: "scale",  label: "Scale",  price: 299, modelLimit: 200, recommended: false },
];

/* ─── Section header ─────────────────────────────────────── */
function SetupSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: B }}>
      <div style={{ padding: "16px 32px 0", borderBottom: Bs, marginBottom: 0 }}>
        <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{label}</span>
      </div>
      <div style={{ padding: "20px 32px 24px" }}>{children}</div>
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#777", display: "block", marginBottom: 5, letterSpacing: "0.04em" }}>
        {label.toUpperCase()}
      </label>
      {children}
      {hint && <div style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", height: 36, padding: "0 10px",
  fontFamily: F.sans, fontSize: WS.body, color: "#111",
  background: "#fff", border: B, borderRadius: 4,
  outline: "none", boxSizing: "border-box",
};

/* ─── Publish Plan Modal ─────────────────────────────────── */
function PublishModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (plan: string) => void }) {
  const [selected, setSelected] = useState("growth");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", border: B, borderRadius: 8, maxWidth: 560, width: "100%", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: B, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111", marginBottom: 3 }}>Choose a partner plan to publish</div>
            <div style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666" }}>Your marketplace is ready. Select a plan to publish it live.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0C0C0", padding: 4, display: "flex", transition: "color 100ms", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}
          ><X size={14} /></button>
        </div>
        {/* Plans */}
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {PLAN_DATA.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", background: selected === p.id ? "#F5F8FF" : "#FAFAFA",
              border: `1px solid ${selected === p.id ? blue : "#E5E5E5"}`,
              borderRadius: 6, cursor: "pointer", textAlign: "left", transition: "all 100ms",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${selected === p.id ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {selected === p.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: blue }} />}
                </span>
                <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>{p.label}</span>
                {p.recommended && <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: blue, background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 7px", borderRadius: 999 }}>Recommended</span>}
              </div>
              <span style={{ fontFamily: F.mono, fontSize: WS.body, fontWeight: 600, color: "#111" }}>${p.price}/mo</span>
            </button>
          ))}
        </div>
        {/* Footer */}
        <div style={{ padding: "12px 24px 20px", borderTop: Bs, display: "flex", gap: 8 }}>
          <button onClick={() => onConfirm(selected)} style={{ flex: 1, height: 36, fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#fff", background: blue, border: "none", borderRadius: 6, cursor: "pointer", transition: "opacity 120ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >Continue to payment</button>
          <button onClick={onClose} style={{ height: 36, padding: "0 16px", fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, background: "#fff", color: "#555", border: B, borderRadius: 6, cursor: "pointer", transition: "background 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export function PartnerStartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const goAuth = () => navigate("/", { state: { openAuth: true } });

  /* Form state */
  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [desc,        setDesc]        = useState("");
  const [slug,        setSlug]        = useState("");
  const [seoTitle,    setSeoTitle]    = useState("");
  const [seoDesc,     setSeoDesc]     = useState("");
  const [markup,      setMarkup]      = useState("20");
  const [selModels,   setSelModels]   = useState<string[]>([]);
  const [showModal,   setShowModal]   = useState(false);
  const [published,   setPublished]   = useState(false);

  const toggleModel = (m: string) =>
    setSelModels((p) => p.includes(m) ? p.filter((x) => x !== m) : [...p, m]);

  const handlePublish = (plan: string) => {
    setShowModal(false);
    setPublished(true);
  };

  if (published) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
        <Header onDashboard={goAuth} />
        <div style={{ paddingTop: 84 }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B, padding: "80px 32px", textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Check size={20} color="#16A34A" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 10 }}>Marketplace published</h1>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", marginBottom: 24 }}>
              Your branded LLM token marketplace is now live and powered by OpenModels.
            </p>
            <a href="/partners" style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none" }}>← Back to Partner Program</a>
          </div>
        </div>
        <Footer onGetKey={goAuth} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: F.sans }}>
      <SEO title="Partner Setup | OpenModels" description="Configure your branded LLM token marketplace powered by OpenModels." path="/partner/start" />
      <Header onDashboard={goAuth} />

      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

          {/* Page intro */}
          <div style={{ padding: "28px 32px 24px", borderBottom: B }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>PARTNER SETUP</span>
            <h1 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 4, letterSpacing: 0 }}>Create your marketplace</h1>
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.55, margin: 0, maxWidth: 520 }}>
              Configure your brand, models, pricing, and SEO. Choose a plan only when you are ready to publish.
            </p>
          </div>

          {/* Brand */}
          <SetupSection label="Brand">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <Field label="Marketplace name">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="My LLM Marketplace" style={inputStyle} />
              </Field>
              <Field label="Support email">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" type="email" style={inputStyle} />
              </Field>
            </div>
            <Field label="Short description">
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What your marketplace offers in one or two sentences." style={{ ...inputStyle, height: 72, padding: "8px 10px", resize: "vertical" as const }} />
            </Field>
          </SetupSection>

          {/* Models */}
          <SetupSection label="Models">
            <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", margin: "0 0 14px" }}>
              Select models to list in your marketplace. Your plan determines the model limit.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AVAILABLE_MODELS.map((m) => {
                const on = selModels.includes(m);
                return (
                  <button key={m} onClick={() => toggleModel(m)} style={{
                    fontFamily: F.mono, fontSize: WS.meta, fontWeight: 500,
                    color: on ? "#fff" : "#555", background: on ? "#111" : "#F5F5F5",
                    border: `1px solid ${on ? "#111" : "#E5E5E5"}`,
                    padding: "4px 10px", borderRadius: 4, cursor: "pointer", transition: "all 100ms",
                  }}>{m}</button>
                );
              })}
            </div>
            {selModels.length > 0 && (
              <p style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3", margin: "10px 0 0" }}>{selModels.length} model{selModels.length !== 1 ? "s" : ""} selected</p>
            )}
          </SetupSection>

          {/* Pricing */}
          <SetupSection label="Pricing">
            <Field label="Default markup" hint="Custom pricing rules are available on Growth and Scale plans.">
              <div style={{ display: "flex", gap: 8 }}>
                {["10", "20", "30"].map((v) => (
                  <button key={v} onClick={() => setMarkup(v)} style={{ height: 34, padding: "0 16px", fontFamily: F.sans, fontSize: WS.body, fontWeight: markup === v ? 600 : 400, color: markup === v ? "#fff" : "#555", background: markup === v ? "#111" : "#F5F5F5", border: `1px solid ${markup === v ? "#111" : "#E5E5E5"}`, borderRadius: 4, cursor: "pointer", transition: "all 100ms" }}>{v}%</button>
                ))}
              </div>
            </Field>
          </SetupSection>

          {/* SEO */}
          <SetupSection label="SEO">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <Field label="SEO title">
                <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="My LLM Marketplace | Powered by OpenModels" style={inputStyle} />
              </Field>
              <Field label="URL slug" hint="openmodels.market/m/your-slug">
                <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} placeholder="my-marketplace" style={inputStyle} />
              </Field>
            </div>
            <Field label="Meta description">
              <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} placeholder="A brief description for search engines." style={{ ...inputStyle, height: 64, padding: "8px 10px", resize: "vertical" as const }} />
            </Field>
          </SetupSection>

          {/* Actions */}
          <div style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ height: 38, padding: "0 18px", fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#555", background: "#fff", border: B, borderRadius: 4, cursor: "pointer", transition: "background 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >Preview marketplace</button>
            <button onClick={() => setShowModal(true)} style={{ height: 38, padding: "0 18px", fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", borderRadius: 4, cursor: "pointer", transition: "opacity 120ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Publish marketplace</button>
          </div>

        </div>
      </div>

      <Footer onGetKey={goAuth} />

      {showModal && <PublishModal onClose={() => setShowModal(false)} onConfirm={handlePublish} />}

      <style>{`
        @media (max-width: 640px) {
          .setup-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
