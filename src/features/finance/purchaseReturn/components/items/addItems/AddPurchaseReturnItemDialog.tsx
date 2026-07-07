import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetPurchase } from "@features/finance/common/hooks/usePurchases";
import type { AddPurchaseReturnItemRequest } from "@/types";
import type { PurchaseItemDetailsDto } from "@/types";
import EmptyPurchaseReturnState from "./EmptyPurchaseReturnState";
import AddPurchaseReturnItemForm from "./AddPurchaseReturnItemForm";

interface AddPurchaseReturnItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingPurchaseItemIds?: number[];
  purchaseId: number;
  onAdd: (
    data: AddPurchaseReturnItemRequest,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function AddPurchaseReturnItemDialog({
  open,
  onOpenChange,
  purchaseId,
  existingPurchaseItemIds = [],
  onAdd,
  isPending,
}: AddPurchaseReturnItemDialogProps) {
  const { toast } = useToast();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const { data: purchase } = useGetPurchase(purchaseId);

  const returnableItems = purchase?.items.filter(
    (item) => !existingPurchaseItemIds.includes(item.purchaseItemId),
  );

  useEffect(() => {
    if (open) {
      setSelectedItemId("");
      setQuantity("1");
    }
  }, [open]);

  const selectedPurchaseItem = purchase?.items.find(
    (item) => item.purchaseItemId.toString() === selectedItemId,
  );

  useEffect(() => {
    if (selectedPurchaseItem) {
      setQuantity("1");
    }
  }, [selectedItemId, selectedPurchaseItem]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPurchaseItem) return;

    const qtyNumber = Number(quantity);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      toast({
        title: "الكمية غير صالحة",
        description: "يرجى إدخال كمية صحيحة أكبر من الصفر.",
        variant: "destructive",
      });
      return;
    }

    if (qtyNumber > selectedPurchaseItem.quantity) {
      toast({
        title: "تجاوز الكمية المشتراة",
        description: `لا يمكن إرجاع كمية أكبر من الكمية المشتراة (${selectedPurchaseItem.quantity}).`,
        variant: "destructive",
      });
      return;
    }

    onAdd(
      {
        purchaseItemId: selectedPurchaseItem.purchaseItemId,
        batchId: selectedPurchaseItem.batchId ?? 0,
        quantity: qtyNumber,
        unitPrice: selectedPurchaseItem.purchasePrice,
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
    if (selectedPurchaseItem) {
      setQuantity(selectedPurchaseItem.quantity.toString());
    }
  };

  const handleSelectItem = (purchaseItemId: number) => {
    setSelectedItemId(purchaseItemId.toString());
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
          <EmptyPurchaseReturnState onClose={() => onOpenChange(false)} />
        ) : (
          <AddPurchaseReturnItemForm
            returnableItems={returnableItems ?? []}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            selectedPurchaseItem={selectedPurchaseItem}
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
