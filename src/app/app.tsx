import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CustomersPage from "@/pages/CustomersPage";
import ProfilePage from "@/pages/ProfilePage";
import Settings from "@features/settings/Settings";
import Invoices from "@features/invoices/Invoices";
import DashboardPage from "@/pages/DashboardPage";
import InventoryPage from "@/pages/InventoryPage";
import Reports from "@features/reports/Reports";
import NotFound from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import { Layout } from "@/layout/layout";
import POS from "@features/pos/Pos";
import { ProtectedRoute } from "./ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 🔹 خارج Layout */}
          <Route path="/login" element={<LoginPage />} />

          {/* 🔹 داخل Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="pos" element={<POS />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
