import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Badge } from "@/ui/badge";
import { ScrollArea } from "@/ui/scroll-area";
import {
  useSearchMedicines,
  useScanBarcode,
  useQuickStock,
} from "@features/pos/hooks/usePos";
import type { PosMedicine } from "@features/pos/types/pos";
import type { AddSaleItemRequest } from "@/types";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: AddSaleItemRequest) => void;
  isPending: boolean;
}

export default function AddItemDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddItemDialogProps) {
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data: searchResults, isLoading: searchLoading } =
    useSearchMedicines(debouncedSearch);
  const { data: scannedMedicine } = useScanBarcode(barcode);
  const { data: quickStock } = useQuickStock(selectedId ?? undefined);

  const resetForm = useCallback(() => {
    setSearch("");
    setBarcode("");
    setQuantity("1");
    setSelectedId(null);
    setShowDropdown(false);
  }, []);

  useEffect(() => {
    if (open) resetForm();
  }, [open, resetForm]);

  useEffect(() => {
    if (scannedMedicine) {
      setSelectedId(scannedMedicine.medicineId);
      setSearch(scannedMedicine.name);
      setBarcode("");
    }
  }, [scannedMedicine]);

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

  const selectedMedicine = searchResults?.find(
    (m) => m.medicineId === selectedId
  );

  const handleSelect = (medicine: PosMedicine) => {
    setSelectedId(medicine.medicineId);
    setSearch(medicine.name);
    setShowDropdown(false);
  };

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value) {
        setBarcode(value);
      }
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة صنف للفاتورة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative space-y-2">
            <Label htmlFor="search">بحث عن صنف</Label>
            <Input
              ref={inputRef}
              id="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
                if (e.target.value !== (selectedMedicine?.name ?? "")) {
                  setSelectedId(null);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="ابحث باسم الصنف..."
              autoComplete="off"
            />

            {showDropdown && debouncedSearch.length >= 2 && (
              <div
                ref={dropdownRef}
                className="absolute z-50 w-full rounded-md border bg-popover shadow-md"
              >
                {searchLoading ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    جاري البحث...
                  </div>
                ) : searchResults?.length ? (
                  <ScrollArea className="max-h-48">
                    {searchResults.map((medicine) => (
                      <button
                        key={medicine.medicineId}
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 text-right hover:bg-accent"
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
                          <Badge variant="outline">
                            {medicine.sellPrice} ج.م
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {medicine.currentStock}
                          </span>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    لا توجد نتائج
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">باركود</Label>
            <Input
              id="barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              placeholder="امسح الباركود أو أدخله واضغط Enter"
            />
          </div>

          {selectedMedicine && (
            <div className="rounded-md border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">{selectedMedicine.name}</span>
                <Badge>{selectedMedicine.sellPrice} ج.م</Badge>
              </div>
              {selectedMedicine.arabicName && (
                <div className="mb-1 text-sm text-muted-foreground">
                  {selectedMedicine.arabicName}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  المخزون: {quickStock?.totalStock ?? selectedMedicine.currentStock}
                </span>
                <span>|</span>
                <span>الوحدة: {selectedMedicine.unit ?? "---"}</span>
                {quickStock?.totalStock === 0 && (
                  <Badge variant="destructive">نفذ</Badge>
                )}
              </div>
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
      </DialogContent>
    </Dialog>
  );
}
