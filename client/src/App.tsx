import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useEffect } from "react";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import CSR from "./pages/CSR";
import Industries from "./pages/Industries";
import IndustryDetail from "./pages/IndustryDetail";
import Solutions from "./pages/Solutions";
import SolutionCategory from "./pages/SolutionCategory";
import SolutionDetail from "./pages/SolutionDetail";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Portal from "./pages/Portal";
import AdminPortal from "./pages/AdminPortal";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PortalLogin from "./pages/portal/PortalLogin";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalTickets from "./pages/portal/PortalTickets";
import PortalNewTicket from "./pages/portal/PortalNewTicket";
import AdminCustomers from "./pages/portal/AdminCustomers";
import AdminTickets from "./pages/portal/AdminTickets";
import AdminLogin from "./pages/portal/AdminLogin";
import AdminStaff from "./pages/portal/AdminStaff";
import PortalTicketHistory from "./pages/portal/PortalTicketHistory";
import { PortalProvider } from "./contexts/PortalContext";
import { AdminProvider } from "./contexts/AdminContext";

// Language sync component
function LanguageSyncRouter() {
  const [location] = useLocation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Extract language from URL path
    const pathSegments = location.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    if (firstSegment === "kr") {
      setLanguage("ko");
    } else if (firstSegment === "jp") {
      setLanguage("ja");
    } else if (firstSegment === "en") {
      setLanguage("en");
    } else {
      // Default to English for root path
      setLanguage("en");
    }
  }, [location, setLanguage]);

  return (
    <Switch>
      {/* English routes (default) */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/about/csr" component={CSR} />
      <Route path="/industries" component={Industries} />
      <Route path="/industries/:slug" component={IndustryDetail} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/solutions/:category" component={SolutionCategory} />
      <Route path="/solutions/:category/:slug" component={SolutionDetail} />
      <Route path="/insights" component={Insights} />
      <Route path="/insights/:slug" component={InsightDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/careers" component={Careers} />
      <Route path="/portal" component={Portal} />
      <Route path="/admin" component={AdminPortal} />
      <Route path="/portal/login" component={PortalLogin} />
      <Route path="/portal/dashboard" component={PortalDashboard} />
      <Route path="/portal/tickets/new" component={PortalNewTicket} />
      <Route path="/portal/tickets" component={PortalTickets} />
      <Route path="/portal/history" component={PortalTicketHistory} />
      <Route path="/portal/admin/login" component={AdminLogin} />
      <Route path="/portal/admin/customers" component={AdminCustomers} />
      <Route path="/portal/admin/tickets" component={AdminTickets} />
      <Route path="/portal/admin/staff" component={AdminStaff} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* English routes with /en prefix */}
      <Route path="/en" component={Home} />
      <Route path="/en/about" component={About} />
      <Route path="/en/about/csr" component={CSR} />
      <Route path="/en/industries" component={Industries} />
      <Route path="/en/industries/:slug" component={IndustryDetail} />
      <Route path="/en/solutions" component={Solutions} />
      <Route path="/en/solutions/:category" component={SolutionCategory} />
      <Route path="/en/solutions/:category/:slug" component={SolutionDetail} />
      <Route path="/en/insights" component={Insights} />
      <Route path="/en/insights/:slug" component={InsightDetail} />
      <Route path="/en/contact" component={Contact} />
      <Route path="/en/careers" component={Careers} />
      <Route path="/en/portal" component={Portal} />
      <Route path="/en/admin" component={AdminPortal} />
      <Route path="/en/portal/login" component={PortalLogin} />
      <Route path="/en/portal/dashboard" component={PortalDashboard} />
      <Route path="/en/portal/tickets/new" component={PortalNewTicket} />
      <Route path="/en/portal/tickets" component={PortalTickets} />
      <Route path="/en/portal/admin/login" component={AdminLogin} />
      <Route path="/en/portal/admin/customers" component={AdminCustomers} />
      <Route path="/en/portal/admin/tickets" component={AdminTickets} />
      <Route path="/en/portal/admin/staff" component={AdminStaff} />
      <Route path="/en/privacy" component={Privacy} />
      <Route path="/en/terms" component={Terms} />

      {/* Korean routes */}
      <Route path="/kr" component={Home} />
      <Route path="/kr/about" component={About} />
      <Route path="/kr/about/csr" component={CSR} />
      <Route path="/kr/industries" component={Industries} />
      <Route path="/kr/industries/:slug" component={IndustryDetail} />
      <Route path="/kr/solutions" component={Solutions} />
      <Route path="/kr/solutions/:category" component={SolutionCategory} />
      <Route path="/kr/solutions/:category/:slug" component={SolutionDetail} />
      <Route path="/kr/insights" component={Insights} />
      <Route path="/kr/insights/:slug" component={InsightDetail} />
      <Route path="/kr/contact" component={Contact} />
      <Route path="/kr/careers" component={Careers} />
      <Route path="/kr/portal" component={Portal} />
      <Route path="/kr/admin" component={AdminPortal} />
      <Route path="/kr/portal/login" component={PortalLogin} />
      <Route path="/kr/portal/dashboard" component={PortalDashboard} />
      <Route path="/kr/portal/tickets/new" component={PortalNewTicket} />
      <Route path="/kr/portal/tickets" component={PortalTickets} />
      <Route path="/kr/portal/admin/login" component={AdminLogin} />
      <Route path="/kr/portal/admin/customers" component={AdminCustomers} />
      <Route path="/kr/portal/admin/tickets" component={AdminTickets} />
      <Route path="/kr/portal/admin/staff" component={AdminStaff} />
      <Route path="/kr/privacy" component={Privacy} />
      <Route path="/kr/terms" component={Terms} />

      {/* Japanese routes */}
      <Route path="/jp" component={Home} />
      <Route path="/jp/about" component={About} />
      <Route path="/jp/about/csr" component={CSR} />
      <Route path="/jp/industries" component={Industries} />
      <Route path="/jp/industries/:slug" component={IndustryDetail} />
      <Route path="/jp/solutions" component={Solutions} />
      <Route path="/jp/solutions/:category" component={SolutionCategory} />
      <Route path="/jp/solutions/:category/:slug" component={SolutionDetail} />
      <Route path="/jp/insights" component={Insights} />
      <Route path="/jp/insights/:slug" component={InsightDetail} />
      <Route path="/jp/contact" component={Contact} />
      <Route path="/jp/careers" component={Careers} />
      <Route path="/jp/portal" component={Portal} />
      <Route path="/jp/admin" component={AdminPortal} />
      <Route path="/jp/portal/login" component={PortalLogin} />
      <Route path="/jp/portal/dashboard" component={PortalDashboard} />
      <Route path="/jp/portal/tickets/new" component={PortalNewTicket} />
      <Route path="/jp/portal/tickets" component={PortalTickets} />
      <Route path="/jp/portal/admin/login" component={AdminLogin} />
      <Route path="/jp/portal/admin/customers" component={AdminCustomers} />
      <Route path="/jp/portal/admin/tickets" component={AdminTickets} />
      <Route path="/jp/portal/admin/staff" component={AdminStaff} />
      <Route path="/jp/privacy" component={Privacy} />
      <Route path="/jp/terms" component={Terms} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <PortalProvider>
            <AdminProvider>
              <TooltipProvider>
                <Toaster />
                <LanguageSyncRouter />
              </TooltipProvider>
            </AdminProvider>
          </PortalProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
