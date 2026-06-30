import { Button } from "@/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import React from "react";

interface props {
  itemLength: number;
  isDraft: boolean;
  setAddDialogOpen: (open: boolean) => void;
  isAdding: boolean;
}

export default function SalesReturnItemSectionHeader({
  itemLength,
  isDraft,
  setAddDialogOpen,
  isAdding,
}: props) {
  return (
    <div className="flex flex-row-reverse items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        إجمالي {itemLength} أصناف مرتجعة
      </h3>
      <div className="flex items-center gap-2">
        {isDraft && (
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
    </div>
  );
}
