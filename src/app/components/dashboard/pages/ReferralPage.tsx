import { useState } from "react";
import { Copy, Check, Gift } from "lucide-react";
import { copyText } from "../../../lib/clipboard";
import { F } from "../../../lib/type";
import { B, Bs, blue, D } from "../shared";

const REFERRAL_LINK = "https://openmodels.com/r/user_abc123xy";

/* ── Credit tier table ── */
const TIERS = [
  { range: "$10 – $499",        rate: "5% credits",   rateNum: 0.05  },
  { range: "$500 – $999",       rate: "4.5% credits", rateNum: 0.045 },
  { range: "$1,000 – $4,999",   rate: "4% credits",   rateNum: 0.04  },
  { range: "$5,000 – $10,000",  rate: "3.5% credits", rateNum: 0.035 },
];

/* ── Referred users data ── */
type UserStatus = "active" | "waiting" | "capped";
const referredUsers: {
  email: string; topups: number; credits: number; rate: string; status: UserStatus;
}[] = [
  { email: "team@company.com",  topups: 820.00, credits: 39.85, rate: "4.5%", status: "active"  },
  { email: "dev@example.com",   topups: 120.00, credits:  6.00, rate: "5%",   status: "active"  },
  { email: "builder@ai.dev",    topups:   0.00, credits:  0.00, rate: "—",    status: "waiting" },
  { email: "alice@startup.io",  topups: 480.00, credits: 24.00, rate: "5%",   status: "active"  },
  { email: "ops@infra.dev",     topups:  55.00, credits:  2.75, rate: "5%",   status: "active"  },
];

/* ── Credits activity ── */
type ActivityStatus = "confirmed" | "pending" | "credited";
const activity: {
  date: string; email: string; amount: number; rate: string; credits: number; status: ActivityStatus;
}[] = [
  { date: "Jun 20", email: "team@company.com", amount: 100, rate: "5%",   credits: 5.00,  status: "confirmed" },
  { date: "Jun 18", email: "team@company.com", amount: 200, rate: "5%",   credits: 10.00, status: "confirmed" },
  { date: "Jun 15", email: "dev@example.com",  amount: 120, rate: "5%",   credits: 6.00,  status: "credited"  },
  { date: "Jun 12", email: "alice@startup.io", amount: 100, rate: "5%",   credits: 5.00,  status: "confirmed" },
  { date: "Jun 10", email: "team@company.com", amount: 520, rate: "4.5%", credits: 23.40, status: "pending"   },
];

