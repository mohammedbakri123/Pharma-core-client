import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import type { AddPurchaseItemRequest, MedicineDto } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { useMedicineList } from "@features/inventory/hooks/useMedicine";
import SelectedPurchaseMedicineCard from "../SelectedPurchaseMedicineCard";

interface AddPurchaseItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    data: AddPurchaseItemRequest,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function AddPurchaseItemDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddPurchaseItemDialogProps) {
  const { toast } = useToast();
  const [medicineSearch, setMedicineSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDto | null>(
    null,
  );
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(medicineSearch, 300);
  const { data: medicinesData, isLoading: isSearchingMedicines } =
    useMedicineList({
      page: 1,
      limit: 10,
      categoryId: null,
      search: debouncedSearch.length >= 1 ? debouncedSearch : undefined,
    });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowMedicineDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const medicines = medicinesData?.medicines ?? [];

  const handleMedicineSelect = (medicine: MedicineDto) => {
    setSelectedMedicine(medicine);
    setMedicineSearch(medicine.name);
    setShowMedicineDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    onAdd(
      {
        medicineId: selectedMedicine.medicineId,
        batchNumber,
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        sellPrice: Number(sellPrice),
        expireDate: expireDate || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast({
            title: "تمت إضافة الصنف بنجاح",
            description: "تمت إضافة الصنف إلى الفاتورة بنجاح.",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            title: "فشل إضافة الصنف",
            description: "حدث خطأ أثناء إضافة الصنف إلى الفاتورة.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة صنف للفاتورة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative space-y-2 sm:col-span-2">
              <Label htmlFor="medicineSearch">الصنف</Label>
              <Input
                ref={inputRef}
                id="medicineSearch"
                value={medicineSearch}
                onChange={(e) => {
                  setMedicineSearch(e.target.value);
                  setSelectedMedicine(null);
                  setShowMedicineDropdown(true);
                }}
                onFocus={() => setShowMedicineDropdown(true)}
                placeholder="ابحث باسم الصنف أو الباركود..."
                autoComplete="off"
                required
              />

              {showMedicineDropdown && debouncedSearch.length >= 1 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 w-full rounded-md border bg-popover shadow-md"
                >
                  {isSearchingMedicines ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      جاري البحث...
                    </div>
                  ) : medicines.length ? (
                    <div className="max-h-48 overflow-y-auto">
                      {medicines.map((medicine) => (
                        <button
                          key={medicine.medicineId}
                          type="button"
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-right hover:bg-accent"
                          onClick={() => handleMedicineSelect(medicine)}
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
                          <span className="shrink-0 text-xs text-muted-foreground">
                            #{medicine.medicineId}
                          </span>
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

            {selectedMedicine && (
              <SelectedPurchaseMedicineCard medicine={selectedMedicine} />
            )}

            <div className="space-y-2">
              <Label htmlFor="batchNumber">رقم الباتش</Label>
              <Input
                id="batchNumber"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                required
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">سعر الشراء</Label>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellPrice">سعر البيع</Label>
              <Input
                id="sellPrice"
                type="number"
                min="0"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expireDate">تاريخ الانتهاء</Label>
              <Input
                id="expireDate"
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending || !selectedMedicine}>
              {isPending ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
