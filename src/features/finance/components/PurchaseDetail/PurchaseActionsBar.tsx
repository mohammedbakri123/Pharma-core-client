import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/button";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import { Ban, CheckCircle } from "lucide-react";
import { PurchaseStatus } from "@/types";
import { useCancelPurchase } from "../../hooks/usePurchases";
import CompletePurchaseDialog from "./CompletePurchaseDialog";

interface PurchaseActionsBarProps {
  purchaseId: number;
  status: PurchaseStatus;
}

export default function PurchaseActionsBar({
  purchaseId,
  status,
}: PurchaseActionsBarProps) {
  const navigate = useNavigate();
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const cancelMutation = useCancelPurchase();

  if (status !== PurchaseStatus.Draft) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setCompleteDialogOpen(true)}
          className="gap-1 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          إتمام الفاتورة
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCancelDialogOpen(true)}
          className="gap-1 text-destructive border-destructive/30 hover:text-destructive cursor-pointer"
        >
          <Ban className="w-4 h-4" />
          إلغاء الفاتورة
        </Button>
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="إلغاء الفاتورة"
        description="هل أنت متأكد من إلغاء هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="إلغاء الفاتورة"
        cancelLabel="تراجع"
        variant="destructive"
        onConfirm={() =>
          cancelMutation.mutate(purchaseId, {
            onSuccess: () => navigate("/finance"),
          })
        }
        isPending={cancelMutation.isPending}
      />

      <CompletePurchaseDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        purchaseId={purchaseId}
      />
    </>
  );
}