const userStatusStyle: Record<UserStatus, { bg: string; border: string; text: string; dot: string; label: string }> = {
  active:  { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#16A34A", label: "Active"         },
  waiting: { bg: "#F5F5F5", border: "#E5E5E5", text: "#737373", dot: "#A3A3A3", label: "Waiting top-up" },
  capped:  { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#D97706", label: "Capped"          },
};

const activityStatusStyle: Record<ActivityStatus, { bg: string; border: string; text: string }> = {
  confirmed: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D" },
  pending:   { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309" },
  credited:  { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
};

const activityStatusLabel: Record<ActivityStatus, string> = {
  confirmed: "Confirmed",
  pending:   "Pending",
  credited:  "Credited",
};

function SPill({ status }: { status: UserStatus }) {
  const s = userStatusStyle[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 999, padding: "2px 8px", fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: s.text, whiteSpace: "nowrap" }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

const totalCredits      = referredUsers.reduce((s, r) => s + r.credits, 0);
const totalTopups       = referredUsers.reduce((s, r) => s + r.topups, 0);
const activeCount       = referredUsers.filter((r) => r.status === "active").length;
const pendingCredits    = activity.filter((a) => a.status === "pending").reduce((s, a) => s + a.credits, 0);

export function ReferralPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyText(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily: F.sans }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 28px 24px", borderBottom: B }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <Gift size={11} color={blue} strokeWidth={2} />
          <span style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 600, color: blue, letterSpacing: "0.06em" }}>REFERRAL</span>
        </span>
        <h1 style={{ fontFamily: F.sans, fontSize: D.title, fontWeight: 600, color: "#111", marginBottom: 6, lineHeight: 1.2 }}>
          Referral program
        </h1>
        <p style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", lineHeight: 1.65, maxWidth: 540, margin: 0 }}>
          Invite developers to OpenModels and earn credits when they top up.
        </p>
      </div>

      {/* ── Summary cards ── */}
      <div className="ref-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: B }}>
        {[
          { label: "Credits earned",    value: `$${totalCredits.toFixed(2)}`,   mono: true  },
          { label: "Referred top-ups",  value: `$${totalTopups.toFixed(2)}`,    mono: true  },
          { label: "Active referrals",  value: String(activeCount),             mono: false },
          { label: "Pending credits",   value: `$${pendingCredits.toFixed(2)}`, mono: true  },
        ].map((c, i) => (
          <div key={c.label} style={{ padding: "20px 24px", borderRight: i < 3 ? "1px solid #EFEFEF" : "none" }}>
            <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 8 }}>{c.label.toUpperCase()}</div>
            <div style={{ fontFamily: c.mono ? F.mono : F.sans, fontSize: 21, fontWeight: 600, color: "#111", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em", lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* ── Referral link ── */}
      <div style={{ padding: "24px 28px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 6 }}>YOUR REFERRAL LINK</div>
        <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 12 }}>
          Share your link. Referral credits start after an invited user tops up more than $10.
        </div>
        <div style={{ display: "flex", alignItems: "stretch", maxWidth: 560, marginBottom: 10 }}>
          <div style={{ flex: 1, border: B, borderRight: "none", padding: "0 14px", display: "flex", alignItems: "center", background: "#FAFAFA", minWidth: 0, borderRadius: "6px 0 0 6px" }}>
            <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {REFERRAL_LINK}
            </span>
          </div>
          <button onClick={handleCopy} style={{
            fontFamily: F.sans, fontSize: D.body, fontWeight: 600,
            height: 38, padding: "0 16px", flexShrink: 0,
            background: copied ? "#F0FDF4" : "#111",
            color: copied ? "#15803D" : "#fff",
            border: `1px solid ${copied ? "#BBF7D0" : "#111"}`,
            borderRadius: "0 6px 6px 0",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 150ms",
          }}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
        <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", margin: 0 }}>
          When an invited user tops up credits, you earn referral credits based on their cumulative top-up amount.
        </p>
      </div>

      {/* ── Credit tiers ── */}
      <div style={{ padding: "24px 28px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 6 }}>REFERRAL CREDIT TIERS</div>
        <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#666", marginBottom: 16 }}>
          Earn a percentage of each invited user's cumulative top-ups as credits. Rates are calculated by marginal tiers.
        </div>

        <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", padding: "8px 16px", background: "#F7F7F7", borderBottom: "1px solid #EFEFEF" }}>
            {["Referred top-up amount", "Credit reward rate"].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>{h.toUpperCase()}</span>
            ))}
          </div>
          {TIERS.map((tier, i) => (
            <div key={tier.range} style={{ display: "grid", gridTemplateColumns: "1fr 140px", padding: "11px 16px", borderBottom: i < TIERS.length - 1 ? "1px solid #EFEFEF" : "none", alignItems: "center", transition: "background 80ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333" }}>{tier.range}</span>
              <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#111" }}>{tier.rate}</span>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", margin: "0 0 6px" }}>
          Referral rewards are issued as OpenModels credits and added to your credits balance.
        </p>
        <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#C0C0C0", margin: 0, lineHeight: 1.55 }}>
          Rates are marginal. For example, the first $499 earns 5% credits, the next tier earns 4.5%, and so on.
        </p>
      </div>

      {/* ── Example calculation ── */}
      <div style={{ padding: "24px 28px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 16 }}>EXAMPLE</div>
        <div style={{ background: "#FAFAFA", border: "1px solid #E5E5E5", borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", marginBottom: 14 }}>
            If an invited user tops up <strong style={{ color: "#111" }}>$1,200</strong>:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {[
              { range: "$10 – $499",       rate: "5%",   note: "= ~$24.45 credits" },
              { range: "$500 – $999",      rate: "4.5%", note: "= ~$22.50 credits" },
              { range: "$1,000 – $1,200",  rate: "4%",   note: "= ~$8.00 credits"  },
            ].map((row) => (
              <div key={row.range} style={{ display: "grid", gridTemplateColumns: "160px 60px 1fr", gap: 8, alignItems: "center" }}>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: "#555" }}>{row.range}</span>
                <span style={{ fontFamily: F.sans, fontSize: D.body, fontWeight: 600, color: "#111" }}>{row.rate}</span>
                <span style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3" }}>{row.note}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: F.sans, fontSize: D.body, color: "#555", paddingTop: 12, borderTop: "1px solid #EFEFEF" }}>
            Credits earned are calculated from each marginal tier and added directly to your balance.
          </div>
        </div>
      </div>

      {/* ── Referred users ── */}
      <div style={{ padding: "24px 28px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 16 }}>REFERRED USERS</div>
        <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
          <div className="ref-users-row" style={{ display: "grid", gridTemplateColumns: "1fr 120px 110px 80px 120px", padding: "8px 16px", background: "#F7F7F7", borderBottom: "1px solid #EFEFEF" }}>
            {["User", "Cumulative top-ups", "Credits earned", "Rate", "Status"].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>{h.toUpperCase()}</span>
            ))}
          </div>
          {referredUsers.map((r, i) => (
            <div key={r.email} className="ref-users-row" style={{ display: "grid", gridTemplateColumns: "1fr 120px 110px 80px 120px", padding: "12px 16px", borderBottom: i < referredUsers.length - 1 ? "1px solid #EFEFEF" : "none", alignItems: "center", transition: "background 80ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#111" }}>{r.email}</span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: r.topups > 0 ? "#111" : "#C0C0C0" }}>
                {r.topups > 0 ? `$${r.topups.toFixed(2)}` : "—"}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: r.credits > 0 ? "#15803D" : "#C0C0C0" }}>
                {r.credits > 0 ? `+$${r.credits.toFixed(2)}` : "—"}
              </span>
              <span style={{ fontFamily: F.sans, fontSize: D.body, color: r.rate === "—" ? "#C0C0C0" : "#555" }}>{r.rate}</span>
              <SPill status={r.status} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Credits activity ── */}
      <div style={{ padding: "24px 28px", borderBottom: B }}>
        <div style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em", marginBottom: 16 }}>CREDITS ACTIVITY</div>
        <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
          <div className="ref-activity-row" style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 70px 120px 90px", padding: "8px 16px", background: "#F7F7F7", borderBottom: "1px solid #EFEFEF" }}>
            {["Date", "User", "Top-up amount", "Credit rate", "Credits earned", "Status"].map((h) => (
              <span key={h} style={{ fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: "#A3A3A3", letterSpacing: "0.04em" }}>{h.toUpperCase()}</span>
            ))}
          </div>
          {activity.map((a, i) => {
            const st = activityStatusStyle[a.status];
            return (
              <div key={i} className="ref-activity-row" style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 70px 120px 90px", padding: "11px 16px", borderBottom: i < activity.length - 1 ? "1px solid #EFEFEF" : "none", alignItems: "center", transition: "background 80ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#888" }}>{a.date}</span>
                <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.email}</span>
                <span style={{ fontFamily: F.mono, fontSize: D.body, color: "#555" }}>+${a.amount.toFixed(2)}</span>
                <span style={{ fontFamily: F.sans, fontSize: D.body, color: "#666" }}>{a.rate}</span>
                <span style={{ fontFamily: F.mono, fontSize: D.body, fontWeight: 600, color: "#15803D" }}>+${a.credits.toFixed(2)}</span>
                <span style={{ display: "inline-flex", alignItems: "center", height: 20, fontFamily: F.sans, fontSize: D.label, fontWeight: 500, color: st.text, background: st.bg, border: `1px solid ${st.border}`, borderRadius: 999, padding: "0 8px", whiteSpace: "nowrap" }}>
                  {activityStatusLabel[a.status]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer note ── */}
      <div style={{ padding: "16px 28px 28px" }}>
        <p style={{ fontFamily: F.sans, fontSize: D.label, color: "#A3A3A3", margin: 0, lineHeight: 1.6 }}>
          Referral credits can be used for OpenModels API usage. They are not cash payouts and cannot be withdrawn.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ref-stats { grid-template-columns: 1fr 1fr !important; }
          .ref-users-row { grid-template-columns: 1fr 90px 80px !important; }
          .ref-users-row > *:nth-child(3), .ref-users-row > *:nth-child(4) { display: none; }
          .ref-activity-row { grid-template-columns: 72px 1fr 80px !important; }
          .ref-activity-row > *:nth-child(4), .ref-activity-row > *:nth-child(5) { display: none; }
        }
        @media (max-width: 480px) {
          .ref-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
