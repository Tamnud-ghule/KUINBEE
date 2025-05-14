import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/components/LandingPage";
import SiteLayout from "@/components/common/SiteLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./page-transition.css";

// Marketplace pages
import MarketplaceHome from "@/pages/marketplace/Home";
import Datasets from "@/pages/marketplace/Datasets";
import Dataset from "@/pages/marketplace/DatasetDetail";
import CategoryPage from "@/pages/marketplace/CategoryPage";
import Categories from "@/pages/marketplace/Categories";
import Cart from "@/pages/marketplace/Cart";
import Purchases from "@/pages/marketplace/Purchases";
import ApiKey from "@/pages/marketplace/ApiKey";
import Profile from "@/pages/marketplace/Profile";
import Download from "@/pages/marketplace/Download";

// Admin pages
import AdminLogin from "@/admin/pages/login";
import AdminDashboard from "@/admin/pages/dashboard";
import AdminDatasets from "@/admin/pages/datasets";
import AdminCategories from "@/admin/pages/categories";
import AdminSales from "@/admin/pages/sales";
import { RequireAdmin } from "@/admin/components/RequireAdmin";

function Router() {
  const [location] = useLocation();
  return (
    <SiteLayout>
      <TransitionGroup component={null}>
        <CSSTransition key={location} classNames="fade" timeout={300}>
          <div className="page-transition-wrapper">
            <Switch location={location}>
              {/* Landing page */}
              <Route path="/" component={LandingPage} />
              
              {/* Authentication */}
              <Route path="/auth" component={AuthPage} />
              
              {/* Marketplace routes - protected */}
              <ProtectedRoute path="/marketplace" component={MarketplaceHome} />
              <ProtectedRoute path="/home" component={MarketplaceHome} />
              <ProtectedRoute path="/datasets" component={Datasets} />
              <ProtectedRoute path="/categories" component={Categories} />
              <ProtectedRoute path="/dataset/:id" component={Dataset} />
              <ProtectedRoute path="/category/:name" component={CategoryPage} />
              <ProtectedRoute path="/cart" component={Cart} />
              <ProtectedRoute path="/purchases" component={Purchases} />
              <ProtectedRoute path="/api-key" component={ApiKey} />
              <ProtectedRoute path="/profile" component={Profile} />
              <ProtectedRoute path="/download/:id" component={Download} />
              
              {/* Admin routes */}
              <Route path="/admin/login" component={AdminLogin} />
              <RequireAdmin path="/admin/dashboard" component={AdminDashboard} />
              <RequireAdmin path="/admin/datasets" component={AdminDatasets} />
              <RequireAdmin path="/admin/categories" component={AdminCategories} />
              <RequireAdmin path="/admin/sales" component={AdminSales} />
              
              {/* Redirect /admin to dashboard */}
              <Route path="/admin">
                {() => {
                  window.location.href = "/admin/dashboard";
                  return null;
                }}
              </Route>
              
              {/* 404 page */}
              <Route component={NotFound} />
            </Switch>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </SiteLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
