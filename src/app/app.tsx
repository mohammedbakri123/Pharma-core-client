import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProfilePage from "@/pages/ProfilePage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import { Layout } from "@/layout/layout";
import { ProtectedRoute } from "./ProtectedRoute";

import InventoryLayout from "@features/inventory/Inventory";
import InventoryStockPage from "@features/inventory/pages/InventoryPage";
import InventoryMedicinesPage from "@features/inventory/pages/MedicinePage";
import InventoryAdjustmentsPage from "@features/inventory/pages/AdjustmentsPage";
import StockItemDetailPage from "@features/inventory/pages/StockItemDetailPage";
import StockItemOverview from "@features/inventory/components/StockItemDetail/StockItemOverview";
import StockItemBatches from "@features/inventory/components/StockItemDetail/StockItemBatches";

import POS from "@features/pos/Pos";

import PeopleLayout from "@features/people/People";
import PeopleCustomersPage from "@features/people/pages/CustomersPage";
import PeopleSuppliersPage from "@features/people/pages/SuppliersPage";
import CustomerDetailPage from "@features/people/pages/CustomerDetailPage";
import CustomerOverviewTab from "@features/people/components/CustomerDetails/CustomerOverviewTab";
import CustomerSalesTab from "@features/people/components/CustomerDetails/CustomerSalesTab";
import CustomerStatementTab from "@features/people/components/CustomerDetails/CustomerStatementTab";

import FinanceLayout from "@features/finance/Finance";
import FinanceSalesPage from "@features/finance/pages/SalesPage";
import FinancePurchasesPage from "@features/finance/pages/PurchasesPage";
import FinanceExpensesPage from "@features/finance/pages/ExpensesPage";
import FinancePaymentsPage from "@features/finance/pages/PaymentsPage";
import SaleDetailPage from "@features/finance/pages/SaleDetailPage";
import SaleItemsTab from "@features/finance/components/SaleDetail/SaleItemsTab";
import SalePaymentsTab from "@features/finance/components/SaleDetail/SalePaymentsTab";
import SaleReturnsTab from "@features/finance/components/SaleDetail/SaleReturnsTab";
import SaleReturnDetailPage from "@features/finance/pages/SaleReturnDetailPage";
import PurchaseDetailPage from "@features/finance/pages/PurchaseDetailPage";
import PurchaseItemsTab from "@features/finance/components/PurchaseDetail/PurchaseItemsTab";
import PurchasePaymentsTab from "@features/finance/components/PurchaseDetail/PurchasePaymentsTab";
import PurchaseReturnsTab from "@features/finance/components/PurchaseDetail/PurchaseReturnsTab";

import SettingsLayout from "@features/settings/pages/SettingsPage";
import SettingsGeneralPage from "@features/settings/components/general/GeneralSettings";
import SettingsUsersPage from "@features/settings/components/users/UsersSettings";
import SettingsBackupPage from "@features/settings/components/BackupPlaceholder";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />

            {/* Inventory */}
            <Route path="inventory" element={<InventoryLayout />}>
              <Route index element={<Navigate to="stock" replace />} />
              <Route path="stock" element={<InventoryStockPage />} />
              <Route path="medicines" element={<InventoryMedicinesPage />} />
              <Route
                path="adjustments"
                element={<InventoryAdjustmentsPage />}
              />
            </Route>
            <Route path="inventory/stock/:id" element={<StockItemDetailPage />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<StockItemOverview />} />
              <Route path="batches" element={<StockItemBatches />} />
            </Route>

            <Route path="pos" element={<POS />} />

            {/* People */}
            <Route path="people" element={<PeopleLayout />}>
              <Route index element={<Navigate to="customers" replace />} />
              <Route path="customers" element={<PeopleCustomersPage />} />
              <Route path="suppliers" element={<PeopleSuppliersPage />} />
            </Route>
            <Route path="people/customer/:id" element={<CustomerDetailPage />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<CustomerOverviewTab />} />
              <Route path="sales" element={<CustomerSalesTab />} />
              <Route path="statement" element={<CustomerStatementTab />} />
            </Route>

            {/* Finance */}
            <Route path="finance" element={<FinanceLayout />}>
              <Route index element={<Navigate to="payments" replace />} />
              <Route path="payments" element={<FinancePaymentsPage />} />
              <Route path="sales" element={<FinanceSalesPage />} />
              <Route path="purchases" element={<FinancePurchasesPage />} />
              <Route path="expenses" element={<FinanceExpensesPage />} />
            </Route>
            <Route path="finance/sales/:id" element={<SaleDetailPage />}>
              <Route index element={<Navigate to="items" replace />} />
              <Route path="items" element={<SaleItemsTab />} />
              <Route path="payments" element={<SalePaymentsTab />} />
              <Route path="returns" element={<SaleReturnsTab />} />
            </Route>
            <Route
              path="finance/sales/:id/returns/:returnId"
              element={<SaleReturnDetailPage />}
            />

            <Route
              path="finance/purchases/:id"
              element={<PurchaseDetailPage />}
            >
              <Route index element={<Navigate to="items" replace />} />
              <Route path="items" element={<PurchaseItemsTab />} />
              <Route path="payments" element={<PurchasePaymentsTab />} />
              <Route path="returns" element={<PurchaseReturnsTab />} />
            </Route>

            <Route
              path="invoices"
              element={<Navigate to="/finance" replace />}
            />

            {/* Settings */}
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<SettingsGeneralPage />} />
              <Route path="users" element={<SettingsUsersPage />} />
              <Route path="backup" element={<SettingsBackupPage />} />
            </Route>
            <Route path="profile" element={<ProfilePage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
