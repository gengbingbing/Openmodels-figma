import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Store, MessageSquare, Code2, BrainCircuit, SearchCode, Layers } from "lucide-react";
import { F, WS } from "../lib/type";

const B    = "1px solid #e2e2e2";
const blue = "#0047FF";

const categories = [
  { label: "Chat models",       desc: "General text and assistant workloads",       count: "186 models", from: "from $0.04 /1M", filter: "Chat",      Icon: MessageSquare },
  { label: "Coding models",     desc: "Code generation and agent coding",            count: "72 models",  from: "from $0.18 /1M", filter: "Coding",    Icon: Code2         },
  { label: "Reasoning models",  desc: "Complex reasoning and multi-step tasks",      count: "48 models",  from: "from $0.28 /1M", filter: "Reasoning", Icon: BrainCircuit  },
  { label: "Embedding models",  desc: "Search, retrieval, and semantic matching",    count: "19 models",  from: "from $0.05 /1M", filter: "Embedding", Icon: SearchCode    },
  { label: "Multimodal models", desc: "Image, audio, and mixed-input models",        count: "8 models",   from: "from $0.20 /1M", filter: "All",       Icon: Layers        },
];

export function HomeMarketplace() {
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="models">
      <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: B }}>

        {/* Header */}
        <div style={{ padding: "40px 32px 28px", borderBottom: B }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <Store size={11} color={blue} strokeWidth={2} />
            <span style={{ fontFamily: F.sans, fontSize: WS.meta, fontWeight: 600, color: blue, letterSpacing: "0.04em" }}>MARKETPLACE</span>
          </div>
          <h2 style={{ fontFamily: F.sans, fontSize: WS.section, fontWeight: 600, letterSpacing: 0, color: "#0a0a0a", marginBottom: 6 }}>
            Explore token supply by model type
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: WS.body, color: "#666", lineHeight: 1.6, margin: 0 }}>
            Browse LLM token categories and open the full marketplace to compare provider routes.
          </p>
        </div>

        {/* Category rows */}
        {categories.map((cat, i) => {
          const hovered = hoveredIdx === i;
          const iconColor = hovered ? "#0052FF" : "#8A8A8A";
          return (
            <div
              key={cat.label}
              onClick={() => navigate("/models", { state: { filter: cat.filter } })}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 32px", height: 72,
                borderBottom: i < categories.length - 1 ? "1px solid #EDEDED" : "none",
                cursor: "pointer", transition: "background 80ms",
                background: hovered ? "#FAFAFA" : "transparent",
              }}
            >
              {/* Left */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Icon column — fixed 32px */}
                <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <cat.Icon size={16} strokeWidth={1.5} color={iconColor} style={{ transition: "color 100ms" }} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                    <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>
                      {cat.label}
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#C0C0C0" }}>
                      {cat.count}
                    </span>
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#B0B0B0" }}>
                    {cat.desc}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <span style={{ fontFamily: F.mono, fontSize: WS.body, color: "#777" }}>
                  {cat.from}
                </span>
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  color={hovered ? "#0052FF" : "#D0D0D0"}
                  style={{ transition: "color 100ms", flexShrink: 0 }}
                />
              </div>
            </div>
          );
        })}

        {/* Footer link */}
        <div style={{ padding: "14px 32px", borderTop: B, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <a
            href="/models"
            style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#888", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "color 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = blue)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            View all models →
          </a>
        </div>
      </div>
    </section>
  );
}
