import { useState } from "react";
import { ArrowUpDown, Store } from "lucide-react";
import { T, F, WS } from "../lib/type";
import { allModels } from "../lib/models-data";

const filters = ["All", "Chat", "Coding", "Reasoning", "Embedding"];
const B = "1px solid #e2e2e2";

type StatusType = "Live" | "Limited" | "Coming soon";
const statusPill: Record<StatusType, { bg: string; border: string; text: string; dot: string; label: string }> = {
  Live:          { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#16A34A", label: "Live" },
  Limited:       { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#D97706", label: "Limited" },
  "Coming soon": { bg: "#F5F5F5", border: "#E5E5E5", text: "#737373", dot: "#A3A3A3", label: "Soon" },
};

type SupplyType = "Direct" | "Verified" | "Limited";
const supplyPill: Record<SupplyType, { bg: string; border: string; text: string; dot: string }> = {
  Direct:   { bg: "#f6fef9", border: "#d1fae5", text: "#166534", dot: "#16A34A" },
  Verified: { bg: "#f5f9ff", border: "#dbeafe", text: "#2563eb", dot: "#3B82F6" },
  Limited:  { bg: "#f7f7f7", border: "#e8e8e8", text: "#888",    dot: "#bbb"    },
};

function SupplyPill({ supply }: { supply: string }) {
  const s = supplyPill[(supply as SupplyType)] ?? supplyPill.Limited;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 999, padding: "2px 7px",
      fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: s.text,
      whiteSpace: "nowrap", width: "fit-content",
    }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
      {supply}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = statusPill[(status as StatusType)] ?? statusPill["Coming soon"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 999, padding: "3px 8px",
      fontFamily: F.sans, fontSize: 10, fontWeight: 500, color: s.text,
      whiteSpace: "nowrap", width: "fit-content",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

interface MarketplaceProps {
  onModelSelect?: (id: string) => void;
}

export function Marketplace({ onModelSelect }: MarketplaceProps = {}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy]             = useState<"input" | "output">("input");

  const filtered = allModels
    .filter((m) => activeFilter === "All" || m.tags.includes(activeFilter))
    .sort((a, b) => a[sortBy] - b[sortBy]);

  /* Inline badge helpers — light, low-saturation */
  const supplyColor: Record<string, string> = { Direct: "#15803D", Verified: "#2563EB", Limited: "#A3A3A3" };
  const statusColor: Record<string, string> = { Live: "#16A34A", Limited: "#D97706", "Coming soon": "#A3A3A3" };

  return (
    <section id="models">
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header — compact, ~130px total */}
        <div style={{ padding: "40px 32px 28px", borderBottom: "1px solid #F0F0F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <Store size={11} color="#0047FF" strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: "#0047FF", letterSpacing: "0.04em" }}>MARKETPLACE</span>
          </div>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 4 }}>Browse LLM token prices</h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.5, marginBottom: 12 }}>Compare prices, provider routes, and availability before you buy.</p>

          {/* Meta — tight follow */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>333 models</span>
            <span style={{ color: "#D5D5D5" }}>·</span>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>24 providers</span>
            <span style={{ color: "#D5D5D5" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#888" }}>live</span>
            </span>
            <span style={{ color: "#D5D5D5" }}>·</span>
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>updated 2m ago</span>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 28px", borderBottom: "1px solid #F0F0F0", flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              fontFamily: F.sans, fontSize: T.sm,
              color: activeFilter === f ? "#0047FF" : "#8a8a8a",
              fontWeight: activeFilter === f ? 500 : 400,
              background: "none", border: "none",
              borderBottom: activeFilter === f ? "2px solid #0047FF" : "2px solid transparent",
              padding: "10px 14px", cursor: "pointer", transition: "color 100ms", marginBottom: -1,
            }}
              onMouseEnter={(e) => { if (activeFilter !== f) e.currentTarget.style.color = "#333"; }}
              onMouseLeave={(e) => { if (activeFilter !== f) e.currentTarget.style.color = "#8a8a8a"; }}
            >{f}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowUpDown size={11} style={{ color: "#ccc" }} />
            <span style={{ fontFamily: F.sans, fontSize: T.xs, color: "#ccc" }}>Sort:</span>
            {(["input", "output"] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                fontFamily: F.sans, fontSize: T.xs,
                color: sortBy === s ? "#111" : "#bbb", fontWeight: sortBy === s ? 500 : 400,
                background: "none", border: "none", cursor: "pointer",
                textDecoration: sortBy === s ? "underline" : "none",
              }}>{s === "input" ? "Input price" : "Output price"}</button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div className="model-row" style={{ display: "grid", gridTemplateColumns: "28% 12% 12% 9% 10% 15% 14%", padding: "12px 28px", height: 44, alignItems: "center", background: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
          {["Model", "Input /1M", "Output /1M", "Context", "Routes", "Supply", "Status"].map((h) => (
            <span key={h} style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 500, color: "#BBBBBB", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {/* Table body */}
        <div style={{ maxHeight: 720, overflowY: "auto" }}>
          {filtered.map((m, i) => {
            const routeCount = m.providerRoutes?.length ?? 0;
            const supply = m.supply as keyof typeof supplyColor;
            const status = m.status as keyof typeof statusColor;
            return (
              <div
                key={m.id}
                className="model-row"
                onClick={() => onModelSelect?.(m.id)}
                style={{
                  display: "grid", gridTemplateColumns: "28% 12% 12% 9% 10% 15% 14%",
                  padding: "0 28px", minHeight: 64,
                  borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none",
                  alignItems: "center", transition: "background 80ms",
                  cursor: onModelSelect ? "pointer" : "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontFamily: F.mono, fontSize: T.sm, color: "#111" }}>{m.id}</span>
                {/* Only price fields are bold */}
                <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 600, color: "#111" }}>${m.input.toFixed(2)}</span>
                <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 400, color: "#555" }}>{m.output > 0 ? `$${m.output.toFixed(2)}` : "—"}</span>
                <span style={{ fontFamily: F.mono, fontSize: T.sm, fontWeight: 400, color: "#AAAAAA" }}>{m.context}</span>
                <span style={{ fontFamily: F.sans, fontSize: 12, color: routeCount > 1 ? "#777" : "#C0C0C0" }}>
                  {routeCount > 0 ? `${routeCount}` : "—"}
                </span>
                {/* Supply — plain text, color only */}
                <span style={{ fontFamily: F.sans, fontSize: 12, color: supplyColor[supply] ?? "#A3A3A3", fontWeight: 400 }}>
                  {m.supply}
                </span>
                {/* Status — minimal dot + muted text */}
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: F.sans, fontSize: 12, color: "#999" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", flexShrink: 0, background: statusColor[status] ?? "#D1D5DB" }} />
                  {m.status}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "10px 28px", borderTop: "1px solid #F0F0F0" }}>
          <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>
            Lowest available verified route shown. Click a model to view all providers.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          /* Show: Model(1) Input(2) Routes(5) Supply(6) Status(7) — hide Output(3) Context(4) */
          .model-row { grid-template-columns: 1fr 80px 64px 80px 72px !important; }
          .model-row > *:nth-child(3), .model-row > *:nth-child(4) { display: none; }
        }
        @media (max-width: 600px) {
          /* Show: Model(1) Input(2) Status(7) */
          .model-row { grid-template-columns: 1fr 72px 70px !important; }
          .model-row > *:nth-child(3), .model-row > *:nth-child(4),
          .model-row > *:nth-child(5), .model-row > *:nth-child(6) { display: none; }
        }
      `}</style>
    </section>
  );
}
