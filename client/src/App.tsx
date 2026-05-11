import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

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

function Router() {
  return (
    <Switch>
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
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
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
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
