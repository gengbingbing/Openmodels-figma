import { createBrowserRouter } from "react-router";
import { LandingApp } from "./LandingApp";
import { ModelDetailPage } from "./components/ModelDetailPage";
import { CompanyPage } from "./components/CompanyPage";
import { ContactPage } from "./components/ContactPage";
import { ProviderApplyPage } from "./components/ProviderApplyPage";
import { ModelsMarketplacePage } from "./components/ModelsMarketplacePage";
import { PlansPage }  from "./components/PlansPage";
import { DocsPage }   from "./components/DocsPage";
import { X402Page }         from "./components/X402Page";
import { X402DetailPage }   from "./components/X402DetailPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingApp },
  { path: "/models", Component: ModelsMarketplacePage },
  { path: "/plans",  Component: PlansPage },
  { path: "/docs",   Component: DocsPage },
  { path: "/models/:modelId", Component: ModelDetailPage },
  { path: "/company", Component: CompanyPage },
  { path: "/contact", Component: ContactPage },
  { path: "/providers/apply", Component: ProviderApplyPage },
  { path: "/x402", Component: X402Page },
  { path: "/x402/endpoints/:endpointId", Component: X402DetailPage },
  { path: "*", Component: LandingApp },
]);
