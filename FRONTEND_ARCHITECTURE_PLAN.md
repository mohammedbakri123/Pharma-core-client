# Pharma-Core Frontend Architecture Plan

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Backend Analysis](#backend-analysis)
3. [Current Frontend State](#current-frontend-state)
4. [Architecture Principles](#architecture-principles)
5. [Feature Implementation Plan](#feature-implementation-plan)
6. [Phase-by-Phase Execution](#phase-by-phase-execution)
7. [File Structure](#file-structure)
8. [Technical Specifications](#technical-specifications)

---

## Project Overview

**Pharma-Core** is a pharmacy management system with:
- **Backend:** .NET 10 Web API (PharmaCore.API)
- **Frontend:** React 19 + TypeScript + Vite 7
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style)
- **State:** TanStack Query v5 (server) + Zustand v5 (client)
- **Routing:** React Router DOM v7

### Goals
- Manage medicines, inventory, sales, purchases, customers, suppliers
- Point-of-sale (POS) system
- Financial tracking (expenses, payments, returns)
- Business reports and analytics
- User and role management

---

## Backend Analysis

### Controllers & Endpoints Mapping

| Controller | Route Prefix | Key Endpoints |
|------------|---------------|----------------|
| **AuthController** | `/auth` | `POST /login`, `POST /logout`, `GET /me` |
| **MedicinesController** | `/medicines` | CRUD, search, deleted list, restore, hard-delete |
| **CategoriesController** | `/categories` | CRUD, deleted list, restore, hard-delete |
| **CustomersController** | `/customers` | CRUD, sales history, debt, statement, pay, unpaid-sales |
| **SuppliersController** | `/suppliers` | CRUD only |
| **InventoryController** | `/inventory` | stock, batches, low-stock, expiring, adjust |
| **SalesController** | `/sales` | CRUD, items management, complete, cancel, balance |
| **PurchasesController** | `/purchases` | CRUD, items, complete, cancel, returns, balance |
| **SalesReturnsController** | `/sales-returns` | CRUD, items management |
| **PaymentsController** | `/payments` | CRUD, filter by sale/purchase |
| **ExpensesController** | `/expenses` | CRUD (with automatic payment OUT) |
| **PosController** | `/pos` | search, scan barcode, quick-stock |
| **ReportsController** | `/reports` | daily-sales, range, profit, stock, expired, payments |
| **UsersController** | `/users` | CRUD, hard-delete (admin only) |
| **SystemController** | `/` | health check, backup, restore (admin) |

### Backend Features Summary
- **Soft delete pattern:** All entities support soft delete + restore + hard delete
- **Pagination:** Consistent `page`, `limit` query params
- **Role-based auth:** JWT with roles (ADMIN, etc.)
- **Financial tracking:** Payments linked to sales/purchases/expenses
- **FEFO:** First-Expiry-First-Out for batches

---

## Current Frontend State

### ✅ What Exists
- Basic routing with React Router DOM
- API client with axios interceptors
- Zustand auth store with persistence
- Some features: dashboard, inventory, pos, patients (⚠️ wrong name), invoices, reports, settings, authentication
- shadcn/ui components installed

### ❌ What's Missing/Wrong
1. **Wrong naming:** "Patients" should be "Customers" (backend uses customers)
2. **Missing features:** medicines page, categories, suppliers, purchases, sales-returns, expenses, users
3. **Incomplete features:** 
   - Reports only has placeholder
   - POS needs barcode scanning integration
   - Inventory needs alerts (low stock, expiring)
4. **Import path issues:** Mixed `src/` and `@/` imports (partially fixed in Phase 1)
5. **No form validation:** Missing React Hook Form + Zod
6. **No code quality tools:** Missing ESLint/Prettier

---

## Architecture Principles

### 1. Feature-Sliced Design
```
features/
├── [feature-name]/
│   ├── components/      # UI components specific to feature
│   ├── hooks/           # Custom hooks for data fetching
│   ├── pages/            # Page components (route entries)
│   ├── types.ts         # Feature-specific types
│   └── index.ts         # Barrel exports
```

### 2. State Management Strategy
| State Type | Tool | Example |
|------------|------|---------|
| Server state (API data) | TanStack Query | `useQuery`, `useMutation` |
| Client state (UI, auth) | Zustand | `authStore`, `uiStore` |
| Form state | React Hook Form | All forms |
| URL state (filters, pagination) | React Router | Search params |

### 3. API Layer Pattern
```typescript
// features/[name]/hooks/use[Name].ts
export function useMedicines(filters: MedicineFilters) {
  return useQuery({
    queryKey: ['medicines', filters],
    queryFn: () => medicinesApi.getAll(filters),
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicinesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}
```

### 4. Component Hierarchy
```
pages/[Name]Page.tsx (thin, just composition)
└── features/[name]/[Name].tsx (main component)
    ├── components/[Name]Header.tsx
    ├── components/[Name]Table.tsx
    ├── components/[Name]Filters.tsx
    └── components/[Name]Dialog.tsx (create/edit)
```

---

## Feature Implementation Plan

### 1. Authentication (`/auth`) ✅ Mostly Done
| Page | Route | Components Needed |
|------|-------|-------------------|
| Login | `/login` | `LoginPage`, `LoginForm` |
| Register | `/register` | `RegisterPage`, `RegisterForm` |
| Profile | `/profile` ❌ | `ProfilePage`, `ProfileForm` |

**API Integration:**
- `POST /auth/login` → store token + user in Zustand
- `GET /auth/me` → verify token on app load
- `POST /auth/logout` → clear store

**Files to Create:**
- `src/features/auth/pages/ProfilePage.tsx`
- `src/features/auth/components/ProfileForm.tsx`

---

### 2. Medicines (`/medicines`) ❌ CREATE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/medicines` | `GET /medicines`, `GET /medicines/deleted` |
| Create/Edit | `/medicines/new`, `/medicines/:id/edit` | `POST /medicines`, `PUT /medicines/:id` |
| Details | `/medicines/:id` | `GET /medicines/:id` |

**Components:**
- `MedicinesPage.tsx` (main page)
- `MedicinesHeader.tsx` (search, add button)
- `MedicinesTable.tsx` (paginated table)
- `MedicineDialog.tsx` (create/edit form)
- `MedicineFilters.tsx` (category, unit filters)
- `DeletedMedicinesDialog.tsx` (restore functionality)

**Hooks:**
- `useMedicines.ts` (list with filters)
- `useMedicine.ts` (single medicine)
- `useCreateMedicine.ts`
- `useUpdateMedicine.ts`
- `useDeleteMedicine.ts`
- `useRestoreMedicine.ts`

**Form Validation (Zod):**
```typescript
export const createMedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  arabicName: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.number().min(1, "Category is required"),
  unit: z.number().min(0).max(4), // MedicineUnit enum
});
```

---

### 3. Categories (`/categories`) ❌ CREATE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/categories` | `GET /categories`, `GET /categories/deleted` |
| Create/Edit | `/categories/new`, `/categories/:id/edit` | `POST /categories`, `PUT /categories/:id` |

**Components:**
- `CategoriesPage.tsx`
- `CategoriesTable.tsx`
- `CategoryDialog.tsx` (name, arabicName)

**Hooks:**
- `useCategories.ts`
- `useCreateCategory.ts`
- `useUpdateCategory.ts`
- `useDeleteCategory.ts`

---

### 4. Customers (`/customers`) ❌ REPLACE "Patients"
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/customers` | `GET /customers`, `GET /customers/deleted` |
| Details | `/customers/:id` | `GET /customers/:id`, `GET /customers/:id/sales` |
| Statement | `/customers/:id/statement` | `GET /customers/:id/statement` |
| Debt Pay | (modal) | `POST /customers/:id/pay` |

**Components:**
- `CustomersPage.tsx` (rename from Patients)
- `CustomersTable.tsx`
- `CustomerDialog.tsx` (name, phone, address, note)
- `CustomerDetails.tsx` (tabs: info, sales, statement)
- `PayDebtDialog.tsx` (amount, method, description)
- `CustomerStatement.tsx` (transaction history)

**Hooks:**
- `useCustomers.ts`
- `useCustomer.ts` (single + sales)
- `useCustomerDebt.ts`
- `usePayCustomerDebt.ts`
- `useCustomerStatement.ts`

**Action Required:**
1. Rename `src/features/patients/` → `src/features/customers/`
2. Update all imports
3. Update routes in `app.tsx`

---

### 5. Suppliers (`/suppliers`) ❌ CREATE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/suppliers` | `GET /suppliers` |
| Create/Edit | `/suppliers/new`, `/suppliers/:id/edit` | `POST /suppliers`, `PUT /suppliers/:id` |

**Components:**
- `SuppliersPage.tsx`
- `SuppliersTable.tsx`
- `SupplierDialog.tsx` (name, phone, address)

**Hooks:**
- `useSuppliers.ts`
- `useCreateSupplier.ts`
- `useUpdateSupplier.ts`
- `useDeleteSupplier.ts`

---

### 6. Inventory (`/inventory`) ✅ EXISTS - ENHANCE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| Stock List | `/inventory` | `GET /inventory/stock` |
| Stock Details | `/inventory/:medicineId` | `GET /inventory/stock/:medicineId` |
| Alerts | `/inventory/alerts` ❌ | `GET /inventory/low-stock`, `GET /inventory/expiring` |
| Adjustments | (modal) | `POST /inventory/adjust` |

**Add Components:**
- `InventoryAlerts.tsx` (tabs: low stock, expiring)
- `AdjustStockDialog.tsx` (medicine, batch, quantity, type, reason)
- `StockMovementHistory.tsx`

**Hooks to Add:**
- `useLowStock.ts`
- `useExpiring.ts`
- `useAdjustStock.ts`

---

### 7. Sales (`/sales`) ❌ CREATE (or enhance invoices)
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/sales` | `GET /sales` |
| Details | `/sales/:id` | `GET /sales/:id`, `GET /sales/:id/balance` |
| Create | (integrated with POS) | `POST /sales` |
| Complete | (action) | `POST /sales/:id/complete` |
| Cancel | (action) | `POST /sales/:id/cancel` |

**Components:**
- `SalesPage.tsx`
- `SalesTable.tsx` (with filters: customer, user, status, date range)
- `SaleDetails.tsx` (items, payments, balance)
- `CompleteSaleDialog.tsx` (payments list)
- `SaleItemsTable.tsx`
- `SalePaymentsTable.tsx`

**Hooks:**
- `useSales.ts` (with filters)
- `useSale.ts` (single + details)
- `useCompleteSale.ts`
- `useCancelSale.ts`
- `useSaleBalance.ts`

**Note:** Current "Invoices" page should be merged into this or removed.

---

### 8. POS (`/pos`) ✅ EXISTS - ENHANCE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| POS Terminal | `/pos` | `POST /sales`, `POST /sales/:id/items` |
| Barcode Scan | (integrated) | `GET /pos/scan/:barcode` |
| Quick Search | (integrated) | `GET /pos/search?q=` |
| Quick Stock | (integrated) | `GET /pos/quick-stock/:medicineId` |

**Enhancements:**
- Add barcode scanner input (keyboard wedge support)
- Show stock info when adding item
- Integrate payment methods
- Keyboard shortcuts (F1=search, F2=pay, etc.)

**Components to Add:**
- `BarcodeScanner.tsx` (hidden input, auto-focus)
- `QuickStockBadge.tsx` (shows stock info)
- `PaymentMethods.tsx` (cash, card, etc.)

---

### 9. Purchases (`/purchases`) ❌ CREATE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/purchases` | `GET /purchases` |
| Details | `/purchases/:id` | `GET /purchases/:id`, `GET /purchases/:id/items` |
| Create | `/purchases/new` | `POST /purchases`, `POST /purchases/:id/items` |
| Complete | (action) | `POST /purchases/:id/complete` |
| Cancel | (action) | `POST /purchases/:id/cancel` |
| Returns | `/purchases/:id/returns` | `GET /purchases/:id/returns`, `POST /purchases/:id/return` |

**Components:**
- `PurchasesPage.tsx`
- `PurchasesTable.tsx` (filters: supplier, status, date)
- `PurchaseDetails.tsx` (items, payments, balance)
- `CreatePurchaseDialog.tsx` (supplier, invoice number, note)
- `AddPurchaseItemDialog.tsx` (medicine, batch, qty, prices, expiry)
- `PurchaseReturnsTable.tsx`

**Hooks:**
- `usePurchases.ts`
- `usePurchase.ts`
- `useCompletePurchase.ts`
- `useCancelPurchase.ts`
- `usePurchaseReturns.ts`

---

### 10. Sales Returns (`/sales-returns`) ❌ CREATE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/sales-returns` | `GET /sales-returns` |
| Details | `/sales-returns/:id` | `GET /sales-returns/:id` |
| Create | `/sales-returns/new` | `POST /sales-returns`, `POST /sales-returns/:id/items` |

**Components:**
- `SalesReturnsPage.tsx`
- `SalesReturnsTable.tsx`
- `SalesReturnDetails.tsx`
- `CreateSalesReturnDialog.tsx`

**Hooks:**
- `useSalesReturns.ts`
- `useSalesReturn.ts`
- `useCreateSalesReturn.ts`

---

### 11. Expenses (`/expenses`) ❌ CREATE
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/expenses` | `GET /expenses` |
| Create | `/expenses/new` | `POST /expenses` (auto-creates payment OUT) |

**Components:**
- `ExpensesPage.tsx`
- `ExpensesTable.tsx` (filters: date range)
- `CreateExpenseDialog.tsx` (amount, description)

**Hooks:**
- `useExpenses.ts`
- `useCreateExpense.ts`

---

### 12. Payments (`/payments`) - INTEGRATED
Payments are shown within:
- Sale details (`GET /payments/sale/:id`)
- Purchase details (`GET /payments/purchase/:id`)
- Customer details (`GET /customers/:id` with sales + payments)

**No separate page needed** - use dialogs/sections within relevant features.

---

### 13. Reports (`/reports`) ✅ EXISTS - IMPLEMENT
| Report Type | Backend Endpoint | Component |
|-------------|------------------|------------|
| Daily Sales | `GET /reports/sales/daily` | `DailySalesReport.tsx` |
| Sales Range | `GET /reports/sales/range` | `SalesRangeReport.tsx` |
| Profit | `GET /reports/profit` | `ProfitReport.tsx` |
| Stock | `GET /reports/stock` | `StockReport.tsx` |
| Expired | `GET /reports/expired` | `ExpiredReport.tsx` |
| Payments | `GET /reports/payments` | `PaymentsReport.tsx` |

**Components:**
- `ReportsPage.tsx` (tabs for each report type)
- `ReportsHeader.tsx` (date range picker)
- Individual report components (use Recharts for visualizations)

**Hooks:**
- `useDailySalesReport.ts`
- `useSalesRangeReport.ts`
- `useProfitReport.ts`
- `useStockReport.ts`
- `useExpiredReport.ts`
- `usePaymentsReport.ts`

---

### 14. Users (`/users`) ❌ CREATE (Admin Only)
| Page | Route | Backend Endpoints |
|------|-------|-------------------|
| List | `/users` | `GET /users` |
| Create/Edit | `/users/new`, `/users/:id/edit` | `POST /users`, `PUT /users/:id` |

**Components:**
- `UsersPage.tsx`
- `UsersTable.tsx` (filters: role, search)
- `UserDialog.tsx` (username, password, phone, address, role)
- `RoleBadge.tsx` (display user role)

**Hooks:**
- `useUsers.ts`
- `useCreateUser.ts`
- `useUpdateUser.ts`
- `useDeleteUser.ts`

**Security:** Protect route with `authStore.hasRole('ADMIN')`

---

### 15. Settings (`/settings`) ✅ EXISTS - ENHANCE
| Section | Backend Endpoint |
|----------|-------------------|
| Profile | `GET /auth/me` |
| System Health | `GET /health` |
| Backup/Restore | `POST /backup`, `POST /restore` (admin) |

**Components to Add:**
- `SystemSettings.tsx` (health check, backup button, restore upload)
- `ProfileSettings.tsx` (update user info)

---

## Phase-by-Phase Execution

### Phase 1: Cleanup & Standards ✅ COMPLETED
- [x] Unify import paths (`@/`, `@features/`)
- [x] Update Vite/TS config with proper aliases
- [x] Remove unused dependencies (wouter)
- [x] Add TypeScript strict enhancements
- [x] Create missing system types
- [x] Verify build passes

### Phase 2: Fix Naming & Structure 🔄 IN PROGRESS
- [ ] Rename `patients` → `customers`
- [ ] Update all imports and routes
- [ ] Merge/better organize invoices with sales
- [ ] Create feature folders for all missing features

**Commands:**
```bash
# Rename patients to customers
mv src/features/patients src/features/customers
# Update imports with sed or manually
```

### Phase 3: Create Missing Features (Priority Order)
1. **Medicines** (core to pharmacy)
2. **Categories** (medicines depend on it)
3. **Suppliers** (purchases depend on it)
4. **Sales** (replace invoices)
5. **Purchases**
6. **Customers** (already exists as patients, just rename)
7. **Sales Returns**
8. **Expenses**
9. **Users** (admin)
10. **Inventory Enhancements** (alerts, adjustments)
11. **POS Enhancements** (barcode, keyboard)
12. **Reports** (implement all types)
13. **Settings** (system features)

### Phase 4: Form Validation & UX
- [ ] Add React Hook Form + Zod to all forms
- [ ] Add loading skeletons
- [ ] Add optimistic updates
- [ ] Add error boundaries
- [ ] Add toast notifications for all actions

### Phase 5: Advanced Features
- [ ] Lazy loading for routes
- [ ] Keyboard shortcuts for POS
- [ ] Barcode scanner integration
- [ ] Receipt printing
- [ ] Dark mode toggle (if not exists)
- [ ] Responsive design audit

### Phase 6: Quality & Testing
- [ ] Add ESLint + Prettier
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Performance optimization
- [ ] Accessibility audit

---

## File Structure

### Final Expected Structure
```
src/
├── app/                          # App-level configuration
│   ├── App.tsx                   # Main app with providers
│   ├── providers.tsx             # All providers (Query, Router, Theme)
│   ├── routes.tsx                # Route definitions
│   └── ProtectedRoute.tsx
├── core/                         # Shared core functionality
│   ├── api/                      # API client & endpoints
│   │   ├── client.ts             # Axios instance
│   │   ├── medicines.ts          # ✅ Created
│   │   ├── inventory.ts          # ✅ Updated
│   │   ├── categories.ts         # (exists, verify)
│   │   ├── customers.ts          # (exists, verify)
│   │   ├── suppliers.ts          # (exists, verify)
│   │   ├── sales.ts              # ✅ Exists
│   │   ├── purchases.ts          # (exists, verify)
│   │   ├── salesReturns.ts       # (exists, verify)
│   │   ├── payments.ts           # (exists, verify)
│   │   ├── expenses.ts           # (exists, verify)
│   │   ├── pos.ts                # (exists, verify)
│   │   ├── reports.ts            # (exists, verify)
│   │   ├── users.ts              # (exists, verify)
│   │   ├── system.ts             # ✅ Created
│   │   └── index.ts              # ✅ Updated
│   ├── hooks/                    # Global hooks
│   │   ├── useAuth.ts
│   │   └── use-toast.ts
│   ├── store/                    # Zustand stores
│   │   ├── authStore.ts          # ✅ Exists
│   │   └── uiStore.ts            # (theme, sidebar)
│   ├── types/                    # Global types
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── medicine.ts
│   │   ├── category.ts
│   │   ├── customer.ts
│   │   ├── supplier.ts
│   │   ├── sale.ts
│   │   ├── purchase.ts
│   │   ├── inventory.ts
│   │   ├── system.ts             # ✅ Created
│   │   └── index.ts              # ✅ Updated
│   ├── ui/                       # shadcn/ui components
│   ├── utils/                    # Utility functions
│   └── lib/                      # Library configs
│       ├── queryClient.ts
│       └── validators.ts          # Zod schemas
├── features/                      # Feature modules
│   ├── auth/                      # ✅ Exists
│   │   ├── components/
│   │   ├── pages/
│   │   └── Login.tsx
│   ├── medicines/                 # ❌ CREATE
│   │   ├── components/
│   │   │   ├── MedicinesHeader.tsx
│   │   │   ├── MedicinesTable.tsx
│   │   │   ├── MedicineDialog.tsx
│   │   │   └── MedicineFilters.tsx
│   │   ├── hooks/
│   │   │   ├── useMedicines.ts
│   │   │   ├── useMedicine.ts
│   │   │   └── ...
│   │   ├── types.ts
│   │   ├── Medicines.tsx
│   │   └── index.ts
│   ├── categories/                # ❌ CREATE
│   ├── customers/                 # ❌ REPLACE (from patients)
│   ├── suppliers/                 # ❌ CREATE
│   ├── inventory/                 # ✅ EXISTS - enhance
│   │   ├── components/
│   │   ├── hooks/                # Add alerts, adjustments
│   │   └── Inventory.tsx
│   ├── sales/                     # ❌ CREATE (or enhance invoices)
│   ├── pos/                       # ✅ EXISTS - enhance
│   │   ├── components/            # Add barcode, keyboard shortcuts
│   │   └── Pos.tsx
│   ├── purchases/                # ❌ CREATE
│   ├── sales-returns/            # ❌ CREATE
│   ├── expenses/                 # ❌ CREATE
│   ├── reports/                   # ✅ EXISTS - implement
│   │   ├── components/            # Add all report types
│   │   └── Reports.tsx
│   ├── users/                     # ❌ CREATE
│   └── settings/                  # ✅ EXISTS - enhance
│       └── Settings.tsx
├── pages/                         # Standalone pages
│   ├── DashboardPage.tsx          # ✅ Exists
│   ├── LoginPage.tsx              # ✅ Exists
│   ├── RegisterPage.tsx           # ✅ Exists
│   ├── NotFoundPage.tsx           # ✅ Exists
│   ├── InventoryPage.tsx          # ✅ Exists
│   ├── PosPage.tsx                # ✅ Exists
│   ├── PatientsPage.tsx           # ❌ Rename to CustomersPage
│   ├── InvoicesPage.tsx           # ❌ Merge with Sales
│   ├── ReportsPage.tsx            # ✅ Exists
│   └── SettingsPage.tsx           # ✅ Exists
├── layout/                        # ✅ Exists
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── layout.tsx
├── styles/
│   └── index.css
└── main.tsx
```

---

## Technical Specifications

### API Integration Pattern
```typescript
// core/api/medicines.ts
import api from "./client";
import type { MedicineDto, MedicineListResponse, CreateMedicineRequest } from "@/types";

export const medicinesApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; unit?: number; categoryId?: number }) =>
    api.get<MedicineListResponse>("/medicines", { params }),
  
  getDeleted: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<MedicineListResponse>("/medicines/deleted", { params }),
  
  getById: (id: number) =>
    api.get<MedicineDto>(`/medicines/${id}`),
  
  create: (data: CreateMedicineRequest) =>
    api.post<MedicineDto>("/medicines", data),
  
  update: (id: number, data: Partial<CreateMedicineRequest>) =>
    api.put<MedicineDto>(`/medicines/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/medicines/${id}`),
  
  restore: (id: number) =>
    api.post(`/medicines/${id}/restore`),
  
  hardDelete: (id: number) =>
    api.delete(`/medicines/${id}/hard`),
};
```

### TanStack Query Hooks Pattern
```typescript
// features/medicines/hooks/useMedicines.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicinesApi } from "@/api/medicines";
import type { MedicineFilters, CreateMedicineRequest } from "@/types";

export function useMedicines(filters?: MedicineFilters) {
  return useQuery({
    queryKey: ["medicines", filters],
    queryFn: () => medicinesApi.getAll(filters),
    select: (data) => data.data, // Extract from axios response
  });
}

export function useDeletedMedicines(filters?: MedicineFilters) {
  return useQuery({
    queryKey: ["medicines", "deleted", filters],
    queryFn: () => medicinesApi.getDeleted(filters),
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMedicineRequest) => medicinesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create medicine");
    },
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medicinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted");
    },
  });
}
```

### Form Validation Pattern (Zod)
```typescript
// core/lib/validators.ts
import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  arabicName: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.number().min(1, "Category is required"),
  unit: z.nativeEnum(MedicineUnit),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;

