import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetSale } from "@features/finance/hooks/useSales";
import type { AddSalesReturnItemRequest } from "@/types";
import type { SaleItemDto } from "@/types";
import EmptyReturnState from "./EmptyReturnState";
import AddReturnItemForm from "./AddReturnItemForm";

interface AddReturnItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSaleItemIds?: number[];
  saleId: number;
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
  saleId,
  existingSaleItemIds = [],
  onAdd,
  isPending,
}: AddReturnItemDialogProps) {
  const { toast } = useToast();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const { data: sale } = useGetSale(saleId);

  const returnableItems = sale?.items.filter(
    (item) => !existingSaleItemIds.includes(item.saleItemId),
  );

  useEffect(() => {
    if (open) {
      setSelectedItemId("");
      setQuantity("1");
    }
  }, [open]);

  const selectedSaleItem = sale?.items.find(
    (item) => item.saleItemId.toString() === selectedItemId,
  );

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

  const handleReturnAll = () => {
    if (selectedSaleItem) {
      setQuantity(selectedSaleItem.quantity.toString());
    }
  };

  const handleSelectItem = (saleItemId: number) => {
    setSelectedItemId(saleItemId.toString());
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

        {returnableItems?.length === 0 ? (
          <EmptyReturnState onClose={() => onOpenChange(false)} />
        ) : (
          <AddReturnItemForm
            returnableItems={returnableItems ?? []}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            selectedSaleItem={selectedSaleItem}
            quantity={quantity}
            onQuantityChange={setQuantity}
            isPending={isPending}
            onSubmit={handleAdd}
            onReturnAll={handleReturnAll}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
