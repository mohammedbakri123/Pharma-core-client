import { useDebounce } from "@/hooks/use-debounce";
import type {
  CustomerDto,
  HeaderSearchResult,
  MedicineDto,
  SupplierDto,
} from "@/types";
import { MedicineApi } from "@features/inventory/api/medicines";
import { getCustomers } from "@features/people/api/customers";
import { supplierApi } from "@features/people/api/suppliers";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function useHeaderSearch() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(searchInput.trim(), 250);

  const canSearch = debouncedSearch.length >= 2;
  const trimmedSearch = searchInput.trim();
  const encodedSearch = encodeURIComponent(trimmedSearch);
  const numericSearch = trimmedSearch.match(/^#?\d+$/)?.[0].replace("#", "");

  const medicinesQuery = useQuery({
    queryKey: ["global-search", "medicines", debouncedSearch],
    queryFn: async () => {
      const response = await MedicineApi.getMedicines({
        page: 1,
        limit: 4,
        categoryId: null,
        search: debouncedSearch,
      });
      return response.data.medicines;
    },
    enabled: canSearch,
  });

  const customersQuery = useQuery({
    queryKey: ["global-search", "customers", debouncedSearch],
    queryFn: async () => {
      const response = await getCustomers({
        page: 1,
        limit: 4,
        search: debouncedSearch,
      });
      return response.data.customers;
    },
    enabled: canSearch,
  });

  const suppliersQuery = useQuery({
    queryKey: ["global-search", "suppliers", debouncedSearch],
    queryFn: async () => {
      const response = await supplierApi.getSuppliers({
        page: 1,
        limit: 3,
        search: debouncedSearch,
      });
      return response.data.suppliers;
    },
    enabled: canSearch,
  });

  const results = useMemo<HeaderSearchResult[]>(() => {
    if (!canSearch) {
      return [];
    }

    const medicineResults = (medicinesQuery.data ?? []).map(
      (medicine: MedicineDto): HeaderSearchResult => ({
        type: "medicine",
        id: medicine.medicineId,
        title: medicine.arabicName || medicine.name,
        description: [medicine.name, medicine.barcode, medicine.categoryName]
          .filter(Boolean)
          .join(" · "),
        path: `/inventory/medicines/${medicine.medicineId}`,
      }),
    );

    const customerResults = (customersQuery.data ?? []).map(
      (customer: CustomerDto): HeaderSearchResult => ({
        type: "customer",
        id: customer.customerId,
        title: customer.name,
        description: customer.phoneNumber || customer.address || "ملف العميل",
        path: `/people/customer/${customer.customerId}`,
      }),
    );

    const supplierResults = (suppliersQuery.data ?? []).map(
      (supplier: SupplierDto): HeaderSearchResult => ({
        type: "supplier",
        id: supplier.supplierId,
        title: supplier.name,
        description: supplier.phoneNumber || supplier.address || "قائمة الموردين",
        path: `/people/suppliers?search=${encodedSearch}`,
      }),
    );

    const shortcuts: HeaderSearchResult[] = [
      {
        type: "shortcut",
        id: "medicines",
        title: "البحث في قائمة الأدوية",
        description: trimmedSearch,
        path: `/inventory/medicines?search=${encodedSearch}`,
      },
      {
        type: "shortcut",
        id: "customers",
        title: "البحث في قائمة العملاء",
        description: trimmedSearch,
        path: `/people/customers?search=${encodedSearch}`,
      },
    ];

    if (numericSearch) {
      shortcuts.unshift({
        type: "shortcut",
        id: "sale",
        title: `فتح فاتورة مبيعات #${numericSearch}`,
        description: "انتقال مباشر إلى تفاصيل الفاتورة",
        path: `/finance/sales/${numericSearch}`,
      });
    }

    return [
      ...medicineResults,
      ...customerResults,
      ...supplierResults,
      ...shortcuts,
    ].slice(0, 10);
  }, [
    canSearch,
    customersQuery.data,
    encodedSearch,
    medicinesQuery.data,
    numericSearch,
    suppliersQuery.data,
    trimmedSearch,
  ]);

  const isSearching =
    canSearch &&
    (medicinesQuery.isFetching ||
      customersQuery.isFetching ||
      suppliersQuery.isFetching);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const goToResult = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchInput("");
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedSearch) {
      return;
    }

    if (numericSearch) {
      goToResult(`/finance/sales/${numericSearch}`);
      return;
    }

    goToResult(`/inventory/medicines?search=${encodedSearch}`);
  };

  return {
    goToResult,
    handleSearchSubmit,
    isSearchOpen,
    isSearching,
    results,
    searchInput,
    searchRef,
    setIsSearchOpen,
    setSearchInput,
    trimmedSearch,
  };
}
