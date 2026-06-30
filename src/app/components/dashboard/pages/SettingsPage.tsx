import React, { useState } from "react";
import { User, CreditCard, Trash2, Check, AlertTriangle, Lock, X, ChevronDown } from "lucide-react";
import { T, F } from "../../../lib/type";
import { B, Bs, blue } from "../shared";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      {children}
      {hint && <div style={{ fontFamily: F.sans, fontSize: T.xs, color: "#bbb", marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", height: 38, border: focused ? `1px solid ${blue}` : B,
        padding: "0 12px", fontFamily: F.sans, fontSize: T.sm, color: "#111",
        outline: "none", boxSizing: "border-box" as const, background: "#fff",
        transition: "border-color 150ms",
      }}
    />
  );
}

/* ── Section: Account ── */

function AccountSection() {
  const [email,    setEmail]    = useState("team@example.com");
  const [language, setLanguage] = useState("English");
  const [saved,    setSaved]    = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ maxWidth: 400 }}>
      <Field label="Email address" hint="Used for login and receipts.">
        <TextInput value={email} onChange={setEmail} type="email" />
      </Field>

      <div style={{ marginTop: 18, marginBottom: 18 }}>
        <label style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
          LANGUAGE
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            width: "100%", height: 38, padding: "0 12px",
            fontFamily: F.sans, fontSize: T.sm, fontWeight: 400, color: "#111",
            background: "#fff", border: B,
            borderRadius: 0, outline: "none", cursor: "pointer",
            boxSizing: "border-box" as const,
            appearance: "auto",
          }}
        >
          {["English", "Chinese", "Japanese", "Arabic"].map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <div style={{ fontFamily: F.sans, fontSize: T.xs, color: "#bbb", marginTop: 5 }}>
          Used across your OpenModels dashboard.
        </div>
      </div>

      <button onClick={save} style={{
        fontFamily: F.sans, fontSize: T.sm, fontWeight: 700,
        color: saved ? "#16A34A" : "#fff",
        background: saved ? "#f0fdf4" : "#111",
        border: saved ? "1px solid #bbf7d0" : "none",
        padding: "9px 24px", cursor: "pointer", transition: "all 150ms",
        display: "flex", alignItems: "center", gap: 6, letterSpacing: "-0.01em",
        borderRadius: 6,
      }}
        onMouseEnter={(e) => { if (!saved) e.currentTarget.style.background = "#2a2a2a"; }}
        onMouseLeave={(e) => { if (!saved) e.currentTarget.style.background = saved ? "#f0fdf4" : "#111"; }}
      >
        {saved && <Check size={13} />}
        {saved ? "Account updated" : "Save changes"}
      </button>
    </div>
  );
}

/* ── Add card form ── */

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
}

