import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Check, ExternalLink } from "lucide-react";
import { SEO, JsonLd, breadcrumbLd } from "../lib/seo";
import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";
const S = { sans: "var(--font-sans, 'Geist', system-ui, sans-serif)" };

/* ─── Shared styles ──────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%", height: 38, padding: "0 12px",
  fontFamily: S.sans, fontSize: WS.body, color: "#111",
  background: "#fff", border: B, borderRadius: 0,
  outline: "none", boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "auto" as const };
const textareaBase: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  fontFamily: S.sans, fontSize: WS.body, color: "#111",
  background: "#fff", border: B, borderRadius: 0,
  outline: "none", boxSizing: "border-box", resize: "vertical" as const, lineHeight: 1.6,
};
const labelStyle: React.CSSProperties = {
  fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600,
  color: "#777", letterSpacing: "0.04em", display: "block", marginBottom: 6,
};
const hintStyle: React.CSSProperties = { fontFamily: S.sans, fontSize: WS.meta, color: "#bbb", marginTop: 5, lineHeight: 1.5 };

const MODALITIES = ["Text", "Image", "Audio", "Video", "Embeddings", "Rerank", "TTS"];

/* ─── Small helpers ──────────────────────────────────────── */
function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "24px 32px", borderBottom: B }}>
      <div style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.06em", marginBottom: hint ? 6 : 16 }}>{title.toUpperCase()}</div>
      {hint && <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#888", lineHeight: 1.6, margin: "0 0 16px" }}>{hint}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>
        {label.toUpperCase()}
        {required && <span style={{ color: "#DC2626", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <div style={hintStyle}>{hint}</div>}
    </div>
  );
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      {options.map((opt) => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${value === opt ? blue : "#D0D0D0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 100ms" }}
            onClick={() => onChange(opt)}>
            {value === opt && <span style={{ width: 6, height: 6, borderRadius: "50%", background: blue }} />}
          </span>
          <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#444" }} onClick={() => onChange(opt)}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
      <span style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${checked ? blue : "#D5D5D5"}`, background: checked ? blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 100ms" }}
        onClick={onChange}>
        {checked && <Check size={9} color="#fff" strokeWidth={2.5} />}
      </span>
      <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#444", lineHeight: 1.6 }} onClick={onChange}>{children}</span>
    </label>
  );
}

function SubmitBtn({ disabled, label }: { disabled: boolean; label: string }) {
  return (
    <button type="submit" disabled={disabled} style={{
      fontFamily: S.sans, fontSize: WS.body, fontWeight: 600,
      color: "#fff", background: disabled ? "#ccc" : "#111",
      border: "none", padding: "10px 24px", borderRadius: 0,
      cursor: disabled ? "not-allowed" : "pointer", transition: "background 120ms",
    }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "#2a2a2a"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "#111"; }}
    >{label}</button>
  );
}

function Badge({ label, variant }: { label: string; variant: "community" | "verified" }) {
  const cfg = variant === "community"
    ? { bg: "#FFF7ED", border: "#FED7AA", text: "#92400E" }
    : { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" };
  return (
    <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: cfg.text, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "2px 9px", borderRadius: 4 }}>{label}</span>
  );
}

/* ─── Community form ─────────────────────────────────────── */
function CommunityForm({ onSuccess }: { onSuccess: () => void }) {
  const [name,      setName]      = useState("");
  const [slug,      setSlug]      = useState("");
  const [label,     setLabel]     = useState("");
  const [email,     setEmail]     = useState("");
  const [telegram,  setTelegram]  = useState("");
  const [whatsapp,  setWhatsapp]  = useState("");
  const [authType,  setAuthType]  = useState("Authorization Bearer");
  const [apiKey,    setApiKey]    = useState("");
  const [baseUrl,   setBaseUrl]   = useState("");
  const [modelsUrl, setModelsUrl] = useState("");
  const [logged,    setLogged]    = useState("No");
  const [training,  setTraining]  = useState("No");
  const [confirmed, setConfirmed] = useState(false);

  const hasContact = !!(email || telegram || whatsapp);
  const canSubmit  = name && slug && apiKey && baseUrl && modelsUrl && hasContact && confirmed;

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (canSubmit) onSuccess(); };

  return (
    <form onSubmit={handleSubmit}>
      {/* Intro strip */}
      <div style={{ padding: "20px 32px", borderBottom: B, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#111", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            Community provider <Badge label="Fast listing" variant="community" />
          </div>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
            For self-submitted provider gateways that want fast listing. OpenModels will test your API access and /models endpoint before listing your routes as Community supply.
          </p>
        </div>
      </div>

      {/* 1. Provider */}
      <Section title="Provider">
        <Field label="Provider name" required>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Neolink" style={inputStyle} />
        </Field>
        <Field label="Desired slug" required hint="Lowercase letters, numbers, and hyphens only.">
          <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="neolink" style={inputStyle} />
        </Field>
        <Field label="Provider label">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Tencent · Gemini · Claude · Grok" style={inputStyle} />
        </Field>
      </Section>

      {/* 2. Contact */}
      <Section title="Contact" hint="Provide at least one contact method.">
        <Field label="Email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="support@openmodels.market" type="email" style={inputStyle} />
        </Field>
        <Field label="Telegram">
          <input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@openmodels" style={inputStyle} />
        </Field>
        <Field label="WhatsApp">
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+1 000 000 0000" style={inputStyle} />
        </Field>
        {!hasContact && <p style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#DC2626", margin: 0 }}>At least one contact method is required.</p>}
      </Section>

      {/* 3. API access */}
      <Section title="API access">
        <Field label="Auth type" required>
          <select value={authType} onChange={(e) => setAuthType(e.target.value)} style={selectStyle}>
            {["Authorization Bearer", "API Key", "Custom header"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Provider API key" required hint="Used only for validation and route testing. Never shown publicly.">
          <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter provider API key" type="password" style={inputStyle} />
        </Field>
        <Field label="API Base URL" required>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.provider.com/v1" style={inputStyle} />
        </Field>
        <Field label="URL to /models API" required hint="Your /models endpoint must return available models, pricing, context length, and readiness status.">
          <input value={modelsUrl} onChange={(e) => setModelsUrl(e.target.value)} placeholder="https://api.provider.com/v1/models" style={inputStyle} />
        </Field>
      </Section>

      {/* 4. Basic data policy */}
      <Section title="Basic data policy">
        <Field label="Prompts/completions may be logged?" required>
          <RadioGroup options={["Yes", "No"]} value={logged} onChange={setLogged} />
        </Field>
        <Field label="Used for training?" required>
          <RadioGroup options={["Yes", "No"]} value={training} onChange={setTraining} />
        </Field>
      </Section>

      {/* 5. Confirmation */}
      <div style={{ padding: "24px 32px", borderBottom: B }}>
        <Checkbox checked={confirmed} onChange={() => setConfirmed((v) => !v)}>
          I confirm that this provider gateway can serve the listed model routes and that OpenModels may test the submitted API before listing.<span style={{ color: "#DC2626", marginLeft: 3 }}>*</span>
        </Checkbox>
      </div>

      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        <SubmitBtn disabled={!canSubmit} label="Submit for validation" />
        <a href="/contact" style={{ fontFamily: S.sans, fontSize: WS.body, color: "#888", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
        >Contact us</a>
      </div>
    </form>
  );
}

/* ─── Verified form ──────────────────────────────────────── */
function VerifiedForm({ onSuccess }: { onSuccess: () => void }) {
  const [website,       setWebsite]       = useState("");
  const [name,          setName]          = useState("");
  const [legalName,     setLegalName]     = useState("");
  const [slug,          setSlug]          = useState("");
  const [label,         setLabel]         = useState("");
  const [desc,          setDesc]          = useState("");
  const [bizEmail,      setBizEmail]      = useState("");
  const [telegram,      setTelegram]      = useState("");
  const [whatsapp,      setWhatsapp]      = useState("");
  const [authType,      setAuthType]      = useState("Authorization Bearer");
  const [apiKey,        setApiKey]        = useState("");
  const [baseUrl,       setBaseUrl]       = useState("");
  const [modelsUrl,     setModelsUrl]     = useState("");
  const [locations,     setLocations]     = useState("");
  const [modalities,    setModalities]    = useState<string[]>(["Text"]);
  const [logging,       setLogging]       = useState("Not logged");
  const [retention,     setRetention]     = useState("None");
  const [training,      setTraining]      = useState("Not used for training");
  const [policyNotes,   setPolicyNotes]   = useState("");
  const [authDetails,   setAuthDetails]   = useState("");
  const [statusPage,    setStatusPage]    = useState("");
  const [sla,           setSla]           = useState("");
  const [confirmed,     setConfirmed]     = useState(false);

  const toggleMod = (m: string) => setModalities((p) => p.includes(m) ? p.filter((x) => x !== m) : [...p, m]);

  const canSubmit = website && name && legalName && slug && bizEmail && apiKey && baseUrl && modelsUrl && locations && modalities.length > 0 && authDetails && confirmed;

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (canSubmit) onSuccess(); };

  return (
    <form onSubmit={handleSubmit}>
      {/* Intro strip */}
      <div style={{ padding: "20px 32px", borderBottom: B }}>
        <div style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#111", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          Apply for Verified <Badge label="Manual review" variant="verified" />
        </div>
        <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
          For providers that want to be listed as Verified supply. OpenModels manually reviews authorization, pricing, reliability, availability, and data policy before approval.
        </p>
      </div>

      {/* 1. Provider identity */}
      <Section title="Provider identity">
        <Field label="Website" required>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://openmodels.market" style={inputStyle} />
        </Field>
        <Field label="Provider name" required>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Neolink" style={inputStyle} />
        </Field>
        <Field label="Company legal name" required>
          <input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Neolink Technologies Ltd." style={inputStyle} />
        </Field>
        <Field label="Desired slug" required hint="Lowercase letters, numbers, and hyphens only.">
          <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="neolink" style={inputStyle} />
        </Field>
        <Field label="Provider label">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Tencent · Gemini · Claude · Grok" style={inputStyle} />
        </Field>
        <Field label="Provider description">
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Briefly describe your model supply, infrastructure, pricing, and regions." style={{ ...textareaBase, height: 90 }} />
        </Field>
      </Section>

      {/* 2. Contact */}
      <Section title="Contact">
        <Field label="Business email" required>
          <input value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} placeholder="business@provider.com" type="email" style={inputStyle} />
        </Field>
        <Field label="Telegram">
          <input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@openmodels" style={inputStyle} />
        </Field>
        <Field label="WhatsApp">
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+1 000 000 0000" style={inputStyle} />
        </Field>
      </Section>

      {/* 3. API access */}
      <Section title="API access">
        <Field label="Auth type" required>
          <select value={authType} onChange={(e) => setAuthType(e.target.value)} style={selectStyle}>
            {["Authorization Bearer", "API Key", "Custom header"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Provider API key" required hint="Used only for review and route testing. Stored securely and never shown publicly.">
          <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter provider API key" type="password" style={inputStyle} />
        </Field>
        <Field label="API Base URL" required>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.getopenmodels.com/v1" style={inputStyle} />
        </Field>
        <Field label="URL to /models API" required hint="Your /models endpoint should return model availability, pricing, context length, modalities, and readiness status.">
          <input value={modelsUrl} onChange={(e) => setModelsUrl(e.target.value)} placeholder="https://api.getopenmodels.com/v1/models" style={inputStyle} />
        </Field>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: S.sans, fontSize: WS.meta, color: blue, textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >View /models schema requirements <ExternalLink size={10} /></a>
      </Section>

      {/* 4. Inference capability */}
      <Section title="Inference capability">
        <Field label="Inference locations" required hint="Regions or country codes where inference is served.">
          <input value={locations} onChange={(e) => setLocations(e.target.value)} placeholder="US, EU, SG" style={inputStyle} />
        </Field>
        <Field label="Supported output modalities" required>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 12px", marginTop: 2 }}>
            {MODALITIES.map((m) => {
              const checked = modalities.includes(m);
              return (
                <label key={m} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${checked ? blue : "#D5D5D5"}`, background: checked ? blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 100ms" }}
                    onClick={() => toggleMod(m)}>
                    {checked && <Check size={9} color="#fff" strokeWidth={2.5} />}
                  </span>
                  <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#444" }} onClick={() => toggleMod(m)}>{m}</span>
                </label>
              );
            })}
          </div>
        </Field>
      </Section>

      {/* 5. Data policy */}
      <Section title="Data policy">
        <Field label="Prompt/completion logging" required>
          <select value={logging} onChange={(e) => setLogging(e.target.value)} style={selectStyle}>
            {["Not logged", "Logged temporarily", "Logged for abuse monitoring", "Other"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Retention period">
          <select value={retention} onChange={(e) => setRetention(e.target.value)} style={selectStyle}>
            {["None", "< 24 hours", "7 days", "30 days", "Custom"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Training use" required>
          <RadioGroup options={["Not used for training", "May be used for training"]} value={training} onChange={setTraining} />
        </Field>
        <Field label="Data policy notes">
          <textarea value={policyNotes} onChange={(e) => setPolicyNotes(e.target.value)} placeholder="Add details about logging, retention, abuse monitoring, or training policy." style={{ ...textareaBase, height: 100 }} />
        </Field>
      </Section>

      {/* 6. Authorization */}
      <Section title="Authorization">
        <Field label="Authorization details" required>
          <textarea value={authDetails} onChange={(e) => setAuthDetails(e.target.value)} placeholder="Describe your model serving rights, provider agreements, or authorization to serve these routes." style={{ ...textareaBase, height: 100 }} />
        </Field>
        <Field label="Status page URL">
          <input value={statusPage} onChange={(e) => setStatusPage(e.target.value)} placeholder="https://status.provider.com" style={inputStyle} />
        </Field>
        <Field label="SLA / uptime commitment">
          <input value={sla} onChange={(e) => setSla(e.target.value)} placeholder="99.9% monthly uptime" style={inputStyle} />
        </Field>
      </Section>

      {/* 7. Confirmation */}
      <div style={{ padding: "24px 32px", borderBottom: B }}>
        <Checkbox checked={confirmed} onChange={() => setConfirmed((v) => !v)}>
          I confirm that this provider has authorization to serve the listed model routes, that the submitted data policy is accurate, and that OpenModels may test the submitted API during review.<span style={{ color: "#DC2626", marginLeft: 3 }}>*</span>
        </Checkbox>
      </div>

      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        <SubmitBtn disabled={!canSubmit} label="Submit for Verified review" />
        <a href="/contact" style={{ fontFamily: S.sans, fontSize: WS.body, color: "#888", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
        >Contact us</a>
      </div>
    </form>
  );
}

/* ─── Success state ──────────────────────────────────────── */
function Success({ tab }: { tab: "community" | "verified" }) {
  const navigate = useNavigate();
  const isCommunity = tab === "community";
  return (
    <div style={{ padding: "64px 32px", maxWidth: 560 }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Check size={18} color="#16A34A" strokeWidth={2.5} />
      </div>
      <h2 style={{ fontFamily: S.sans, fontSize: WS.card, fontWeight: 600, color: "#0a0a0a", marginBottom: 10 }}>
        {isCommunity ? "Submitted for validation" : "Submitted for Verified review"}
      </h2>
      <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.7, marginBottom: 8 }}>
        {isCommunity
          ? "OpenModels will test your API access and /models endpoint. Providers that pass validation may be listed as Community supply automatically."
          : "OpenModels will manually review your provider access, authorization, pricing, reliability, and data policy before listing any route as Verified supply."}
      </p>
      <p style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#aaa", marginBottom: 24 }}>We usually respond within 3–5 business days.</p>
      <button onClick={() => navigate("/")} style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", background: "none", border: B, padding: "8px 16px", cursor: "pointer", borderRadius: 0, transition: "background 100ms" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >Back to OpenModels</button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export function ProviderApplyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"community" | "verified">("community");
  const [successTab, setSuccessTab] = useState<"community" | "verified" | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: S.sans }}>
      <SEO
        title="Become a Provider | OpenModels"
        description="List your LLM token routes on OpenModels. Submit community routes quickly or apply for verified provider review."
        path="/providers/apply"
      />
      <JsonLd id="breadcrumb-providers-apply" data={breadcrumbLd([{name:"OpenModels",url:"https://openmodels.market"},{name:"Become a Provider",url:"https://openmodels.market/providers/apply"}])} />
      <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: B, borderRight: B }}>

        {/* Back nav */}
        <div style={{ padding: "12px 28px", borderBottom: B }}>
          <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontFamily: S.sans, fontSize: WS.body, color: "#888", padding: 0, transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          ><ChevronLeft size={13} strokeWidth={1.5} />OpenModels</button>
        </div>

        {/* Page header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", display: "block", marginBottom: 10 }}>PROVIDER APPLICATION</span>
          <h1 style={{ fontFamily: S.sans, fontSize: WS.section, fontWeight: 600, color: "#0a0a0a", marginBottom: 10, letterSpacing: 0 }}>Become an OpenModels provider</h1>
          <p style={{ fontFamily: S.sans, fontSize: WS.body, color: "#555", lineHeight: 1.7, maxWidth: 580, margin: "0 0 16px" }}>
            Connect your provider gateway to OpenModels. Community providers can be listed after automated validation. Verified providers require manual review before listing.
          </p>
          <div style={{ display: "inline-block", background: "#FFFBEB", border: "1px solid #FDE68A", padding: "8px 14px" }}>
            <span style={{ fontFamily: S.sans, fontSize: WS.meta, color: "#92400E" }}>
              Community supply is self-submitted and labeled experimental. Verified supply is manually reviewed by OpenModels.
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="apply-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", alignItems: "start" }}>

          {/* ── Left: Tabs + form ── */}
          <div style={{ borderRight: B }}>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: B }}>
              {(["community", "verified"] as const).map((t) => {
                const active = tab === t;
                return (
                  <button key={t} onClick={() => { setTab(t); setSuccessTab(null); }} style={{
                    fontFamily: S.sans, fontSize: WS.body, fontWeight: active ? 600 : 400,
                    color: active ? "#111" : "#888", background: "none", border: "none",
                    borderBottom: `2px solid ${active ? "#111" : "transparent"}`,
                    padding: "12px 24px", cursor: "pointer", transition: "color 100ms",
                    marginBottom: -1,
                  }}>
                    {t === "community" ? "Community" : "Apply for Verified"}
                  </button>
                );
              })}
            </div>

            {/* Form or success */}
            {successTab === tab
              ? <Success tab={tab} />
              : tab === "community"
                ? <CommunityForm onSuccess={() => setSuccessTab("community")} />
                : <VerifiedForm onSuccess={() => setSuccessTab("verified")} />
            }
          </div>

          {/* ── Right: sidebar ── */}
          <div style={{ padding: "28px 24px", position: "sticky" as const, top: 0 }}>
            <div style={{ fontFamily: S.sans, fontSize: WS.body, fontWeight: 600, color: "#0a0a0a", marginBottom: 20 }}>Supply trust levels</div>

            {/* Community */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#92400E", background: "#FFF7ED", border: "1px solid #FED7AA", padding: "1px 8px", borderRadius: 4 }}>Community</span>
              </div>
              {["Self-submitted provider gateway", "Automated validation", "Fast listing", "Experimental label"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D97706", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: Bs, paddingTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontFamily: S.sans, fontSize: WS.meta, fontWeight: 600, color: "#1D4ED8", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 8px", borderRadius: 4 }}>Verified</span>
              </div>
              {["Manual review", "Authorization review", "Reliability and data policy review", "Eligible for default marketplace routes"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: S.sans, fontSize: WS.body, color: "#666", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .apply-grid { grid-template-columns: 1fr !important; }
          .apply-grid > div:last-child { border-top: 1px solid #e2e2e2; }
        }
      `}</style>
    </div>
  );
}
