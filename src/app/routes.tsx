import { createBrowserRouter } from "react-router";
import { LandingApp } from "./LandingApp";
import { ModelDetailPage } from "./components/ModelDetailPage";
import { CompanyPage } from "./components/CompanyPage";
import { ContactPage } from "./components/ContactPage";
import { ProviderApplyPage } from "./components/ProviderApplyPage";
import { ModelsMarketplacePage } from "./components/ModelsMarketplacePage";
import { PlansPage }  from "./components/PlansPage";
import { DocsPage }            from "./components/DocsPage";
import { ProviderDetailPage } from "./components/ProviderDetailPage";
import { PartnerPage }        from "./components/PartnerPage";
import { PartnerStartPage }  from "./components/PartnerStartPage";
import { PartnerApp }              from "./components/PartnerApp";
import { PartnerMarketplacePage }  from "./components/PartnerMarketplacePage";
import { SignUpPage, SignInPage }   from "./components/SignUpPage";
import { ProviderConsole }         from "./components/ProviderConsole";
import { X402Page }         from "./components/X402Page";
import { X402DetailPage }   from "./components/X402DetailPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingApp },
  { path: "/models", Component: ModelsMarketplacePage },
  { path: "/plans",  Component: PlansPage },
  { path: "/docs",                       Component: DocsPage },
  { path: "/providers/:providerSlug",   Component: ProviderDetailPage },
  { path: "/partners",                  Component: PartnerPage },
  { path: "/partner/start",            Component: PartnerStartPage },
  { path: "/partner/overview",         Component: PartnerApp },
  { path: "/provider-console",         Component: ProviderConsole },
  { path: "/p/:slug",                  Component: PartnerMarketplacePage },
  { path: "/sign-up",                  Component: SignUpPage },
  { path: "/sign-in",                  Component: SignInPage },
  { path: "/models/:modelId", Component: ModelDetailPage },
  { path: "/company", Component: CompanyPage },
  { path: "/contact", Component: ContactPage },
  { path: "/providers/apply", Component: ProviderApplyPage },
  { path: "/x402", Component: X402Page },
  { path: "/x402/endpoints/:endpointId", Component: X402DetailPage },
  { path: "*", Component: LandingApp },
]);
