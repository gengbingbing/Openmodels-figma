import { useNavigate } from "react-router";
import { ArrowRight, Store } from "lucide-react";
import { F, WS } from "../lib/type";

const B  = "1px solid #e2e2e2";
const Bs = "1px solid #eeeeee";
const blue = "#0047FF";

const categories = [
  { label: "Chat models",       count: "186 models", from: "from $0.04 /1M", filter: "Chat"      },
  { label: "Coding models",     count: "72 models",  from: "from $0.18 /1M", filter: "Coding"    },
  { label: "Reasoning models",  count: "48 models",  from: "from $0.28 /1M", filter: "Reasoning" },
  { label: "Embedding models",  count: "19 models",  from: "from $0.05 /1M", filter: "Embedding" },
  { label: "Multimodal models", count: "8 models",   from: "from $0.20 /1M", filter: "All"       },
];

export function HomeMarketplace() {
  const navigate = useNavigate();

  const goFilter = (filter: string) => {
    navigate("/models", { state: { filter } });
  };

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
        {categories.map((cat, i) => (
          <div
            key={cat.label}
            onClick={() => goFilter(cat.filter)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 32px", minHeight: 64,
              borderBottom: i < categories.length - 1 ? Bs : "none",
              cursor: "pointer", transition: "background 80ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: "#111" }}>
                {cat.label}
              </span>
              <span style={{ fontFamily: F.sans, fontSize: WS.meta, color: "#A3A3A3" }}>
                {cat.count}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontFamily: F.mono, fontSize: WS.body, color: "#555" }}>
                {cat.from}
              </span>
              <ArrowRight size={13} color="#C0C0C0" strokeWidth={1.5} />
            </div>
          </div>
        ))}

        {/* Footer link */}
        <div style={{ padding: "16px 32px", borderTop: B, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <a
            href="/models"
            style={{ fontFamily: F.sans, fontSize: WS.body, fontWeight: 500, color: blue, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "opacity 100ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View all models →
          </a>
        </div>
      </div>
    </section>
  );
}
