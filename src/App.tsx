import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DepartmentProvider } from "@/contexts/DepartmentContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoleInsight from "./pages/RoleInsight";
import MarketSensing from "./pages/MarketSensing";
import DemandSensing from "./pages/DemandSensing";
import ApprovedOpportunities from "./pages/ApprovedOpportunities";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DepartmentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public route */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/market-sensing" replace /> : <Login onLogin={handleLogin} />
              } 
            />

            {/* Protected routes */}
            {isAuthenticated ? (
              <Route element={<AppLayout onLogout={handleLogout} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/market-sensing" element={<MarketSensing />} />
                <Route path="/demand-sensing" element={<DemandSensing />} />
                <Route path="/role-insight/:roleId" element={<RoleInsight />} />
                <Route path="/approved-opportunities" element={<ApprovedOpportunities />} />
                <Route path="/" element={<Navigate to="/market-sensing" replace />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DepartmentProvider>
    </QueryClientProvider>
  );
};

export default App;
