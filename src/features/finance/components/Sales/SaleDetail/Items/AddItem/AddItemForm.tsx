import { useState, useRef, useEffect } from "react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  useStockAlerts,
  useGetStockByMedicine,
} from "@features/inventory/hooks/useInventory";
import type { StockAlertDto } from "@features/inventory/types/inventory";
import type { AddSaleItemRequest } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/ui/button";
import { DialogFooter } from "@/ui/dialog";
import MedicineSearchDropdown from "./MedicineSearchDropdown";
import SelectedMedicineCard from "./SelectedMedicineCard";

interface AddItemFormProps {
  onAdd: (data: AddSaleItemRequest) => void;
  isPending: boolean;
  open: boolean;
}

export default function AddItemForm({
  onAdd,
  isPending,
  open,
}: AddItemFormProps) {
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data: alertData, isLoading: searchLoading } = useStockAlerts({
    search: debouncedSearch.length >= 1 ? debouncedSearch : null,
    LowStockThreshold: null,
    ExpiringDays: null,
  });
  const { data: stockDetail } = useGetStockByMedicine(selectedId ?? 0);

  useEffect(() => {
    if (open) {
      setSearch("");
      setQuantity("1");
      setSelectedId(null);
      setShowDropdown(false);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = alertData?.items ?? [];
  const selectedMedicine = searchResults.find(
    (m) => m.medicineId === selectedId,
  );

  const handleSelect = (medicine: StockAlertDto) => {
    setSelectedId(medicine.medicineId);
    setSearch(medicine.name);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    onAdd({
      medicineId: selectedId,
      quantity: Number(quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative space-y-2">
        <Label htmlFor="search">بحث باسم الصنف أو الباركود</Label>
        <Input
          ref={inputRef}
          id="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
            setSelectedId(null);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="اسم الصنف أو الباركود..."
          autoComplete="off"
        />

        {showDropdown && debouncedSearch.length >= 1 && (
          <MedicineSearchDropdown
            loading={searchLoading}
            results={searchResults}
            onSelect={handleSelect}
            containerRef={dropdownRef}
          />
        )}
      </div>

      {selectedMedicine && stockDetail && (
        <SelectedMedicineCard
          medicine={selectedMedicine}
          stockDetail={stockDetail}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">الكمية</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending || !selectedId}>
          {isPending ? "جاري الإضافة..." : "إضافة"}
        </Button>
      </DialogFooter>
    </form>
  );
}
