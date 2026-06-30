import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ExternalLink } from "lucide-react";
import { F } from "../lib/type";

const B = "1px solid #E5E5E5";

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#229ED9" />
    <path d="M17.79 7.28L15.6 17.47c-.16.73-.6.91-1.21.57l-3.34-2.46-1.61 1.55c-.18.18-.33.33-.67.33l.24-3.4 6.14-5.54c.27-.24-.06-.37-.41-.14L6.18 13.2l-3.29-1.03c-.71-.22-.73-.71.15-1.05l12.82-4.94c.6-.22 1.12.14.93 1.1z" fill="white" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#5865F2" />
    <path d="M16.6 8.2A13.2 13.2 0 0 0 13.8 7.4a.05.05 0 0 0-.05.02c-.13.23-.27.53-.37.76a12.2 12.2 0 0 0-3.66 0 7.6 7.6 0 0 0-.38-.76.05.05 0 0 0-.05-.02 13.2 13.2 0 0 0-2.82.78.04.04 0 0 0-.02.02C4.93 11.1 4.5 13.93 4.7 16.72a.05.05 0 0 0 .02.03 13.3 13.3 0 0 0 4 2.02.05.05 0 0 0 .05-.02c.31-.42.58-.86.82-1.33a.05.05 0 0 0-.03-.07 8.7 8.7 0 0 1-1.25-.6.05.05 0 0 1 0-.07l.25-.2a.05.05 0 0 1 .05 0c2.63 1.2 5.47 1.2 8.07 0a.05.05 0 0 1 .05 0l.25.2a.05.05 0 0 1 0 .07c-.4.24-.82.44-1.26.6a.05.05 0 0 0-.02.07c.24.47.52.91.82 1.33a.05.05 0 0 0 .05.02 13.26 13.26 0 0 0 4.01-2.02.05.05 0 0 0 .02-.03c.24-3.18-.4-5.97-1.71-8.5a.04.04 0 0 0-.02-.02ZM9.36 15.04c-.79 0-1.44-.72-1.44-1.62 0-.89.64-1.62 1.44-1.62.8 0 1.45.74 1.44 1.62 0 .9-.64 1.62-1.44 1.62Zm5.32 0c-.79 0-1.44-.72-1.44-1.62 0-.89.64-1.62 1.44-1.62.8 0 1.44.74 1.44 1.62 0 .9-.63 1.62-1.44 1.62Z" fill="white" />
  </svg>
);

const LINKS = [
  {
    label:   "Telegram",
    sub:     "Chat with the OpenModels team",
    href:    "https://t.me/openmodels",
    Icon:    TelegramIcon,
  },
  {
    label:   "Discord",
    sub:     "Join the developer community",
    href:    "https://discord.gg/openmodels",
    Icon:    DiscordIcon,
  },
];

export function SupportButton() {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [btnHover, setBtnHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "fixed", right: 24, bottom: 24, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}
      className="support-root"
    >
      {/* ── Panel ── */}
      {open && (
        <div style={{ width: 280, background: "#fff", border: B, borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }} className="support-panel">

          {/* Header */}
          <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid #F0F0F0" }}>
            <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 3 }}>Need help?</div>
            <div style={{ fontFamily: F.sans, fontSize: 12, color: "#888", lineHeight: 1.5 }}>Join our community or contact the team.</div>
          </div>

          {/* Links */}
          <div>
            {LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: i < LINKS.length - 1 ? "1px solid #F5F5F5" : "none", textDecoration: "none", background: hovered === i ? "#FAFAFA" : "#fff", transition: "background 80ms" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <link.Icon />
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: "#111", marginBottom: 2 }}>{link.label}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: "#B0B0B0" }}>{link.sub}</div>
                  </div>
                </div>
                <ExternalLink size={13} strokeWidth={1.5} color="#C0C0C0" style={{ flexShrink: 0, marginLeft: 12 }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(!open)}
        title="Contact OpenModels"
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: open ? "#111" : btnHover ? "#F7F7F7" : "#fff",
          border: btnHover && !open ? "1px solid #C0C0C0" : open ? "1px solid #111" : B,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: open ? "#fff" : "#333",
          position: "relative", transition: "background 100ms, border-color 100ms, color 100ms",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {open
          ? <X size={16} strokeWidth={1.75} />
          : <MessageCircle size={17} strokeWidth={1.5} />}

        {/* Online dot */}
        {!open && (
          <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#16A34A", border: "1.5px solid #fff" }} />
        )}
      </button>

      <style>{`
        @media (max-width: 600px) {
          .support-root { right: 16px !important; bottom: 16px !important; }
          .support-panel { width: calc(100vw - 32px) !important; }
        }
      `}</style>
    </div>
  );
}
