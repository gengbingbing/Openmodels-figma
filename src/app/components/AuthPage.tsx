import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, AlertCircle, Check, Zap, Store } from "lucide-react";
import { F } from "../lib/type";

const blue = "#0047FF";

interface Props {
  onSuccess:    () => void;
  onBack:       () => void;
  partnerSlug?: string;       /* e.g. "acme-ai" */
  partnerName?: string;       /* e.g. "Acme AI" */
  partnerAccent?: string;     /* e.g. "#0047FF" */
  defaultMode?: "signin" | "signup";
}
type Mode = "signin" | "signup";

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

function SocialBtn({ icon, label, onClick, loading }: { icon: React.ReactNode; label: string; onClick: () => void; loading?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
      height: 40, border: hover ? "1px solid #CFCFCF" : "1px solid #E5E5E5",
      borderRadius: 6,
      background: hover ? "#FAFAFA" : "#fff",
      cursor: loading ? "not-allowed" : "pointer",
      fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: "#333",
      transition: "border-color 120ms, background 120ms",
    }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {loading
        ? <span style={{ width: 13, height: 13, border: "2px solid #ddd", borderTopColor: "#555", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
        : icon}
      {label}
    </button>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, error, rightEl }: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void;
  error?: string; rightEl?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: "#A3A3A3",
        letterSpacing: "0.04em", display: "block", marginBottom: 5, textTransform: "uppercase",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", height: 40,
            border: error ? "1px solid #ef4444" : focused ? `1px solid ${blue}` : "1px solid #E5E5E5",
            borderRadius: 6,
            padding: rightEl ? "0 40px 0 12px" : "0 12px",
            fontFamily: F.sans, fontSize: 13, color: "#111",
            outline: "none", boxSizing: "border-box" as const,
            background: "#FFFFFF",
            transition: "border-color 150ms",
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = blue)}
          onBlurCapture={(e) => (e.currentTarget.style.borderColor = error ? "#ef4444" : "#E5E5E5")}
        />
        {rightEl && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
          <AlertCircle size={10} style={{ color: "#ef4444", flexShrink: 0 }} />
          <span style={{ fontFamily: F.sans, fontSize: 11, color: "#ef4444" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    { label: "8+ chars",        ok: password.length >= 8 },
    { label: "uppercase",       ok: /[A-Z]/.test(password) },
    { label: "number / symbol", ok: /[0-9!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#ef4444", "#f59e0b", "#22c55e"];
  const labels = ["Weak", "Fair", "Strong"];
  return (
    <div style={{ marginBottom: 14, marginTop: -4 }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i < score ? colors[score - 1] : "#f0f0f0", transition: "background 200ms" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {checks.map((c) => (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Check size={9} style={{ color: c.ok ? "#22c55e" : "#ddd" }} strokeWidth={3} />
              <span style={{ fontFamily: F.sans, fontSize: 11, color: c.ok ? "#555" : "#ccc" }}>{c.label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, color: score > 0 ? colors[score - 1] : "#ccc" }}>
          {score > 0 ? labels[score - 1] : ""}
        </span>
      </div>
    </div>
  );
}

export function AuthPage({ onSuccess, onBack, partnerSlug, partnerName, partnerAccent, defaultMode = "signin" }: Props) {
  const [mode, setMode]           = useState<Mode>(defaultMode);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [name, setName]           = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [socialLoading, setSocialLoading] = useState<"github" | "google" | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "signup" && !name.trim()) e.name = "Name is required";
    if (!email.includes("@")) e.email = "Enter a valid email address";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1000);
  };

  const handleSocial = (provider: "github" | "google") => {
    setSocialLoading(provider);
    setTimeout(() => { setSocialLoading(null); onSuccess(); }, 1200);
  };

  const toggleMode = () => { setMode(mode === "signin" ? "signup" : "signin"); setErrors({}); setPassword(""); };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", display: "flex", flexDirection: "column", fontFamily: F.sans, position: "relative", overflow: "hidden" }}>

      {/* Subtle watermarks — 3-5% opacity */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <span style={{ position: "absolute", top: "20%", left: "5%", fontFamily: "var(--font-mono,'Geist Mono',monospace)", fontSize: 11, color: "#111", opacity: 0.04, whiteSpace: "nowrap", letterSpacing: "0.04em", transform: "rotate(-7deg)" }}>
          api.getopenmodels.com/v1
        </span>
        <span style={{ position: "absolute", bottom: "24%", right: "4%", fontFamily: "var(--font-mono,'Geist Mono',monospace)", fontSize: 11, color: "#111", opacity: 0.035, whiteSpace: "nowrap", letterSpacing: "0.04em", transform: "rotate(5deg)" }}>
          model: qwen-2.5-72b
        </span>
        <span style={{ position: "absolute", top: "60%", left: "3%", fontFamily: "var(--font-mono,'Geist Mono',monospace)", fontSize: 10, color: "#111", opacity: 0.03, whiteSpace: "nowrap", letterSpacing: "0.03em", transform: "rotate(-4deg)" }}>
          provider_route: lowest_live
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Top bar — 36px */}
        <header style={{
          height: 36, borderBottom: "1px solid #E5E5E5", background: "#FFFFFF",
          display: "flex", alignItems: "center", padding: "0 24px", gap: 20, flexShrink: 0,
        }}>
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 5, background: "none", border: "none",
            cursor: "pointer", color: "#A3A3A3", fontFamily: F.sans, fontSize: 13, padding: 0,
            transition: "color 120ms",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}
          >
            <ArrowLeft size={13} strokeWidth={1.75} /> Back
          </button>
          <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: "#111" }}>
            <span style={{ color: blue }}>Open</span>Models
          </span>
        </header>

        {/* Center card — slightly above true center */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px 48px" }}>
          <div style={{
            width: "100%", maxWidth: 400, background: "#fff",
            border: "1px solid #E5E5E5", borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}>

            {/* Partner context banner */}
            {partnerSlug && partnerName && (
              <div style={{ borderBottom: "1px solid #EFEFEF", background: (partnerAccent ?? blue) + "08" }}>
                <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 5, background: partnerAccent ?? blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 700, color: "#fff" }}>{partnerName.charAt(0)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: "#111" }}>Continue with {partnerName} Marketplace</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: "#888", marginTop: 1 }}>Use your OpenModels account for credits, billing, and API key management.</div>
                  </div>
                  <Store size={13} color="#C0C0C0" style={{ flexShrink: 0 }} />
                </div>
              </div>
            )}

            {/* Card header */}
            <div style={{ padding: "24px 24px 0" }}>
              <h1 style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 5, lineHeight: 1.3 }}>
                {mode === "signin" ? "Sign in to OpenModels" : "Create your OpenModels account"}
              </h1>
              <p style={{ fontFamily: F.sans, fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 14 }}>
                {mode === "signin"
                  ? "Manage API keys, credits, provider routes, and usage."
                  : "Start with one API key for verified open-source model routes."}
              </p>

              {/* Trust line */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 16, borderBottom: "1px solid #EFEFEF" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontFamily: F.sans, fontSize: 11, color: "#888" }}>
                  Verified routes · Transparent pricing · One API key
                </span>
              </div>
            </div>

            <div style={{ padding: "16px 24px 0" }}>

              {/* Info strip — signin only */}
              {mode === "signin" && (
                <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#FAFAFA", border: "1px solid #EFEFEF", borderRadius: 6, padding: "10px 12px", marginBottom: 16 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: blue, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: "#666" }}>
                    Access verified open-source model routes with one API key.
                  </span>
                </div>
              )}

              {/* Launch credit notice — signup only */}
              {mode === "signup" && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, border: "1px solid #EFEFEF", background: "#FAFAFA", borderRadius: 6, padding: "10px 12px", marginBottom: 16 }}>
                  <Zap size={11} style={{ color: blue, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: "#666", lineHeight: 1.55 }}>
                    <span style={{ fontWeight: 600, color: "#333" }}>Go Launch:</span>{" "}
                    pay $1 and get $10 credits added to your balance.
                  </span>
                </div>
              )}

              {/* Social buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <SocialBtn
                  icon={<GitHubIcon />}
                  label={socialLoading === "github" ? "Connecting…" : "Continue with GitHub"}
                  onClick={() => handleSocial("github")}
                  loading={socialLoading === "github"}
                />
                <SocialBtn
                  icon={<GoogleIcon />}
                  label={socialLoading === "google" ? "Connecting…" : "Continue with Google"}
                  onClick={() => handleSocial("google")}
                  loading={socialLoading === "google"}
                />
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "#EFEFEF" }} />
                <span style={{ fontFamily: F.sans, fontSize: 11, color: "#C0C0C0", whiteSpace: "nowrap" }}>or continue with email</span>
                <div style={{ flex: 1, height: 1, background: "#EFEFEF" }} />
              </div>

              {/* Form fields */}
              {mode === "signup" && (
                <Field label="Full name" placeholder="Jane Smith" value={name} onChange={setName} error={errors.name} />
              )}

              <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} error={errors.email} />

              <Field
                label={mode === "signup" ? "Create password" : "Password"}
                type={showPw ? "text" : "password"}
                placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                value={password}
                onChange={setPassword}
                error={errors.password}
                rightEl={
                  <button onClick={() => setShowPw(!showPw)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#C0C0C0", padding: 0, display: "flex", lineHeight: 1, transition: "color 120ms",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#777")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />

              {mode === "signup" && <PasswordStrength password={password} />}

              {mode === "signin" && (
                <div style={{ textAlign: "right", marginTop: -8, marginBottom: 16 }}>
                  <a href="#" style={{ fontFamily: F.sans, fontSize: 12, color: "#888", textDecoration: "none", transition: "color 120ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = blue)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                  >Forgot password?</a>
                </div>
              )}

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading} style={{
                width: "100%", height: 40, borderRadius: 6,
                background: loading ? "#444" : "#111111",
                color: "#fff", border: "none",
                fontFamily: F.sans, fontSize: 13, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 120ms",
              }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#2A2A2A"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#111111"; }}
              >
                {loading ? (
                  <>
                    <span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    {mode === "signin" ? "Signing in…" : "Creating account…"}
                  </>
                ) : (
                  mode === "signin" ? "Sign in" : "Create account"
                )}
              </button>

              {mode === "signup" && (
                <p style={{ fontFamily: F.sans, fontSize: 11, color: "#C0C0C0", textAlign: "center", marginTop: 12, lineHeight: 1.65 }}>
                  By creating an account you agree to our{" "}
                  <a href="#" style={{ color: "#888", textDecoration: "none" }}>Terms</a>
                  {" "}and{" "}
                  <a href="#" style={{ color: "#888", textDecoration: "none" }}>Privacy Policy</a>.
                </p>
              )}
            </div>

            {/* Card footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #EFEFEF", background: "#FAFAFA", borderRadius: "0 0 8px 8px", marginTop: 20 }}>
              <span style={{ fontFamily: F.sans, fontSize: 13, color: "#888" }}>
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={toggleMode} style={{
                  fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: blue,
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                }}>
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
