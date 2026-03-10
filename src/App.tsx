import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import type { Permission } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import EmployeeSettings from "@/pages/EmployeeSettings";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminEmployees from "@/pages/AdminEmployees";
import AdminPoints from "@/pages/AdminPoints";
import SupervisorTeam from "@/pages/SupervisorTeam";
import SupervisorPoints from "@/pages/SupervisorPoints";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, permission }: { children: React.ReactNode; permission?: Permission }) {
  const { isAuthenticated, user, hasPermission } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (permission && !hasPermission(permission)) {
    const defaultRoute = user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={defaultRoute} replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    const route = user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={route} replace />;
  }
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

    {/* Employee & Supervisor dashboard */}
    <Route path="/dashboard" element={<ProtectedRoute permission="view_own_profile"><EmployeeDashboard /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute permission="change_password"><EmployeeSettings /></ProtectedRoute>} />

    {/* Supervisor */}
    <Route path="/supervisor/team" element={<ProtectedRoute permission="view_department_employees"><SupervisorTeam /></ProtectedRoute>} />
    <Route path="/supervisor/points" element={<ProtectedRoute permission="manage_points"><SupervisorPoints /></ProtectedRoute>} />

    {/* Admin */}
    <Route path="/admin" element={<ProtectedRoute permission="manage_employees"><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/employees" element={<ProtectedRoute permission="manage_employees"><AdminEmployees /></ProtectedRoute>} />
    <Route path="/admin/points" element={<ProtectedRoute permission="manage_points"><AdminPoints /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
