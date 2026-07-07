import { Button } from "@/ui/button";
import { useGetSale } from "@features/finance/common/hooks/useSales";
import { useAddSaleReturnItem } from "@features/finance/common/hooks/useSalesReturns";
import {
  SalesReturnDetailsDto,
  SalesReturnStatus,
} from "@features/finance/common/types/salesReturn";
import { Plus, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import AddReturnItemDialog from "./addItems/AddReturnItemDialog";

interface props {
  salesReturn: SalesReturnDetailsDto;
}

export default function SalesReturnItemSectionHeader({ salesReturn }: props) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { mutate: addReturnItem, isPending: isAdding } = useAddSaleReturnItem(
    salesReturn.saleId,
    salesReturn.salesReturnId,
  );

  return (
    <div className="flex flex-row-reverse items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        إجمالي {salesReturn.items.length} أصناف مرتجعة
      </h3>
      <div className="flex items-center gap-2">
        {salesReturn.status === SalesReturnStatus.Draft && (
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
      {/* Dialogs */}
      {addDialogOpen && (
        <AddReturnItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          existingSaleItemIds={salesReturn.items.map((i) => i.saleItemId)}
          onAdd={addReturnItem}
          isPending={isAdding}
          saleId={salesReturn.saleId}
        />
      )}
    </div>
  );
}
