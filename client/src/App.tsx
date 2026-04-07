import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTE_PATHS } from "@/lib/index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CashierLogin from "@/pages/login/CashierLogin";
import ManagerLogin from "@/pages/login/ManagerLogin";
import AdminLogin from "@/pages/login/AdminLogin";
import Dashboard from "@/pages/Dashboard";
import SalesPage from "@/pages/dashboard/Sales";
import InventoryPage from "@/pages/dashboard/Inventory";
import CustomersPage from "@/pages/dashboard/Customers";
import ReportsPage from "@/pages/dashboard/Reports";
import SettingsPage from "@/pages/dashboard/Settings";
import Products from "@/pages/Products";
import Inventory from "@/pages/Inventory";
import POS from "@/pages/POS";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import Suppliers from "@/pages/Suppliers";
import Employees from "@/pages/Employees";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import CashierDashboard from "@/pages/dashboard/CashierDashboard";
import ManagerDashboard from "@/pages/dashboard/ManagerDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import Landing from "@/pages/home/Landing";

import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTE_PATHS.LOGIN, { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path={ROUTE_PATHS.HOME}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
          ) : (
            <Landing />
          )
        }
      />
      <Route
        path={ROUTE_PATHS.LOGIN}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path={ROUTE_PATHS.SIGNUP}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
          ) : (
            <Signup />
          )
        }
      />
      <Route
        path={ROUTE_PATHS.LOGIN_CASHIER}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
          ) : (
            <CashierLogin />
          )
        }
      />
      <Route
        path={ROUTE_PATHS.LOGIN_MANAGER}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
          ) : (
            <ManagerLogin />
          )
        }
      />
      <Route
        path={ROUTE_PATHS.LOGIN_ADMIN}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
          ) : (
            <AdminLogin />
          )
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_POS}
        element={
          <ProtectedRoute>
            <CashierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_MANAGER}
        element={
          <ProtectedRoute>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_ADMIN}
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.PRODUCTS}
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.INVENTORY}
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.POS}
        element={
          <ProtectedRoute>
            <POS />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.ORDERS}
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.CUSTOMERS}
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.SUPPLIERS}
        element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.EMPLOYEES}
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.REPORTS}
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.SETTINGS}
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_SALES}
        element={
          <ProtectedRoute>
            <SalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_INVENTORY}
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_CUSTOMERS}
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_REPORTS}
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD_SETTINGS}
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
          ) : (
            <Navigate to={ROUTE_PATHS.HOME} replace />
          )
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AppRoutes />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;