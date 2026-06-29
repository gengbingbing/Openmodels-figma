import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CreditCard, ArrowDownLeft, ArrowUpRight, Gift, Copy, Check, X } from "lucide-react";
import { T, F } from "../../../lib/type";
import { B, Bs, blue, D } from "../shared";
import { copyText } from "../../../lib/clipboard";

const tooltipStyle = { fontFamily: "var(--font-sans, 'Geist', system-ui, sans-serif)", fontSize: 10, border: "1px solid #E5E5E5", borderRadius: 0, boxShadow: "none" };

const spendData = [
  { day: "Jun 1", spend: 0.00 }, { day: "Jun 2", spend: 0.32 }, { day: "Jun 3", spend: 0.58 },
  { day: "Jun 4", spend: 0.21 }, { day: "Jun 5", spend: 0.00 }, { day: "Jun 6", spend: 0.80 },
  { day: "Jun 7", spend: 1.40 }, { day: "Jun 8", spend: 0.44 }, { day: "Jun 9", spend: 0.00 },
  { day: "Jun 10", spend: 1.19 }, { day: "Jun 11", spend: 0.84 }, { day: "Jun 12", spend: 0.65 },
];

const transactions = [
  { date: "Jun 12", time: "14:23", type: "usage",    model: "qwen-2.5-72b",     tokens: "1.2M in · 280K out", amount: -0.42 },
  { date: "Jun 12", time: "09:11", type: "usage",    model: "deepseek-v3",      tokens: "820K in · 190K out", amount: -0.23 },
  { date: "Jun 11", time: "17:44", type: "usage",    model: "llama-3.1-70b",    tokens: "2.1M in · 510K out", amount: -0.84 },
  { date: "Jun 10", time: "11:08", type: "referral", model: "diana@llmlab.com", tokens: "",                    amount: +5.00 },
  { date: "Jun 10", time: "11:08", type: "usage",    model: "qwen-2.5-72b",     tokens: "3.4M in · 720K out", amount: -1.19 },
  { date: "Jun 09", time: "10:00", type: "topup",    model: "",                 tokens: "",                    amount: +50.00 },
  { date: "Jun 08", time: "16:02", type: "usage",    model: "mistral-large",    tokens: "980K in · 200K out", amount: -0.44 },
  { date: "Jun 07", time: "13:30", type: "usage",    model: "deepseek-v3",      tokens: "5.0M in · 1.1M out", amount: -1.40 },
  { date: "Jun 01", time: "09:00", type: "topup",    model: "",                 tokens: "",                    amount: +20.00 },
];

const PRESETS = [10, 25, 50, 100, 200];
const NETWORKS = ["Base", "Ethereum", "Solana"];
const WALLET   = "0x4a8F3b92c1D5e7f89034B2Ac5E6d1F0b4C8E3A7";

type PayMethod   = "card" | "crypto";
type CryptoStatus = "waiting" | "confirming" | "done";

/* ── tiny QR code placeholder ── */
function QRPlaceholder({ size = 88 }: { size?: number }) {
  const cells = 11;
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,1,0],
    [1,1,1,1,1,1,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,0],
    [1,0,1,1,0,1,1,1,1,0,1],
    [0,1,0,0,1,0,0,0,0,1,0],
    [1,1,1,0,1,1,1,0,1,0,1],
  ];
  const cell = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <rect width={size} height={size} fill="#fff" />
      {pattern.map((row, r) => row.map((v, c) => v
        ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#111" />
        : null
      ))}
    </svg>
  );
}

/* ── Plans Modal ─────────────────────────────────────────── */

const PLANS = [
  { id: "go",        eyebrow: "GO",          label: "Entry plan",           price: "$5",   unit: "/month",   creditsLine: "Adds $6 credits monthly",   extra: "20% extra credits", cta: "Subscribe",   blue: false, recommended: false, smallPrint: "Credits are added to your balance every billing cycle." },
  { id: "starter",   eyebrow: "STARTER",    label: "Light usage",          price: "$20",  unit: "/month",   creditsLine: "Adds $22 credits monthly",  extra: "10% extra credits", cta: "Subscribe",   blue: false, recommended: false, smallPrint: "Credits are added to your balance every billing cycle." },
  { id: "builder",   eyebrow: "BUILDER",    label: "Regular development",  price: "$100", unit: "/month",   creditsLine: "Adds $110 credits monthly", extra: "10% extra credits", cta: "Subscribe",   blue: true,  recommended: true,  smallPrint: "Best for developers with recurring API usage." },
  { id: "scale",     eyebrow: "SCALE",      label: "Production usage",     price: "$200", unit: "/month",   creditsLine: "Adds $230 credits monthly", extra: "15% extra credits", cta: "Subscribe",   blue: false, recommended: false, smallPrint: "For teams running production traffic on OpenModels." },
];

