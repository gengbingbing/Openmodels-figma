import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { SEO, JsonLd, ORG_LD, WEBSITE_LD, APP_LD, faqLd } from "./lib/seo";

import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HomeMarketplace } from "./components/HomeMarketplace";
import { ProviderNetwork } from "./components/ProviderNetwork";
import { Plans } from "./components/Plans";
import { Leaderboard } from "./components/Leaderboard";
import { WhyOpenModels } from "./components/WhyOpenModels";
import { ApiSection } from "./components/ApiSection";
import { FAQ } from "./components/FAQ";
import { HomeCtaStrips } from "./components/HomeCtaStrips";
import { InfrastructureSection } from "./components/InfrastructureSection";
import { Footer } from "./components/Footer";
import { SupportButton } from "./components/SupportButton";

import { AuthPage } from "./components/AuthPage";

import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { ApiKeysPage }    from "./components/dashboard/pages/ApiKeysPage";
import { CreditsPage }    from "./components/dashboard/pages/CreditsPage";
import { UsagePage }      from "./components/dashboard/pages/UsagePage";
import { QuickstartPage } from "./components/dashboard/pages/QuickstartPage";
import { ModelsPage }     from "./components/dashboard/pages/ModelsPage";
import { SettingsPage }  from "./components/dashboard/pages/SettingsPage";
import { ReferralPage }  from "./components/dashboard/pages/ReferralPage";
import { RoutesPage }    from "./components/dashboard/pages/RoutesPage";

type View = "landing" | "auth" | "dashboard";
type DashPage = "api-keys" | "credits" | "usage" | "quickstart" | "models" | "routes" | "settings" | "referral";

export interface PartnerContext {
  slug: string;
  name: string;
}

export function LandingApp() {
  const [view, setView]               = useState<View>("landing");
  const [dashPage, setDashPage]       = useState<DashPage>("api-keys");
  const [partnerCtx, setPartnerCtx]   = useState<PartnerContext | null>(null);
  const navigate   = useNavigate();
  const location   = useLocation();
  const [params]   = useSearchParams();

  useEffect(() => {
    /* Legacy state-based auth open */
    if (location.state?.openAuth) {
      setView("auth");
      window.history.replaceState({}, "");
    }
    /* URL-based: ?openDash=1 after returning from /sign-up or /sign-in */
    if (params.get("openDash") === "1") {
      const slug = params.get("partner");
      if (slug) {
        const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        setPartnerCtx({ slug, name });
      }
      setDashPage("api-keys");
      setView("dashboard");
      /* Clean up URL without reloading */
      navigate("/", { replace: true });
    }
  }, [location.state, params]);  // eslint-disable-line react-hooks/exhaustive-deps

  const goAuth = () => setView("auth");
  const goDash = (page: DashPage = "api-keys") => { setDashPage(page); setView("dashboard"); };

  if (view === "dashboard") {
    const pages: Record<DashPage, React.ReactNode> = {
      "api-keys":   <ApiKeysPage partnerContext={partnerCtx} />,
      "credits":    <CreditsPage />,
      "usage":      <UsagePage />,
      "quickstart": <QuickstartPage />,
      "models":     <ModelsPage />,
      "routes":     <RoutesPage />,
      "settings":   <SettingsPage />,
      "referral":   <ReferralPage />,
    };
    return (
      <DashboardLayout
        activePage={dashPage}
        onNavigate={(p) => setDashPage(p as DashPage)}
        onBack={() => setView("landing")}
      >
        {pages[dashPage]}
      </DashboardLayout>
    );
  }

  if (view === "auth") {
    return (
      <AuthPage
        onSuccess={() => goDash("api-keys")}
        onBack={() => setView("landing")}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "var(--font-sans, 'Geist', system-ui, sans-serif)" }}>
      <SEO
        title="OpenModels | Open Marketplace for LLM Tokens"
        description="Buy LLM tokens from verified and community provider routes with transparent pricing, route-level billing, credits, and one OpenAI-compatible API."
        path="/"
      />
      <JsonLd id="org" data={ORG_LD} />
      <JsonLd id="website" data={WEBSITE_LD} />
      <JsonLd id="app" data={APP_LD} />
      <Header onDashboard={goAuth} />
      <main>
        {/* Page frame — provides continuous left/right borders across all sections */}
        <div style={{ maxWidth: 1120, margin: "0 auto", borderLeft: "1px solid #e2e2e2", borderRight: "1px solid #e2e2e2" }}>
          <Hero onGetKey={goAuth} />
          <HomeMarketplace />
          <InfrastructureSection />
          <ProviderNetwork />
          <Leaderboard />
          <WhyOpenModels />
          <Plans onGetKey={goAuth} />
          <ApiSection />
          <FAQ />
          <HomeCtaStrips />
        </div>
      </main>
      <Footer onGetKey={goAuth} />
      <SupportButton />
    </div>
  );
}
