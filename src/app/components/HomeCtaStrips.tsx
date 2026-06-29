import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

const strips = [
  {
    label: "For providers",
    title: "List your token routes on OpenModels",
    desc: "Bring verified or community model routes to the open marketplace for LLM tokens.",
    cta: "Become a provider →",
    href: "/providers/apply",
  },
  {
    label: "For partners",
    title: "Launch your own LLM token marketplace",
    desc: "Create a branded marketplace powered by OpenModels. Choose models, set pricing, and earn from token usage.",
    cta: "Start as a partner →",
    href: "/partners",
  },
];

export function HomeCtaStrips() {
  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>
        <div className="cta-strips" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {strips.map((s, i) => (
            <div key={s.label} style={{
              padding: "24px 28px",
              borderRight: i === 0 ? Bs : "none",
            }}>
              <div style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 5, letterSpacing: "-0.01em" }}>
                {s.title}
              </div>
              <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.55, margin: "0 0 12px" }}>
                {s.desc}
              </p>
              <a href={s.href} style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", transition: "opacity 100ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {s.cta}
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .cta-strips { grid-template-columns: 1fr !important; }
          .cta-strips > div:first-child { border-right: none !important; border-bottom: 1px solid #eeeeee; }
        }
      `}</style>
    </section>
  );
}
