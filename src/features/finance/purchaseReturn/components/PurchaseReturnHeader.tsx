import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/button";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import PurchaseReturnStatusBadge from "./PurchaseReturnStatusBadge";
import { PurchaseReturnDetailsDto, PurchaseReturnStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  useCancelPurchaseReturn,
  useCompletePurchaseReturn,
} from "@features/finance/common/hooks/usePurchaseReturns";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/ui/confirm-dialog";

interface PurchaseReturnHeaderProps {
  purchaseReturn: PurchaseReturnDetailsDto;
  onBack: () => void;
}

export default function PurchaseReturnHeader({
  purchaseReturn,
  onBack,
}: PurchaseReturnHeaderProps) {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { mutate: completeReturn, isPending: isCompleting } =
    useCompletePurchaseReturn(purchaseReturn.purchaseId!);
  const { mutate: cancelReturn, isPending: isCancelling } = useCancelPurchaseReturn(
    purchaseReturn.purchaseId!,
  );

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCompleteReturn = () => {
    completeReturn(purchaseReturn.purchaseReturnId, {
      onSuccess: () => {
        setCompleteDialogOpen(false);

        toast({
          title: "تم إكمال المرتجع",
          description: "تم إكمال المرتجع وتحديث المخزون بنجاح.",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "فشل إكمال المرتجع",
          description: "حدث خطأ أثناء إكمال المرتجع. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      },
    });
  };

  const handleCancelReturn = () => {
    cancelReturn(purchaseReturn.purchaseReturnId, {
      onSuccess: () => {
        setCancelDialogOpen(false);
        toast({
          title: "تم إلغاء المرتجع",
          description: "تم إلغاء المرتجع بنجاح.",
          variant: "success",
        });
        navigate(`/finance/purchases/${purchaseReturn.purchaseId}/returns`);
      },
      onError: () => {
        toast({
          title: "فشل إلغاء المرتجع",
          description: "حدث خطأ أثناء إلغاء المرتجع.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        العودة إلى المرتجعات
      </Button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 shadow-md border border-primary/20">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                تفاصيل المرتجع #{purchaseReturn.purchaseReturnId}
              </h1>
              <PurchaseReturnStatusBadge
                status={purchaseReturn.status ?? PurchaseReturnStatus.Draft}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              المرتجع تابع للفاتورة الأصليّة #{purchaseReturn.purchaseId}
              {purchaseReturn.createdAt &&
                ` | تاريخ المرتجع: ${formatDate(purchaseReturn.createdAt)}`}
            </p>
          </div>
        </div>

        {purchaseReturn.status === PurchaseReturnStatus.Draft && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelDialogOpen(true)}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
              disabled={isCancelling}
            >
              <XCircle className="w-4 h-4 ml-1" />
              إلغاء المرتجع
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setCompleteDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              disabled={isCompleting || purchaseReturn.items.length === 0}
            >
              <CheckCircle className="w-4 h-4 ml-1" />
              إكمال المرتجع
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        title="تأكيد إكمال المرتجع"
        description="هل أنت متأكد من إكمال هذا المرتجع؟ سيتم ترحيل المرتجع وتعديل كميات المخزون نهائياً ولا يمكن التراجع أو التعديل بعد ذلك."
        confirmLabel="إكمال المرتجع"
        cancelLabel="إلغاء"
        onConfirm={handleCompleteReturn}
        isPending={isCompleting}
        variant="default"
      />

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="تأكيد إلغاء المرتجع"
        description="هل أنت متأكد من إلغاء هذا المرتجع؟ سيتم حذف مسودة المرتجع ولن يتم إجراء أي تعديل على المخزون."
        confirmLabel="إلغاء المرتجع"
        cancelLabel="تراجع"
        onConfirm={handleCancelReturn}
        isPending={isCancelling}
        variant="destructive"
      />
    </div>
  );
}
