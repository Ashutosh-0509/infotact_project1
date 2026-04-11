import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTE_PATHS } from "@/lib/index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CashierLogin from "@/pages/login/CashierLogin";
import ManagerLogin from "@/pages/login/ManagerLogin";
import AdminLogin from "@/pages/login/AdminLogin";
import Dashboard from "@/pages/Dashboard";
import UsersPage from "@/pages/dashboard/Users";
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
// import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import Landing from "@/pages/home/Landing";
import AIPredictions from "@/pages/AIPredictions";

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
  allowedRole?: string;
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // Wrong role
  const normalizedRole = role?.toLowerCase();
  const normalizedAllowedRole = allowedRole?.toLowerCase();

  if (normalizedAllowedRole && normalizedRole !== normalizedAllowedRole) {
    // Redirect to correct dashboard
    if (normalizedRole === 'cashier' || normalizedRole === 'staff') 
      return <Navigate to="/dashboard/pos" replace />;
    if (normalizedRole === 'manager') 
      return <Navigate to="/dashboard/manager" replace />;
    if (normalizedRole === 'admin') 
      return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login/cashier" element={<CashierLogin />} />
      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      
      {/* Protected Routes - Cashier */}
      <Route path="/dashboard/pos" element={
        <ProtectedRoute allowedRole="cashier">
          <CashierDashboard />
        </ProtectedRoute>
      } />
      
      {/* Protected Routes - Manager */}
      <Route path="/dashboard/manager" element={
        <ProtectedRoute allowedRole="manager">
          <ManagerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/manager/inventory" element={
        <ProtectedRoute allowedRole="manager">
          <ManagerDashboard page="inventory" />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/manager/employees" element={
        <ProtectedRoute allowedRole="manager">
          <ManagerDashboard page="employees" />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/manager/reports" element={
        <ProtectedRoute allowedRole="manager">
          <ManagerDashboard page="reports" />
        </ProtectedRoute>
      } />
      
      {/* Protected Routes - Admin (NEXUS) */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/sales" element={
        <ProtectedRoute allowedRole="admin">
          <SalesPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/inventory" element={
        <ProtectedRoute allowedRole="admin">
          <InventoryPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/customers" element={
        <ProtectedRoute allowedRole="admin">
          <CustomersPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/reports" element={
        <ProtectedRoute allowedRole="admin">
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/users" element={
        <ProtectedRoute allowedRole="admin">
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/settings" element={
        <ProtectedRoute allowedRole="admin">
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/ai-predictions" element={
        <ProtectedRoute allowedRole="admin">
          <AIPredictions />
        </ProtectedRoute>
      } />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;