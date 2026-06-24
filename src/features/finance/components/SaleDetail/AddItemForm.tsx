import { useState, useRef, useEffect } from "react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Badge } from "@/ui/badge";
import {
  useStockAlerts,
  useGetStockByMedicine,
} from "@features/inventory/hooks/useInventory";
import { type StockAlertDto } from "@features/inventory/types/inventory";
import { stockStatusVariant } from "@features/inventory/components/Inventory/stockStatusConfig";
import type { AddSaleItemRequest } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/ui/button";
import { DialogFooter } from "@/ui/dialog";

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
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full rounded-md border bg-popover shadow-md"
          >
            {searchLoading ? (
              <div className="p-2 text-sm text-muted-foreground">
                جاري البحث...
              </div>
            ) : searchResults.length ? (
              <div className="max-h-48 overflow-y-auto">
                {searchResults.map((medicine) => (
                  <button
                    key={medicine.medicineId}
                    type="button"
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-right hover:bg-accent"
                    onClick={() => handleSelect(medicine)}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {medicine.name}
                      </div>
                      {medicine.arabicName && (
                        <div className="truncate text-xs text-muted-foreground">
                          {medicine.arabicName}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={stockStatusVariant[medicine.status]}>
                        {medicine.totalQuantity}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                لا توجد نتائج
              </div>
            )}
          </div>
        )}
      </div>

      {selectedMedicine && stockDetail && (
        <div className="rounded-md border p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-medium">{stockDetail.medicineName}</span>
            <Badge>{stockDetail.batches[0]?.sellPrice ?? "---"} ج.م</Badge>
          </div>
          {selectedMedicine.arabicName && (
            <div className="mb-1 text-sm text-muted-foreground">
              {selectedMedicine.arabicName}
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            المخزون: {stockDetail.totalStock} | الوحدة:{" "}
            {selectedMedicine.unit ?? "---"}
            {stockDetail.totalStock === 0 && (
              <Badge variant="destructive" className="mr-2">
                نفذ
              </Badge>
            )}
          </div>
          {stockDetail.batches.length > 1 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {stockDetail.batches.length} batches available
            </div>
          )}
        </div>
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