// In component:
const form = useForm<CreateMedicineInput>({
  resolver: zodResolver(createMedicineSchema),
  defaultValues: {
    name: "",
    arabicName: "",
    barcode: "",
    categoryId: 0,
    unit: MedicineUnit.Pill,
  },
});
```

### Component Pattern
```typescript
// features/medicines/Medicines.tsx
import { useMedicines } from "./hooks/useMedicines";
import { MedicinesHeader } from "./components/MedicinesHeader";
import { MedicinesTable } from "./components/MedicinesTable";
import { MedicineDialog } from "./components/MedicineDialog";
import { useCreateMedicine } from "./hooks/useCreateMedicine";

export function Medicines() {
  const [openDialog, setOpenDialog] = useState(false);
  const { data, isLoading } = useMedicines();
  const createMutation = useCreateMedicine();
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div>
      <MedicinesHeader onAdd={() => setOpenDialog(true)} />
      <MedicinesTable data={data?.medicines} />
      <MedicineDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        onSubmit={createMutation.mutate}
      />
    </div>
  );
}
```

### Route Protection Pattern
```typescript
// core/app/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children, requiredRole?: UserRole }) {
  const { isAuthenticated, hasRole } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}

// Usage in App.tsx:
<Route element={<ProtectedRoute requiredRole="ADMIN" />}>
  <Route path="users" element={<UsersPage />} />