const SHARED_BENEFITS = [
  "Verified open-source model routes",
  "One OpenAI-compatible API key",
  "Auto lowest-price route by default",
  "Route-level usage billing",
  "Single credits balance",
  "Credits never expire",
];

function PlansModal({ onClose, currentPlanId, onPlanChange }: {
  onClose: () => void;
  currentPlanId?: string | null;
  onPlanChange?: (plan: { id: string; name: string; price: string; creditsLine: string }) => void;
}) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [activated, setActivated]   = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (id === currentPlanId) return;
    setProcessing(id);
    setTimeout(() => {
      setProcessing(null);
      setActivated(id);
      const plan = PLANS.find((p) => p.id === id);
      if (plan && onPlanChange) {
        onPlanChange({ id: plan.id, name: plan.eyebrow.charAt(0) + plan.eyebrow.slice(1).toLowerCase(), price: `${plan.price}${plan.unit}`, creditsLine: plan.creditsLine });
      }
    }, 1200);
  };

  // ESC closes modal
  useState(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div style={{
        background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8,
        boxShadow: "0 20px 56px rgba(0,0,0,0.10)",
        width: 820, maxWidth: "calc(100vw - 32px)", maxHeight: "80vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #EFEFEF", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 3 }}>Choose a monthly plan</div>
            <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#777" }}>Automatically add credits to your OpenModels balance every billing cycle.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#A3A3A3", padding: 4, display: "flex", transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Cards */}
        <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px" }}>
          {activated ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 8 }}>Plan updated</div>
              <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#777", marginBottom: 6 }}>Credits will be added to your balance next billing cycle.</div>
              <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginBottom: 24 }}>Plan changes apply next billing cycle. Credits already added never expire.</div>
              <button onClick={onClose} style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff", background: "#111", border: "none", padding: "0 24px", height: 36, borderRadius: 6, cursor: "pointer" }}>
                Done
              </button>
            </div>
          ) : (
            /* Unified container */
            <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>

              {/* Cards row — 4 col desktop, 2 col on narrow */}
              <div className="plans-modal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                {PLANS.map((plan, idx) => (
                  <div key={plan.id} style={{
                    background: "#fff",
                    borderRight: idx < PLANS.length - 1 ? "1px solid #E5E5E5" : "none",
                    display: "flex", flexDirection: "column",
                    position: "relative",
                  }}>
                    {plan.recommended && <div style={{ height: 2, background: "#0047FF", flexShrink: 0 }} />}
                    <div style={{ padding: "14px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>{plan.eyebrow}</span>
                        {plan.recommended && (
                          <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#0047FF", background: "#EFF4FF", border: "1px solid #BFDBFE", padding: "1px 7px", borderRadius: 999 }}>Recommended</span>
                        )}
                      </div>
                      <div style={{ fontFamily: F.sans, fontSize: 12, color: "#777", marginBottom: 10 }}>{plan.label}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 3 }}>
                        <span style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.02em", lineHeight: 1 }}>{plan.price}</span>
                        <span style={{ fontFamily: F.sans, fontSize: 12, color: "#999" }}>{plan.unit}</span>
                      </div>
                      <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: "#0047FF", marginBottom: plan.extra ? 3 : 12 }}>{plan.creditsLine}</div>
                      {plan.extra && (
                        <div style={{ fontFamily: F.sans, fontSize: 10, color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "inline-block", padding: "1px 6px", borderRadius: 999, marginBottom: 12, width: "fit-content" }}>
                          {plan.extra}
                        </div>
                      )}
                      <button
                        onClick={() => handleSelect(plan.id)}
                        disabled={!!processing}
                        style={{
                          width: "100%", height: 32, borderRadius: 5,
                          fontFamily: F.sans, fontSize: 12, fontWeight: 600,
                          cursor: processing ? "not-allowed" : "pointer", transition: "opacity 120ms",
                          ...(plan.blue
                            ? { background: "#0047FF", color: "#fff", border: "1px solid #0047FF" }
                            : { background: "#111", color: "#fff", border: "1px solid #111" }),
                          opacity: processing && processing !== plan.id ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { if (!processing) e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={(e) => { if (!processing) e.currentTarget.style.opacity = "1"; }}
                      >
                        {processing === plan.id ? "Processing…" : plan.id === currentPlanId ? "Current" : (currentPlanId ? "Switch" : plan.cta)}
                      </button>
                    </div>
                    <div style={{ padding: "8px 16px", marginTop: 12, borderTop: "1px solid #EFEFEF", background: "#FAFAFA" }}>
                      <p style={{ fontFamily: F.sans, fontSize: 10, color: "#A3A3A3", lineHeight: 1.5, margin: 0 }}>{plan.smallPrint}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* All plans include — container footer */}
              <div style={{ borderTop: "1px solid #E5E5E5", background: "#FAFAFA" }}>
                <div style={{ padding: "10px 16px 8px" }}>
                  <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.06em" }}>ALL PLANS INCLUDE</span>
                </div>
                <div className="modal-benefits-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "7px 20px", padding: "0 16px 12px" }}>
                  {SHARED_BENEFITS.map((b) => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={10} style={{ color: "#16A34A", flexShrink: 0 }} strokeWidth={2.5} />
                      <span style={{ fontFamily: F.sans, fontSize: 12, color: "#555" }}>{b}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 16px", borderTop: "1px solid #E5E5E5", background: "#F7F7F7" }}>
                  <p style={{ fontFamily: F.sans, fontSize: 11, color: "#A3A3A3", margin: 0 }}>
                    Plans add credits to your OpenModels balance. Usage is charged by actual token cost based on the selected provider route.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* thin spacer — footer removed, note is inside container */}
        <div style={{ height: 1, background: "#EFEFEF", flexShrink: 0 }} />
      </div>

      <style>{`
        @media (max-width: 680px) {
          .plans-modal-grid { grid-template-columns: 1fr 1fr !important; }
          .plans-modal-grid > *:nth-child(2) { border-right: none !important; }
          .plans-modal-grid > *:nth-child(1),
          .plans-modal-grid > *:nth-child(2) { border-bottom: 1px solid #E5E5E5; }
          .modal-benefits-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 420px) {
          .plans-modal-grid { grid-template-columns: 1fr !important; }
          .plans-modal-grid > * { border-right: none !important; border-bottom: 1px solid #E5E5E5; }
          .modal-benefits-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export function CreditsPage() {
  const [custom, setCustom]         = useState("");
  const [selected, setSelected]     = useState<number | null>(50);
  const [autoTopUp, setAutoTopUp]   = useState(false);
  const [payMethod, setPayMethod]   = useState<PayMethod>("card");
  const [cryptoModal, setCryptoModal] = useState(false);
  const [cryptoStatus, setCryptoStatus] = useState<CryptoStatus>("waiting");
  const [copied, setCopied]         = useState<string | null>(null);

  /* ── Current plan ── */
  const [currentPlan, setCurrentPlan] = useState<{ id: string; name: string; price: string; creditsLine: string } | null>(
    { id: "go", name: "Go", price: "$5/mo", creditsLine: "Adds $6 credits monthly" }
  );
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  /* ── Payment method ── */
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [cardNumber, setCardNumber]     = useState("");
  const [cardExpiry, setCardExpiry]     = useState("");
  const [cardCVC, setCardCVC]           = useState("");
  const [cardName, setCardName]         = useState("");
  const [savedCard, setSavedCard]       = useState<{ last4: string; brand: string } | null>(null);
  const [cardError, setCardError]       = useState("");

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const detectBrand = (num: string): string => {
    const n = num.replace(/\s/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^5[1-5]/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "Amex";
    return "Card";
  };

  const handleAddCard = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 16) { setCardError("Enter a valid 16-digit card number."); return; }
    if (cardExpiry.length < 5) { setCardError("Enter a valid expiry date (MM/YY)."); return; }
    if (cardCVC.length < 3)   { setCardError("Enter a valid CVC."); return; }
    if (!cardName.trim())      { setCardError("Enter the name on your card."); return; }
    setSavedCard({ last4: digits.slice(-4), brand: detectBrand(cardNumber) });
    setShowPayModal(false);
    setCardNumber(""); setCardExpiry(""); setCardCVC(""); setCardName(""); setCardError("");
  };

  const finalAmount = custom ? parseFloat(custom) || 0 : (selected ?? 0);

  const doCopy = (text: string, key: string) => {
    copyText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const openCryptoModal = () => { setCryptoStatus("waiting"); setCryptoModal(true); };

  const simulatePaid = () => {
    setCryptoStatus("confirming");
    setTimeout(() => setCryptoStatus("done"), 2000);
  };

  const statusLabel: Record<CryptoStatus, string> = {
    waiting:    "Waiting for payment",
    confirming: "Confirming on-chain…",
    done:       "Credits added ✓",
  };
  const statusColor: Record<CryptoStatus, string> = {
    waiting: "#999", confirming: "#d97706", done: "#16A34A",
  };

  /* ── Segmented control ── */
  const SegControl = () => (
    <div style={{ display: "flex", border: B, overflow: "hidden", height: 30 }}>
      {(["card", "crypto"] as PayMethod[]).map((m) => (
        <button key={m} onClick={() => setPayMethod(m)} style={{
          fontFamily: F.sans, fontSize: 12, fontWeight: 500,
          padding: "0 14px", border: "none", cursor: "pointer",
          background: payMethod === m ? "#111" : "#fff",
          color: payMethod === m ? "#fff" : "#888",
          transition: "all 100ms",
        }}>
          {m === "card" ? "Card" : "Crypto"}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: F.sans }}>

      {/* Header */}
      <div style={{ padding: "32px 28px 24px", borderBottom: B }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <CreditCard size={11} color={blue} strokeWidth={2} />
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em" }}>CREDITS</span>
        </span>
        <h1 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 8, lineHeight: 1.2 }}>
          Your credit balance
        </h1>
        <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#777", lineHeight: 1.65 }}>
          Shared across all models and API keys. Credits never expire.
        </p>
      </div>

      {/* ── Current Plan ── */}
      <div style={{ borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>CURRENT PLAN</span>
          {currentPlan ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#111" }}>{currentPlan.name}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#777" }}>{currentPlan.price} · {currentPlan.creditsLine}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0" }}>· Next billing: Jul 22, 2026</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#777" }}>No active plan</span>
              <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0" }}>· Choose a monthly plan or add credits manually.</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowPlansModal(true)}
          style={{
            fontFamily: F.sans, fontSize: D.body, fontWeight: 500,
            color: "#555", background: "none", border: "1px solid #E5E5E5",
            padding: "0 14px", height: 32, borderRadius: 6, cursor: "pointer",
            transition: "border-color 100ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
        >
          {currentPlan ? "Switch plan" : "View plans"}
        </button>
      </div>

      {/* Balance + chart */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", borderBottom: B }} className="credits-top">
        <div style={{ borderRight: B, padding: "28px" }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 10 }}>CURRENT BALANCE</div>
          <div style={{ fontFamily: F.sans, fontSize: D.numLg, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.04em", lineHeight: 1 }}>$42.30</div>
          <div style={{ display: "flex", gap: 20, marginTop: 18, paddingTop: 18, borderTop: Bs }}>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#bbb", marginBottom: 4 }}>This month</div>
              <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "#dc2626" }}>−$5.21</div>
            </div>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#bbb", marginBottom: 4 }}>Last top-up</div>
              <div style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "#16A34A" }}>+$50.00</div>
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: Bs }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 6 }}>EST. RUNWAY</div>
            <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#555" }}>
              ~<strong style={{ color: "#0a0a0a", fontWeight: 700 }}>8.1 months</strong> at current pace
            </div>
          </div>
        </div>
        <div style={{ padding: "24px 28px 20px" }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 16 }}>DAILY SPEND — JUNE 2026</div>
          <ResponsiveContainer key="credits-spend" width="100%" height={130}>
            <AreaChart data={spendData} margin={{ top: 4, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="csg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111" stopOpacity={0.07} />
                  <stop offset="95%" stopColor="#111" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f2f2f2" />
              <XAxis dataKey="day" tick={{ fontFamily: F.sans, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontFamily: F.mono, fontSize: D.label, fill: "#ccc" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={30} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Spend"]} contentStyle={tooltipStyle} cursor={{ stroke: "#e2e2e2", strokeWidth: 1 }} animationDuration={0} />
              <Area dataKey="spend" stroke="#111" strokeWidth={1.5} fill="url(#csg)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Add credits ── */}
      <div style={{ padding: "20px 28px 24px", borderBottom: B }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>ADD CREDITS</span>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", display: "flex", alignItems: "center", gap: 4 }}>
            Monthly plans add recurring credits to the same balance
            <button onClick={() => setShowPlansModal(true)} style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, color: blue, background: "none", border: "none", cursor: "pointer", marginLeft: 4, padding: 0, transition: "opacity 100ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >View plans →</button>
          </span>
        </div>

        {/* Two-column card */}
        <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden", display: "grid", gridTemplateColumns: "60% 40%" }}>

          {/* ── Left: Buy Credits ── */}
          <div style={{ padding: "20px 24px", borderRight: "1px solid #EFEFEF" }}>
            <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 4 }}>Buy Credits</div>
            <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", marginBottom: 16, lineHeight: 1.5 }}>
              Top up your account balance. Credits are shared across all models and API keys.
            </div>

            {/* Payment method */}
            <SegControl />

            {/* Amount */}
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginTop: 16, marginBottom: 8 }}>AMOUNT</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
              {PRESETS.map((amt) => {
                const active = selected === amt && !custom;
                return (
                  <button key={amt} onClick={() => { setSelected(amt); setCustom(""); }} style={{
                    fontFamily: F.mono, fontSize: D.body, fontWeight: 600, height: 36, padding: "0 14px",
                    border: `1px solid ${active ? "#111" : "#E5E5E5"}`,
                    background: active ? "#111" : "#fff", color: active ? "#fff" : "#444",
                    cursor: "pointer", transition: "all 80ms", borderRadius: 6,
                  }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "#999"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "#E5E5E5"; }}
                  >${amt}</button>
                );
              })}
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${custom ? "#111" : "#E5E5E5"}`, height: 36, padding: "0 10px", gap: 3, borderRadius: 6, transition: "border-color 120ms" }}>
                <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#ccc" }}>$</span>
                <input type="number" placeholder="Custom" min={1} value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  style={{ fontFamily: F.mono, fontSize: D.body, border: "none", outline: "none", width: 64, color: "#111", background: "transparent" }}
                />
              </div>
            </div>

            {/* Crypto details */}
            {payMethod === "crypto" && finalAmount > 0 && (
              <div style={{ marginBottom: 16, background: "#FAFAFA", border: "1px solid #EFEFEF", borderRadius: 6, padding: "12px 16px" }}>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 8 }}>SUPPORT NETWORK</div>
                <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
                  {NETWORKS.map((n) => (
                    <span key={n} style={{
                      fontFamily: F.sans, fontSize: 12, fontWeight: 500, padding: "3px 10px",
                      border: "1px solid #E5E5E5", background: "#fff", color: "#666",
                      borderRadius: 4, display: "inline-block",
                    }}>{n}</span>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                  {[
                    { label: "You pay",    value: `${finalAmount} USDC`,         mono: true },
                    { label: "You receive", value: `$${finalAmount} credits`,    mono: true },
                    { label: "Rate",       value: "1 USDC = $1 credit",         mono: true },
                  ].map((row) => (
                    <div key={row.label}>
                      <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", marginBottom: 2 }}>{row.label}</div>
                      <div style={{ fontFamily: row.mono ? F.mono : F.sans, fontSize: 12, fontWeight: 600, color: row.green ? "#16A34A" : "#111" }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* You receive summary */}
            {finalAmount > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 8 }}>YOU RECEIVE</div>
                <span style={{ fontFamily: F.mono, fontSize: 18, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums" }}>${finalAmount} credits</span>
              </div>
            )}

            {/* Pay button */}
            {payMethod === "card" ? (
              <button disabled={finalAmount <= 0} style={{
                fontFamily: F.sans, fontSize: D.body, fontWeight: 600, height: 38, padding: "0 24px",
                color: "#fff", background: finalAmount > 0 ? blue : "#e0e0e0",
                border: "none", cursor: finalAmount > 0 ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: 7, transition: "opacity 120ms", borderRadius: 6,
              }}
                onMouseEnter={(e) => { if (finalAmount > 0) e.currentTarget.style.opacity = "0.82"; }}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <CreditCard size={13} strokeWidth={1.5} />
                {finalAmount > 0 ? `Pay $${finalAmount}` : "Select amount"}
              </button>
            ) : (
              <button disabled={finalAmount <= 0} onClick={openCryptoModal} style={{
                fontFamily: F.sans, fontSize: D.body, fontWeight: 600, height: 38, padding: "0 24px",
                color: "#fff", background: finalAmount > 0 ? blue : "#e0e0e0",
                border: "none", cursor: finalAmount > 0 ? "pointer" : "not-allowed",
                transition: "opacity 120ms", borderRadius: 6,
              }}
                onMouseEnter={(e) => { if (finalAmount > 0) e.currentTarget.style.opacity = "0.82"; }}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {finalAmount > 0 ? `Pay ${finalAmount} USDC` : "Select amount"}
              </button>
            )}
          </div>

          {/* ── Right: Auto top-up ── */}
          <div style={{ padding: "20px 24px", background: "#FAFAFA" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111" }}>Auto top-up</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 500, color: autoTopUp ? blue : "#bbb", transition: "color 150ms" }}>
                  {autoTopUp ? "On" : "Off"}
                </span>
                <button
                  onClick={() => { if (!savedCard && !autoTopUp) { setShowPayModal(true); } else { setAutoTopUp((v) => !v); } }}
                  style={{
                    width: 32, height: 18, borderRadius: 9, border: "none", cursor: "pointer",
                    background: autoTopUp ? blue : "#ddd",
                    position: "relative", flexShrink: 0, transition: "background 180ms", padding: 0,
                  }}>
                  <span style={{
                    position: "absolute", top: 2, left: autoTopUp ? 14 : 2,
                    width: 14, height: 14, borderRadius: "50%", background: "#fff",
                    transition: "left 180ms", display: "block", boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
                  }} />
                </button>
              </div>
            </div>

            {autoTopUp && savedCard ? (
              <>
                <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", lineHeight: 1.6, margin: "0 0 12px" }}>
                  Recharge $50 when balance drops below $10.
                </p>
                {/* Saved card chip */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#fff", border: "1px solid #EFEFEF", borderRadius: 6, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 18, background: "#1A1F71", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: F.sans, fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: 0 }}>{savedCard.brand.slice(0, 4).toUpperCase()}</span>
                  </div>
                  <span style={{ fontFamily: F.mono, fontSize: 12, color: "#555" }}>••••{savedCard.last4}</span>
                  <button onClick={() => setShowPayModal(true)} style={{ marginLeft: "auto", fontFamily: F.sans, fontSize: 11, color: blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Change</button>
                </div>
                <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", margin: 0 }}>Toggle off above to disable.</p>
              </>
            ) : !savedCard ? (
              <>
                <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#777", lineHeight: 1.6, margin: "0 0 16px" }}>
                  Automatically recharge when your balance drops below $10.
                </p>
                <button onClick={() => setShowPayModal(true)} style={{
                  fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#555",
                  background: "#fff", border: "1px solid #E5E5E5", padding: "6px 14px",
                  cursor: "pointer", borderRadius: 6, transition: "border-color 100ms",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                >Add payment method</button>
              </>
            ) : (
              <>
                <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", lineHeight: 1.6, margin: "0 0 12px" }}>
                  Automatically recharge when your balance drops below $10.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#fff", border: "1px solid #EFEFEF", borderRadius: 6, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 18, background: "#1A1F71", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: F.sans, fontSize: 8, fontWeight: 700, color: "#fff" }}>{savedCard.brand.slice(0, 4).toUpperCase()}</span>
                  </div>
                  <span style={{ fontFamily: F.mono, fontSize: 12, color: "#555" }}>••••{savedCard.last4}</span>
                  <button onClick={() => setShowPayModal(true)} style={{ marginLeft: "auto", fontFamily: F.sans, fontSize: 11, color: blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Change</button>
                </div>
                <p style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", margin: "0 0 12px" }}>Enable the toggle above to activate auto top-up.</p>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Transaction history */}
      <div style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>TRANSACTION HISTORY</div>
          <button style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#666", background: "none", border: B, padding: "5px 12px", cursor: "pointer" }}>Export CSV</button>
        </div>
        <div style={{ border: B }}>
          <div className="txn-row" style={{ display: "grid", gridTemplateColumns: "90px 52px 90px 1fr 1fr 90px", padding: "8px 16px", background: "#f7f7f7", borderBottom: B }}>
            {["Date", "Time", "Type", "Details", "Tokens", "Amount"].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#aaa" }}>{h}</span>
            ))}
          </div>
          {transactions.map((tx, i) => {
            const isTopup    = tx.type === "topup";
            const isReferral = tx.type === "referral";
            const isCredit   = isTopup || isReferral;
            return (
              <div key={i} className="txn-row" style={{ display: "grid", gridTemplateColumns: "90px 52px 90px 1fr 1fr 90px", padding: "11px 16px", borderBottom: i < transactions.length - 1 ? Bs : "none", alignItems: "center", transition: "background 80ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="txn-date" style={{ fontFamily: F.sans, fontSize: D.body, color: "#666" }}>{tx.date}</span>
                <span className="txn-time" style={{ fontFamily: F.mono, fontSize: D.label, color: "#ccc" }}>{tx.time}</span>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: D.label, fontWeight: 600,
                    color: isReferral ? "#15803D" : isTopup ? blue : "#777",
                    background: isReferral ? "#F0FDF4" : isTopup ? "#eff4ff" : "#f5f5f5",
                    padding: "2px 8px", borderRadius: 9999 }}>
                    {isReferral ? <Gift size={10} /> : isTopup ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                    {isReferral ? "Referral" : isTopup ? "Top-up" : "Usage"}
                  </span>
                </div>
                <span className="txn-details" style={{ fontFamily: F.mono, fontSize: D.label, color: isCredit ? "#bbb" : "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isTopup ? "Stripe · Visa ••4242" : tx.model}
                </span>
                <span className="txn-tokens" style={{ fontFamily: F.mono, fontSize: D.label, color: "#bbb" }}>{tx.tokens || "—"}</span>
                <span className="txn-amount" style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 700, color: tx.amount > 0 ? "#15803D" : "#333", textAlign: "right" as const }}>
                  {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
          <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#bbb" }}>Showing 8 of 24 transactions</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["← Prev", "Next →"].map((l) => (
              <button key={l} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#666", background: "none", border: B, padding: "5px 12px", cursor: "pointer" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add payment method modal ── */}
      {showPayModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowPayModal(false)}
        >
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, width: 420, boxShadow: "0 20px 56px rgba(0,0,0,0.10)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #EFEFEF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", margin: 0 }}>Add payment method</h2>
                <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", margin: "3px 0 0" }}>Used for one-time top-ups and auto top-up.</p>
              </div>
              <button onClick={() => setShowPayModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 4, display: "flex" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Card number */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>CARD NUMBER</label>
                <input
                  type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  style={{ width: "100%", height: 38, border: "1px solid #E5E5E5", borderRadius: 6, padding: "0 12px", fontFamily: F.mono, fontSize: D.body, color: "#111", outline: "none", boxSizing: "border-box", transition: "border-color 150ms" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = blue)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                />
              </div>

              {/* Expiry + CVC */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>EXPIRY</label>
                  <input
                    type="text" inputMode="numeric" placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    style={{ width: "100%", height: 38, border: "1px solid #E5E5E5", borderRadius: 6, padding: "0 12px", fontFamily: F.mono, fontSize: D.body, color: "#111", outline: "none", boxSizing: "border-box", transition: "border-color 150ms" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>CVC</label>
                  <input
                    type="text" inputMode="numeric" placeholder="123"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    style={{ width: "100%", height: 38, border: "1px solid #E5E5E5", borderRadius: 6, padding: "0 12px", fontFamily: F.mono, fontSize: D.body, color: "#111", outline: "none", boxSizing: "border-box", transition: "border-color 150ms" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                  />
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: cardError ? 10 : 20 }}>
                <label style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>NAME ON CARD</label>
                <input
                  type="text" placeholder="Full name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={{ width: "100%", height: 38, border: "1px solid #E5E5E5", borderRadius: 6, padding: "0 12px", fontFamily: F.sans, fontSize: D.body, color: "#111", outline: "none", boxSizing: "border-box", transition: "border-color 150ms" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = blue)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                />
              </div>

              {/* Error */}
              {cardError && (
                <div style={{ fontFamily: F.sans, fontSize: D.label, color: "#dc2626", marginBottom: 14 }}>{cardError}</div>
              )}

              {/* Note */}
              <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", margin: "0 0 20px", lineHeight: 1.5 }}>
                Your card details are encrypted and stored securely. We never store your full card number.
              </p>
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 24px 20px", borderTop: "1px solid #EFEFEF", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => { setShowPayModal(false); setCardError(""); }} style={{
                fontFamily: F.sans, fontSize: D.body, fontWeight: 500, color: "#555",
                background: "none", border: "1px solid #E5E5E5", padding: "0 16px", height: 36,
                cursor: "pointer", borderRadius: 6,
              }}>Cancel</button>
              <button onClick={handleAddCard} style={{
                fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#fff",
                background: blue, border: "none", padding: "0 20px", height: 36,
                cursor: "pointer", borderRadius: 6, transition: "opacity 120ms",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >Add card</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Plans modal ── */}
      {showPlansModal && (
        <PlansModal
          onClose={() => setShowPlansModal(false)}
          currentPlanId={currentPlan?.id ?? null}
          onPlanChange={(plan) => { setCurrentPlan(plan); }}
        />
      )}

      {/* ── Crypto payment modal ── */}
      {cryptoModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setCryptoModal(false)}
        >
          <div style={{ background: "#fff", border: B, width: 460, boxShadow: "0 20px 56px rgba(0,0,0,0.10)", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #eeeeee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em", marginBottom: 2 }}>Pay with crypto</h2>
                <p style={{ fontFamily: F.sans, fontSize: 12, color: "#999" }}>Send USDC to complete your credit top-up.</p>
              </div>
              <button onClick={() => setCryptoModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 2 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* QR + fields side by side */}
              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                {/* QR */}
                <div style={{ border: "1px solid #e8e8e8", padding: 8, flexShrink: 0 }}>
                  <QRPlaceholder size={88} />
                </div>

                {/* Fields */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Amount */}
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#bbb", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 3 }}>Amount</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #eeeeee", padding: "7px 10px", background: "#fafafa" }}>
                      <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 700, color: "#111" }}>
                        {finalAmount} USDC
                      </span>
                      <button onClick={() => doCopy(`${finalAmount}`, "amount")} style={{ background: "none", border: "none", cursor: "pointer", color: copied === "amount" ? "#16A34A" : "#ccc", display: "flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 11, padding: 0, transition: "color 100ms" }}>
                        {copied === "amount" ? <Check size={11} /> : <Copy size={11} />}
                        {copied === "amount" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Network */}
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#bbb", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 3 }}>Network</div>
                    <div style={{ border: "1px solid #eeeeee", padding: "7px 10px", background: "#fafafa" }}>
                      <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#333" }}>{network}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deposit address */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 600, color: "#bbb", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>Deposit address</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #eeeeee", padding: "9px 12px", background: "#fafafa" }}>
                  <code style={{ fontFamily: F.mono, fontSize: 11, color: "#444", flex: 1, wordBreak: "break-all" as const }}>{WALLET}</code>
                  <button onClick={() => doCopy(WALLET, "addr")} style={{ background: "none", border: "none", cursor: "pointer", color: copied === "addr" ? "#16A34A" : "#ccc", display: "flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 11, padding: 0, flexShrink: 0, transition: "color 100ms" }}>
                    {copied === "addr" ? <Check size={11} /> : <Copy size={11} />}
                    {copied === "addr" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Payment status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid #eeeeee", background: cryptoStatus === "done" ? "#f0fdf4" : "#fafafa", marginBottom: 20, transition: "background 300ms" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {cryptoStatus !== "done" && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: cryptoStatus === "confirming" ? "#d97706" : "#ddd", display: "inline-block", flexShrink: 0 }} />
                  )}
                  {cryptoStatus === "done" && (
                    <Check size={13} style={{ color: "#16A34A" }} />
                  )}
                  <span style={{ fontFamily: F.sans, fontSize: D.body, color: statusColor[cryptoStatus], fontWeight: cryptoStatus === "done" ? 600 : 400, transition: "color 300ms" }}>
                    {statusLabel[cryptoStatus]}
                  </span>
                </div>
                {cryptoStatus === "confirming" && (
                  <span style={{ width: 14, height: 14, border: "2px solid #f0e0c0", borderTopColor: "#d97706", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                )}
              </div>

              {/* Notice */}
              <p style={{ fontFamily: F.sans, fontSize: 12, color: "#bbb", lineHeight: 1.6, marginBottom: 20 }}>
                Send the exact amount on the selected network. Credits are added after on-chain confirmation.
              </p>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {cryptoStatus === "waiting" && (
                  <button onClick={simulatePaid} style={{
                    fontFamily: F.sans, fontSize: D.body, fontWeight: 700, height: 38, padding: "0 20px",
                    background: "#111", color: "#fff", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6, transition: "background 120ms",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
                  >
                    I have paid
                  </button>
                )}
                {cryptoStatus === "done" && (
                  <button onClick={() => setCryptoModal(false)} style={{
                    fontFamily: F.sans, fontSize: D.body, fontWeight: 700, height: 38, padding: "0 20px",
                    background: "#111", color: "#fff", border: "none", cursor: "pointer",
                  }}>
                    Done
                  </button>
                )}
                <button onClick={() => setCryptoModal(false)} style={{
                  fontFamily: F.sans, fontSize: D.body, fontWeight: 500, height: 38, padding: "0 16px",
                  background: "none", color: "#777", border: B, cursor: "pointer",
                }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .credits-top { grid-template-columns: 1fr !important; } }

        /* Tablet: hide Time + Tokens */
        @media (max-width: 768px) {
          .txn-row { grid-template-columns: 72px 90px 1fr 1fr 80px !important; }
          .txn-time { display: none !important; }
          .txn-tokens { display: none !important; }
        }

        /* Mobile: 3-column — Type | Details | Amount. Date and tokens hidden. */
        @media (max-width: 520px) {
          .txn-row { grid-template-columns: auto 1fr auto !important; padding: 10px 14px !important; gap: 8px; }
          .txn-date { display: none !important; }
          .txn-time { display: none !important; }
          .txn-tokens { display: none !important; }
          .txn-details { white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; min-width: 0; }
          .txn-amount { min-width: 60px; text-align: right !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
