import { Button } from "@/ui/button";
import { useGetPurchase } from "@features/finance/common/hooks/usePurchases";
import { useAddPurchaseReturnItem } from "@features/finance/common/hooks/usePurchaseReturns";
import {
  PurchaseReturnDetailsDto,
  PurchaseReturnStatus,
} from "@/types";
import { Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import AddPurchaseReturnItemDialog from "./addItems/AddPurchaseReturnItemDialog";

interface Props {
  purchaseReturn: PurchaseReturnDetailsDto;
}

export default function PurchaseReturnTableHeader({ purchaseReturn }: Props) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { mutate: addReturnItem, isPending: isAdding } = useAddPurchaseReturnItem(
    purchaseReturn.purchaseId!,
    purchaseReturn.purchaseReturnId,
  );

  return (
    <div className="flex flex-row-reverse items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        إجمالي {purchaseReturn.items.length} أصناف مرتجعة
      </h3>
      <div className="flex items-center gap-2">
        {purchaseReturn.status === PurchaseReturnStatus.Draft && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="gap-1 cursor-pointer"
            disabled={isAdding}
          >
            <Plus className="w-4 h-4" />
            إضافة صنف
          </Button>
        )}
        <h3 className="font-semibold text-base flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-primary" />
          الأصناف المرتجعة
        </h3>
      </div>
      {addDialogOpen && (
        <AddPurchaseReturnItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          existingPurchaseItemIds={purchaseReturn.items.map((i) => i.purchaseItemId)}
          onAdd={addReturnItem}
          isPending={isAdding}
          purchaseId={purchaseReturn.purchaseId!}
        />
      )}
    </div>
  );
}
