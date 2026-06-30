import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/button";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import { CheckCircle, Ban } from "lucide-react";
import { SaleStatus } from "@/types";
import { useCancelSale } from "../../../hooks/useSales";
import CompleteSaleDialog from "./CompleteSaleDialog";

interface SaleActionsBarProps {
  saleId: number;
  status: SaleStatus;
}

export default function SaleActionsBar({
  saleId,
  status,
}: SaleActionsBarProps) {
  const navigate = useNavigate();
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const cancelMutation = useCancelSale();

  if (status !== SaleStatus.Draft) return null;

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
          cancelMutation.mutate(saleId, {
            onSuccess: () => navigate("/finance"),
          })
        }
        isPending={cancelMutation.isPending}
      />

      <CompleteSaleDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        saleId={saleId}
      />
    </>
  );
}