</Route>
```

---

## Implementation Checklist

### Phase 2: Fix & Structure
- [ ] Rename `patients` → `customers`
- [ ] Update `app.tsx` routes
- [ ] Create all missing feature folders
- [ ] Verify API layer matches backend

### Phase 3: Create Features (In Order)
For each feature, follow this checklist:

**Feature Name: ___________**
- [ ] Create folder structure (`features/[name]/`)
- [ ] Create types file (`types.ts`)
- [ ] Create API functions (or verify existing in `core/api/`)
- [ ] Create query hooks (`hooks/use[Name].ts`)
- [ ] Create components:
  - [ ] `[Name]Page.tsx` (or use existing page in `pages/`)
  - [ ] `[Name].tsx` (main component)
  - [ ] `[Name]Header.tsx`
  - [ ] `[Name]Table.tsx`
  - [ ] `[Name]Dialog.tsx` (create/edit form)
- [ ] Add Zod validation schema
- [ ] Add route to `app.tsx`
- [ ] Test CRUD operations
- [ ] Add loading states
- [ ] Add error handling
- [ ] Verify TypeScript passes (`npm run check`)

### Phase 4: Quality
- [ ] Install ESLint + Prettier
- [ ] Add `.eslintrc.cjs` and `.prettierrc`
- [ ] Run linter and fix errors
- [ ] Add error boundary
- [ ] Add loading skeletons to all pages
- [ ] Add toast notifications to all mutations

### Phase 5: Advanced
- [ ] Add lazy loading to routes
- [ ] Add keyboard shortcuts to POS
- [ ] Integrate barcode scanner
- [ ] Add receipt printing (CSS @media print)
- [ ] Test responsive design

---

## Commands Reference

### Create Feature Scaffold
```bash
# Replace [name] with feature name (medicines, categories, etc.)
mkdir -p src/features/[name]/{components,hooks}
touch src/features/[name]/{types.ts,[name].tsx,index.ts}
touch src/features/[name]/hooks/use[Name].ts
```

### Verify Build
```bash
cd /home/mohammed/Documents/pharma-core/Pharma-core-client
npm run check    # TypeScript check
npm run build    # Production build
npm run dev      # Dev server
```

### Install Missing Dependencies
```bash
# Form validation
npm install react-hook-form zod @hookform/resolvers

# Code quality
npm install --save-dev eslint@^9 prettier@^3 eslint-plugin-react typescript-eslint @eslint/js eslint-config-prettier --legacy-peer-deps
```

---

## Summary

This plan provides a complete roadmap to transform the current frontend into a production-ready pharmacy management system that fully integrates with the .NET backend.

**Immediate Next Steps:**
1. ✅ Phase 1 completed (cleanup done)
2. 🔄 Start Phase 2: Rename patients → customers
3. 📋 Begin Phase 3: Create medicines feature (most critical)
4. ⬇️ Continue with remaining features in priority order

**Estimated Time:**
- Phase 2: 1 hour
- Phase 3 (all features): 2-3 days
- Phase 4 (quality): 4-6 hours
- Phase 5 (advanced): 1-2 days

Total: ~4-5 days to complete production-ready frontend
