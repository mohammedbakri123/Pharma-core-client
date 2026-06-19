import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PeoplePage from "@/pages/PeoplePage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import Invoices from "@features/invoices/Invoices";
import DashboardPage from "@/pages/DashboardPage";
import InventoryPage from "@/pages/InventoryPage";
import StockItemDetailPage from "@pages/StockItemDetailPage";

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

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

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
            <Route path="inventory/stock/:id" element={<StockItemDetailPage />} />
            <Route path="pos" element={<POS />} />
            <Route path="people" element={<PeoplePage />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
