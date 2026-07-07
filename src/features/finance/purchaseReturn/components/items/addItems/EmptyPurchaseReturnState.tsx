import { Ban } from "lucide-react";
import { Button } from "@/ui/button";

interface EmptyPurchaseReturnStateProps {
  onClose: () => void;
}

export default function EmptyPurchaseReturnState({ onClose }: EmptyPurchaseReturnStateProps) {
  return (
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
        onClick={onClose}
        className="mt-2"
      >
        إغلاق
      </Button>
    </div>
  );
}