function detectBrand(num: string): "visa" | "mc" | "amex" | null {
  const d = num.replace(/\D/g, "");
  if (d.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mc";
  if (/^3[47]/.test(d)) return "amex";
  return null;
}

function CardBadge({ brand }: { brand: "visa" | "mc" | "amex" | null }) {
  if (!brand) return <div style={{ width: 36, height: 24, background: "#f0f0f0", border: B }} />;
  const map = {
    visa: { bg: "#1a1f71", label: "VISA",  color: "#fff" },
    mc:   { bg: "#eb001b", label: "MC",    color: "#fff" },
    amex: { bg: "#2e77bc", label: "AMEX",  color: "#fff" },
  };
  const s = map[brand];
  return (
    <div style={{ width: 36, height: 24, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 700, color: s.color, letterSpacing: "0.04em" }}>{s.label}</span>
    </div>
  );
}

function AddCardForm({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry]   = useState("");
  const [cvc, setCvc]         = useState("");
  const [name, setName]       = useState("");
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const brand = detectBrand(cardNum);
  const isValid = cardNum.replace(/\D/g, "").length >= 15 && expiry.replace(/\D/g, "").length === 4 && cvc.length >= 3 && name.trim().length > 0;

  const handleSave = () => {
    if (!isValid || saving) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(onSave, 800); }, 1200);
  };

  const inputStyle = (key: string) => ({
    width: "100%", height: 38,
    border: focused === key ? `1px solid ${blue}` : B,
    padding: "0 12px", fontFamily: F.mono, fontSize: T.sm, color: "#111",
    outline: "none", boxSizing: "border-box" as const, background: "#fff",
    transition: "border-color 150ms", letterSpacing: "0.04em",
  });

  return (
    <div style={{ border: B, background: "#fafafa", padding: "20px" }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CardBadge brand={brand} />
          <span style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.06em" }}>NEW CARD</span>
        </div>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", display: "flex", padding: 2 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#bbb")}
        ><X size={14} /></button>
      </div>

      {/* Card number */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.06em", marginBottom: 6 }}>CARD NUMBER</div>
        <input
          value={cardNum}
          onChange={(e) => setCardNum(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          onFocus={() => setFocused("card")}
          onBlur={() => setFocused(null)}
          style={inputStyle("card")}
        />
      </div>

      {/* Expiry + CVC */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.06em", marginBottom: 6 }}>EXPIRY</div>
          <input
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM / YY"
            onFocus={() => setFocused("exp")}
            onBlur={() => setFocused(null)}
            style={inputStyle("exp")}
          />
        </div>
        <div>
          <div style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.06em", marginBottom: 6 }}>CVC</div>
          <input
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="•••"
            onFocus={() => setFocused("cvc")}
            onBlur={() => setFocused(null)}
            style={{ ...inputStyle("cvc"), letterSpacing: "0.2em" }}
          />
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.06em", marginBottom: 6 }}>NAME ON CARD</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle("name"), fontFamily: F.sans, letterSpacing: "normal" }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Lock size={11} color="#bbb" strokeWidth={2} />
          <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#bbb" }}>Secured · data never stored here</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ fontFamily: F.sans, fontSize: T.sm, color: "#777", background: "none", border: B, padding: "8px 16px", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={!isValid || saving} style={{
            fontFamily: F.sans, fontSize: T.sm, fontWeight: 700,
            color: saved ? "#16A34A" : "#fff",
            background: saved ? "#f0fdf4" : (!isValid || saving) ? "#d0d0d0" : "#111",
            border: saved ? "1px solid #bbf7d0" : "none",
            padding: "8px 20px", cursor: isValid && !saving ? "pointer" : "not-allowed",
            transition: "all 150ms", display: "flex", alignItems: "center", gap: 6,
          }}>
            {saved ? <><Check size={13} />Saved</> : saving ? "Saving…" : "Save card"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Billing Profile ── */

function BillingProfileSection() {
  const [form, setForm] = useState({
    company: "", email: "", country: "",
    address1: "", address2: "", city: "", state: "", postal: "", taxId: "",
  });
  const [open,   setOpen]   = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));
  const hasSaved = form.company.trim() && form.email.trim() && form.country.trim();

  /* Summary line shown in collapsed state when profile is filled */
  const summary = hasSaved
    ? [form.company, form.email, form.country].filter(Boolean).join(" · ")
    : null;

  const canSave  = !!form.company.trim() && !!form.email.trim() && !!form.country.trim();

  const handleSave = () => {
    if (!canSave || status === "saving") return;
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setOpen(false);            /* collapse on success */
      setTimeout(() => setStatus("idle"), 3000);
    }, 1100);
  };

  const inp = (focused: boolean): React.CSSProperties => ({
    width: "100%", height: 36, border: focused ? `1px solid ${blue}` : B,
    padding: "0 10px", fontFamily: F.sans, fontSize: T.sm, color: "#111",
    outline: "none", boxSizing: "border-box" as const, background: "#fff",
    transition: "border-color 150ms",
  });

  function Input({ field, placeholder, type = "text" }: { field: keyof typeof form; placeholder?: string; type?: string }) {
    const [focused, setFocused] = useState(false);
    return (
      <input type={type} value={form[field]} onChange={(e) => set(field)(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={inp(focused)} />
    );
  }

  const LBL = ({ text, req }: { text: string; req?: boolean }) => (
    <label style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#777", letterSpacing: "0.04em", display: "block", marginBottom: 5 }}>
      {text.toUpperCase()}{req && <span style={{ color: "#DC2626", marginLeft: 2 }}>*</span>}
    </label>
  );

  return (
    <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: Bs }}>
      <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111", marginBottom: 14 }}>Billing profile</div>

      {/* ── Outer border — identical to Payment method container ── */}
      <div style={{ border: B, borderRadius: 6, overflow: "hidden" }}>

        {/* Row — identical height/padding to payment card row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", minHeight: 68 }}>
          {hasSaved ? (
            /* Filled: company name + email */
            <div>
              <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 500, color: "#111", marginBottom: 2 }}>{form.company}</div>
              {form.email && <div style={{ fontFamily: F.sans, fontSize: T.xs, color: "#bbb" }}>{form.email}</div>}
            </div>
          ) : (
            /* Empty: label + add button */
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: F.sans, fontSize: T.sm, color: "#777" }}>Add company and invoice details</div>
              <button
                onClick={() => setOpen(true)}
                style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#555", background: "none", border: B, padding: "8px 18px", cursor: "pointer", transition: "border-color 100ms", width: "fit-content" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
              >+ Add billing details</button>
            </div>
          )}

          {/* Right — Edit link only when filled */}
          {hasSaved && (
            <button
              onClick={() => setOpen(!open)}
              style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 500, color: blue, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, transition: "opacity 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >Edit</button>
          )}
        </div>

        {/* Expanded form */}
        {open && (
          <>
            <div style={{ borderTop: B, padding: "20px 16px 16px" }}>
              <div className="billing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px", marginBottom: 20 }}>
                <div style={{ gridColumn: "1 / -1" }}><LBL text="Company / Legal name" req /><Input field="company" placeholder="Acme Inc." /></div>
                <div><LBL text="Billing email" req /><Input field="email" placeholder="billing@example.com" type="email" /></div>
                <div><LBL text="Country / Region" req /><Input field="country" placeholder="United States" /></div>
                <div style={{ gridColumn: "1 / -1" }}><LBL text="Address line 1" /><Input field="address1" placeholder="123 Main St" /></div>
                <div style={{ gridColumn: "1 / -1" }}><LBL text="Address line 2" /><Input field="address2" placeholder="Suite 100" /></div>
                <div><LBL text="City" /><Input field="city" placeholder="San Francisco" /></div>
                <div><LBL text="State / Province" /><Input field="state" placeholder="CA" /></div>
                <div><LBL text="Postal code" /><Input field="postal" placeholder="94107" /></div>
                <div><LBL text="Tax ID / VAT / EIN" /><Input field="taxId" placeholder="e.g. US123456789" /></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={handleSave}
                  disabled={!canSave || status === "saving"}
                  style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#fff", background: (!canSave || status === "saving") ? "#D0D0D0" : "#111", border: "none", padding: "8px 18px", borderRadius: 5, cursor: (!canSave || status === "saving") ? "not-allowed" : "pointer", transition: "background 150ms" }}
                  onMouseEnter={(e) => { if (canSave && status === "idle") e.currentTarget.style.background = "#2a2a2a"; }}
                  onMouseLeave={(e) => { if (status === "idle") e.currentTarget.style.background = canSave ? "#111" : "#D0D0D0"; }}
                >
                  {status === "saving" ? "Saving…" : "Save billing profile"}
                </button>
                <button onClick={() => setOpen(false)} style={{ fontFamily: F.sans, fontSize: T.sm, color: "#999", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Cancel
                </button>
                {status === "error" && (
                  <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#DC2626", display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertTriangle size={12} /> Could not save billing profile. Try again.
                  </span>
                )}
              </div>
            </div>
            <div style={{ padding: "10px 16px", borderTop: Bs, background: "#FAFAFA" }}>
              <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#C0C0C0" }}>
                This information is used by Stripe for invoices and receipts. Tax ID may be verified by Stripe.
              </span>
            </div>
          </>
        )}
      </div>

      <style>{`@media (max-width: 600px) { .billing-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

/* ── Section: Billing ── */

function BillingSection() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const currentPlan = { name: "Go", price: "$5/mo", creditsLine: "Adds $6 credits monthly", nextBilling: "Jul 22, 2026" };

  const invoices = [
    { date: "Jun 1, 2026",  amount: "$50.00", status: "Paid", id: "INV-0012" },
    { date: "May 12, 2026", amount: "$20.00", status: "Paid", id: "INV-0011" },
    { date: "Apr 28, 2026", amount: "$20.00", status: "Paid", id: "INV-0010" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Subscription */}
      <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: Bs }}>
        <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111", marginBottom: 14 }}>Subscription</div>
        <div style={{ border: B, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111" }}>{currentPlan.name}</span>
                <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#0047FF", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "1px 6px", borderRadius: 999 }}>Current</span>
              </div>
              <div style={{ fontFamily: F.sans, fontSize: T.xs, color: "#777" }}>{currentPlan.price} · {currentPlan.creditsLine}</div>
              <div style={{ fontFamily: F.sans, fontSize: T.xs, color: "#C0C0C0", marginTop: 2 }}>Next billing: {currentPlan.nextBilling}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 500, color: "#555", background: "none", border: B, padding: "5px 12px", borderRadius: 5, cursor: "pointer", transition: "border-color 80ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
              >Switch plan</button>
              <button
                onClick={() => setShowCancelConfirm(true)}
                style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 400, color: "#A3A3A3", background: "none", border: "none", padding: "0 4px", cursor: "pointer", transition: "color 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}
              >Cancel plan</button>
            </div>
          </div>
          {showCancelConfirm && (
            <div style={{ padding: "12px 16px", borderTop: Bs, background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#555" }}>Cancel your subscription at end of current billing period?</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowCancelConfirm(false)} style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 500, color: "#555", background: "none", border: B, padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}>Keep plan</button>
                <button onClick={() => setShowCancelConfirm(false)} style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 600, color: "#fff", background: "#dc2626", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}>Confirm cancel</button>
              </div>
            </div>
          )}
          <div style={{ padding: "10px 16px", borderTop: Bs, background: "#FAFAFA" }}>
            <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#C0C0C0" }}>
              Plan credits are added to your OpenModels balance each billing cycle. Credits already added never expire.
            </span>
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: Bs }}>
        <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111", marginBottom: 14 }}>Payment method</div>
        <div style={{ border: B, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 24, background: "#1a1f71", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>VISA</span>
            </div>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: T.sm, color: "#111" }}>Visa ending in <strong>4242</strong></div>
              <div style={{ fontFamily: F.sans, fontSize: T.xs, color: "#bbb" }}>Expires 08 / 2028</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 600, color: "#16A34A", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px" }}>Default</span>
            <button style={{ fontFamily: F.sans, fontSize: T.xs, color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
          </div>
        </div>

        {showAddCard
          ? <AddCardForm onCancel={() => setShowAddCard(false)} onSave={() => setShowAddCard(false)} />
          : (
            <button onClick={() => setShowAddCard(true)} style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#555", background: "none", border: B, padding: "8px 18px", cursor: "pointer", transition: "border-color 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
            >+ Add payment method</button>
          )
        }
      </div>

      {/* Billing profile */}
      <BillingProfileSection />

      {/* Invoice history */}
      <div>
        <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#111", marginBottom: 14 }}>Invoice history</div>
        <div style={{ border: B }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 60px", padding: "8px 16px", background: "#f7f7f7", borderBottom: B }}>
            {["Date", "Invoice", "Amount", ""].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 500, color: "#aaa" }}>{h}</span>
            ))}
          </div>
          {invoices.map((inv, i) => (
            <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 60px", padding: "11px 16px", borderBottom: i < invoices.length - 1 ? Bs : "none", alignItems: "center", transition: "background 80ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: F.sans, fontSize: T.sm, color: "#555" }}>{inv.date}</span>
              <span style={{ fontFamily: F.mono, fontSize: T.xs, color: "#888" }}>{inv.id}</span>
              <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 600, color: "#111" }}>{inv.amount}</span>
              <a href="#" style={{ fontFamily: F.sans, fontSize: T.xs, color: blue, textDecoration: "none" }}>PDF</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section: Danger zone ── */

function DangerSection() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText]     = useState("");

  return (
    <div>
      <div style={{ border: "1px solid #fecdd3", background: "#fff1f2", padding: "20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, color: "#9f1239", marginBottom: 4 }}>Revoke all API keys</div>
          <div style={{ fontFamily: F.sans, fontSize: T.sm, color: "#be123c", lineHeight: 1.6 }}>
            Immediately invalidates all API keys. Active requests will fail. You can create new keys afterward.
          </div>
        </div>
        <button style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 700, color: "#dc2626", background: "#fff", border: "1px solid #fca5a5", padding: "8px 16px", cursor: "pointer", flexShrink: 0, transition: "all 120ms" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fca5a5"; }}
        >Revoke all keys</button>
      </div>

      <div style={{ border: "1px solid #fecdd3", background: "#fff1f2", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <AlertTriangle size={14} style={{ color: "#dc2626", flexShrink: 0 }} />
          <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 700, color: "#9f1239" }}>Delete account</div>
        </div>
        <div style={{ fontFamily: F.sans, fontSize: T.sm, color: "#be123c", lineHeight: 1.6, marginBottom: 16 }}>
          Permanently deletes your account, all API keys, usage history, and remaining credit balance. This action cannot be undone.
        </div>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 700, color: "#fff", background: "#dc2626", border: "none", padding: "9px 20px", cursor: "pointer" }}>
            Delete my account
          </button>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #fca5a5", padding: "16px" }}>
            <div style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 500, color: "#333", marginBottom: 10 }}>
              Type <strong>delete my account</strong> to confirm:
            </div>
            <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete my account"
              style={{ width: "100%", height: 36, border: "1px solid #fca5a5", padding: "0 12px", fontFamily: F.mono, fontSize: T.xs, color: "#111", outline: "none", boxSizing: "border-box" as const, marginBottom: 12 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#dc2626")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#fca5a5")}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={confirmText !== "delete my account"}
                style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 700, color: "#fff", background: confirmText === "delete my account" ? "#dc2626" : "#e0e0e0", border: "none", padding: "8px 18px", cursor: confirmText === "delete my account" ? "pointer" : "not-allowed" }}>
                Confirm deletion
              </button>
              <button onClick={() => { setConfirmDelete(false); setConfirmText(""); }}
                style={{ fontFamily: F.sans, fontSize: T.sm, color: "#666", background: "none", border: B, padding: "8px 16px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main ── */

type Section = "account" | "billing" | "danger";

const sections: { id: Section; label: string; Icon: typeof User }[] = [
  { id: "account", label: "Account", Icon: User },
  { id: "billing", label: "Billing",  Icon: CreditCard },
  { id: "danger",  label: "Danger zone", Icon: Trash2 },
];

const labels: Record<Section, string> = {
  account: "Account",
  billing: "Billing",
  danger:  "Danger zone",
};

const descriptions: Record<Section, string> = {
  account: "Your login email address.",
  billing: "Payment method and top-up history.",
  danger:  "Irreversible actions. Proceed with caution.",
};

export function SettingsPage() {
  const [active, setActive] = useState<Section>("account");

  const content: Record<Section, React.ReactNode> = {
    account: <AccountSection />,
    billing: <BillingSection />,
    danger:  <DangerSection />,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", height: "100%", fontFamily: F.sans }}>

      {/* Settings nav */}
      <div style={{ borderRight: B, overflowY: "auto" }}>
        <div style={{ padding: "20px 0 8px" }}>
          <div style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: "#ccc", letterSpacing: "0.08em", padding: "0 20px", marginBottom: 8 }}>SETTINGS</div>
          {sections.map(({ id, label, Icon }) => {
            const isActive = active === id;
            const isDanger = id === "danger";
            return (
              <button key={id} onClick={() => setActive(id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9,
                padding: "8px 20px",
                background: isActive ? (isDanger ? "#fff1f2" : "#f0f4ff") : "none",
                border: "none",
                borderLeft: `2px solid ${isActive ? (isDanger ? "#dc2626" : blue) : "transparent"}`,
                cursor: "pointer", textAlign: "left", transition: "all 80ms",
                color: isActive ? (isDanger ? "#dc2626" : blue) : isDanger ? "#dc2626" : "#666",
              }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = isDanger ? "#fff1f2" : "#f7f7f7"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "none"; }}
              >
                <Icon size={14} strokeWidth={isActive ? 2 : 1.5} style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: isActive ? 500 : 400 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div style={{ overflowY: "auto" }}>
        <div style={{ padding: "32px 32px 24px", borderBottom: B }}>
          <span style={{ fontFamily: F.sans, fontSize: T.xs, fontWeight: 700, color: active === "danger" ? "#dc2626" : blue, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
            {active.toUpperCase()}
          </span>
          <h1 style={{ fontFamily: F.sans, fontSize: T.sm, fontWeight: 600, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 6, lineHeight: 1.2 }}>
            {labels[active]}
          </h1>
          <p style={{ fontFamily: F.sans, fontSize: T.sm, color: "#777", lineHeight: 1.65 }}>
            {descriptions[active]}
          </p>
        </div>
        <div style={{ padding: "28px 32px 40px" }}>
          {content[active]}
        </div>
      </div>
    </div>
  );
}
