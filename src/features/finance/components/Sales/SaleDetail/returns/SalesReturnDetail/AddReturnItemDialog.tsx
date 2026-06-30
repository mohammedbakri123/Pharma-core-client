import { useState, useEffect } from "react";
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
import { formatCurrency } from "@/utils/formatters";
import type { SaleDetailsDto, AddSalesReturnItemRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";
import { Plus, Minus, Check, ShoppingCart, Ban } from "lucide-react";

interface AddReturnItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: SaleDetailsDto;
  existingSaleItemIds?: number[];
  onAdd: (
    data: AddSalesReturnItemRequest,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function AddReturnItemDialog({
  open,
  onOpenChange,
  sale,
  existingSaleItemIds = [],
  onAdd,
  isPending,
}: AddReturnItemDialogProps) {
  const { toast } = useToast();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  // Filter out items already added to the return
  const returnableItems = sale.items.filter(
    (item) => !existingSaleItemIds.includes(item.saleItemId),
  );

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setSelectedItemId("");
      setQuantity("1");
    }
  }, [open]);

  // Find the selected sale item
  const selectedSaleItem = sale.items.find(
    (item) => item.saleItemId.toString() === selectedItemId,
  );

  // Reset quantity when selected item changes
  useEffect(() => {
    if (selectedSaleItem) {
      setQuantity("1");
    }
  }, [selectedItemId, selectedSaleItem]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleItem) return;

    const qtyNumber = Number(quantity);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      toast({
        title: "الكمية غير صالحة",
        description: "يرجى إدخال كمية صحيحة أكبر من الصفر.",
        variant: "destructive",
      });
      return;
    }

    if (qtyNumber > selectedSaleItem.quantity) {
      toast({
        title: "تجاوز الكمية المباعة",
        description: `لا يمكن إرجاع كمية أكبر من الكمية المباعة (${selectedSaleItem.quantity}).`,
        variant: "destructive",
      });
      return;
    }

    onAdd(
      {
        saleItemId: selectedSaleItem.saleItemId,
        batchId: selectedSaleItem.batchId,
        quantity: qtyNumber,
        unitPrice: selectedSaleItem.unitPrice,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast({
            title: "تمت إضافة الصنف المرتجع",
            description: "تمت إضافة الصنف بنجاح إلى المرتجع.",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            title: "فشل إضافة الصنف",
            description: "حدث خطأ أثناء إضافة الصنف إلى المرتجع.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleIncrement = () => {
    if (!selectedSaleItem) return;
    const current = Number(quantity);
    if (current < selectedSaleItem.quantity) {
      setQuantity((current + 1).toString());
    }
  };

  const handleDecrement = () => {
    const current = Number(quantity);
    if (current > 1) {
      setQuantity((current - 1).toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg dir-rtl p-6">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2 justify-start flex-row-reverse">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span>إضافة صنف مرتجع</span>
          </DialogTitle>
        </DialogHeader>

        {returnableItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Ban className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              تمت إضافة جميع أصناف الفاتورة للمرتجع بالفعل.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="mt-2"
            >
              إغلاق
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-5 text-right mt-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                اختر صنفاً من قائمة المبيعات
              </Label>

              {/* Visual items list selector */}
              <div className="space-y-2 max-h-55 overflow-y-auto pr-1 border rounded-lg p-2 bg-muted/10 border-border/40">
                {returnableItems.map((item) => {
                  const isSelected =
                    selectedItemId === item.saleItemId.toString();
                  return (
                    <div
                      key={item.saleItemId}
                      onClick={() =>
                        setSelectedItemId(item.saleItemId.toString())
                      }
                      className={cn(
                        "p-3 rounded-lg border text-right cursor-pointer transition-all flex flex-row-reverse justify-between items-center select-none",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs scale-[0.99]"
                          : "border-border/50 bg-background hover:bg-muted/40 hover:border-border",
                      )}
                    >
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full border flex items-center justify-center shrink-0",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30 bg-background",
                          )}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 stroke-3" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {item.medicineName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            رقم الباتش: {item.batchNumber || "غير محدد"}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-muted-foreground block">
                          الكمية المباعة: {item.quantity} | السعر:
                        </span>
                        <span className="font-semibold font-mono text-xs text-foreground">
                          {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedSaleItem && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Quantity Adjuster with Plus/Minus buttons */}
                <div className="space-y-2">
                  <Label
                    htmlFor="returnedQuantity"
                    className="text-sm font-medium"
                  >
                    الكمية المرتجعة
                  </Label>
                  <div className="flex items-center justify-center gap-3 dir-ltr bg-muted/20 border border-border/40 p-4 rounded-xl">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 cursor-pointer hover:bg-muted"
                      onClick={handleIncrement}
                      disabled={Number(quantity) >= selectedSaleItem.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="returnedQuantity"
                      type="number"
                      min="1"
                      max={selectedSaleItem.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-10 text-center font-bold text-base w-24 bg-background"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 cursor-pointer hover:bg-muted"
                      onClick={handleDecrement}
                      disabled={Number(quantity) <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Refund value indicator card */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex justify-between items-center flex-row-reverse text-right">
                  <div>
                    <span className="text-[11px] text-emerald-700/80 block font-medium">
                      إجمالي القيمة المستردة
                    </span>
                    <span className="text-lg font-mono font-extrabold text-emerald-600">
                      {formatCurrency(
                        selectedSaleItem.unitPrice * Number(quantity || 0),
                      )}
                    </span>
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setQuantity(selectedSaleItem.quantity.toString())
                      }
                      className="text-xs h-8 border-emerald-500/20 text-emerald-700 hover:bg-emerald-500/10 cursor-pointer"
                    >
                      إرجاع الكل ({selectedSaleItem.quantity})
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 mt-6 pt-2 border-t border-border/20">
              <Button
                type="submit"
                disabled={isPending || !selectedItemId}
                className="w-full sm:w-auto cursor-pointer"
              >
                {isPending ? "جاري الإضافة..." : "إضافة إلى المرتجع"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
