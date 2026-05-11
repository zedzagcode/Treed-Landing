import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePageTracking } from "@/hooks/usePageTracking";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Solution from "@/pages/Solution";
import Handset from "@/pages/Handset";
import Tree from "@/pages/Tree";
import Dashboard from "@/pages/Dashboard";
import VisitorExperience from "@/pages/VisitorExperience";
import Sustainability from "@/pages/Sustainability";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Careers from "@/pages/Careers";
import Booking from "@/pages/Booking";
import RevenueSharing from "@/pages/RevenueSharing";
import Blog from "@/pages/Blog";
import BlogRouter from "@/pages/BlogRouter";
import RequestPricing from "@/pages/RequestPricing";
import UseCases from "@/pages/UseCases";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import TermsOfUse from "@/pages/TermsOfUse";
import { Chatbot } from "@/components/Chatbot";
import { CookieBanner } from "@/components/CookieBanner";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ThemeProvider } from "@/contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/solution" component={Solution} />
      <Route path="/handset" component={Handset} />
      <Route path="/tree" component={Tree} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/visitor-experience" component={VisitorExperience} />
      <Route path="/sustainability" component={Sustainability} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/careers" component={Careers} />
      <Route path="/booking" component={Booking} />
      <Route path="/revenue-sharing" component={RevenueSharing} />
      <Route path="/request-pricing" component={RequestPricing} />
      <Route path="/blog/:slug" component={BlogRouter} />
      <Route path="/use-cases" component={UseCases} />
      <Route path="/blog" component={Blog} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route component={NotFound} />
    </Switch>
  );
}

import SmoothScroll from "@/components/ui/SmoothScroll";

function App() {
  usePageTracking();
  
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SmoothScroll>
          <ScrollToTop />
          <TooltipProvider>
            <Toaster />
            <Router />
            <Chatbot />
            <CookieBanner />
          </TooltipProvider>
        </SmoothScroll>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
