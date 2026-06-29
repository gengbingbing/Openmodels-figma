import { useSearchParams, useNavigate } from "react-router";
import { AuthPage } from "./AuthPage";

/* ─── Partner display data ─────────────────────────────── */
const PARTNER_META: Record<string, { name: string; accent: string }> = {
  "acme-ai":   { name: "Acme AI",   accent: "#0047FF" },
  "nexus-llm": { name: "Nexus LLM", accent: "#7C3AED" },
  "openroute": { name: "OpenRoute", accent: "#0EA5E9" },
};

function resolvePartner(slug: string | null) {
  if (!slug) return null;
  const meta = PARTNER_META[slug];
  if (meta) return { slug, ...meta };
  /* Fallback: format slug as title */
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { slug, name, accent: "#0047FF" };
}

export function SignUpPage() {
  const [params] = useSearchParams();
  const navigate  = useNavigate();
  const partner   = resolvePartner(params.get("partner"));

  const handleSuccess = () => {
    /* After auth: go to landing with openDash + partner context */
    const search = partner ? `?openDash=1&partner=${partner.slug}` : "?openDash=1";
    navigate(`/${search}`);
  };

  return (
    <AuthPage
      onSuccess={handleSuccess}
      onBack={() => navigate(partner ? `/p/${partner.slug}` : "/")}
      defaultMode="signup"
      partnerSlug={partner?.slug}
      partnerName={partner?.name}
      partnerAccent={partner?.accent}
    />
  );
}

export function SignInPage() {
  const [params] = useSearchParams();
  const navigate  = useNavigate();
  const partner   = resolvePartner(params.get("partner"));

  const handleSuccess = () => {
    const search = partner ? `?openDash=1&partner=${partner.slug}` : "?openDash=1";
    navigate(`/${search}`);
  };

  return (
    <AuthPage
      onSuccess={handleSuccess}
      onBack={() => navigate(partner ? `/p/${partner.slug}` : "/")}
      defaultMode="signin"
      partnerSlug={partner?.slug}
      partnerName={partner?.name}
      partnerAccent={partner?.accent}
    />
  );
}
