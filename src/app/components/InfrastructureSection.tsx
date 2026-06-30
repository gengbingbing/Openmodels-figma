import { useState } from "react";
import { Server, GitBranch, ShieldCheck, SlidersHorizontal, Database, Activity, ExternalLink } from "lucide-react";
import { F, WS } from "../lib/type";

const B   = "1px solid #e2e2e2";
const Bs  = "1px solid #eeeeee";
const blue = "#0047FF";

const stats = [
  { value: "50+",    label: "provider adapters"         },
  { value: "320+",   label: "model routes"               },
  { value: "<300ms", label: "routing overhead target"    },
  { value: "99.9%",  label: "gateway availability target"},
];

const capabilities = [
  { Icon: GitBranch,        title: "Provider adaptation",   desc: "Normalize upstream APIs, errors, streaming, usage, and response formats." },
  { Icon: SlidersHorizontal,title: "Route control",         desc: "Route requests by model, provider, policy, availability, or custom rules." },
  { Icon: ShieldCheck,      title: "Fallback resilience",   desc: "Recover from unavailable, slow, or rate-limited providers with controlled fallback." },
  { Icon: Server,           title: "Policy enforcement",    desc: "Apply API key limits, provider allowlists, budgets, and workspace-level controls." },
  { Icon: Database,         title: "Caching layer",         desc: "Reduce repeated upstream calls with response caching and semantic cache support." },
  { Icon: Activity,         title: "Observability",         desc: "Track request logs, usage, latency, traces, failures, and audit events." },
];

export function InfrastructureSection() {
  const [hoveredCap, setHoveredCap] = useState<number | null>(null);

  return (
    <section>
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* ── Header ── */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <Server size={11} color={blue} strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em" }}>INFRASTRUCTURE</span>
          </div>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 10, maxWidth: 680 }}>
            Enterprise-grade gateway infrastructure behind OpenModels
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.7, maxWidth: 640, margin: 0 }}>
            OpenModels is powered by Alephant Gateway, an open-source production gateway for agent traffic, coding agents, and AI applications. It provides routing control, provider adaptation, fallback, policy enforcement, caching, and observability behind every model request.
          </p>
        </div>

        {/* ── Stats bar ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: B }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ padding: "28px", borderRight: i < stats.length - 1 ? Bs : "none", textAlign: "center" }}>
              <div style={{ fontFamily: F.mono, fontSize: 26, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 5, fontVariantNumeric: "tabular-nums" }}>
                {s.value}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 12, color: "#777" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Capabilities grid 2×3 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: B }} className="infra-grid">
          {capabilities.map((c, i) => {
            const hovered = hoveredCap === i;
            const isRightCol  = i % 2 === 1;
            const isLastRow   = i >= capabilities.length - 2;
            return (
              <div
                key={c.title}
                onMouseEnter={() => setHoveredCap(i)}
                onMouseLeave={() => setHoveredCap(null)}
                style={{
                  padding: "28px 32px",
                  borderLeft:   isRightCol ? Bs : "none",
                  borderBottom: isLastRow  ? "none" : Bs,
                  background:   hovered ? "#FAFAFA" : "transparent",
                  transition:   "background 80ms",
                  minHeight: 120,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                  <c.Icon
                    size={15}
                    strokeWidth={1.5}
                    color={hovered ? blue : "#A3A3A3"}
                    style={{ transition: "color 100ms", flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 600, color: "#111" }}>{c.title}</span>
                </div>
                <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.65, margin: 0 }}>
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Differentiator line ── */}
        <div style={{ padding: "16px 32px", borderBottom: B, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888", fontStyle: "italic" }}>
            Not a proxy chain. Not shared reseller keys. Built on a production gateway layer.
          </span>
          <a
            href="https://github.com/AlephantAI/AIephant-AI-Agent-Gateway"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: "#666", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = blue)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            View Alephant Gateway on GitHub
            <ExternalLink size={11} strokeWidth={1.5} />
          </a>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .infra-grid { grid-template-columns: 1fr !important; }
          .infra-grid > * { border-left: none !important; border-bottom: 1px solid #eeeeee !important; }
          .infra-grid > *:last-child { border-bottom: none !important; }
        }
        @media (max-width: 640px) {
          .infra-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
