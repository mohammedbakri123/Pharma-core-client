import { useParams } from "react-router-dom";
import { usePurchaseReturnById } from "@features/finance/common/hooks/usePurchaseReturns";
import { PurchaseReturnStatus } from "@/types";
import { Spinner } from "@/ui/spinner";
import PurchaseReturnPaymentSection from "./PurchaseReturnPaymentSection";

export default function PurchaseReturnPaymentsTab() {
  const { id, returnId } = useParams<{ id: string; returnId: string }>();
  const purchaseId = Number(id);
  const returnIdNum = Number(returnId);
  const { data: returnData, isLoading } = usePurchaseReturnById(
    purchaseId,
    returnIdNum,
  );

  if (isLoading || !returnData) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  const isCompleted = returnData.status === PurchaseReturnStatus.Completed;
  return (
    <PurchaseReturnPaymentSection
      purchaseId={purchaseId}
      returnId={returnIdNum}
      isCompleted={isCompleted}
    />
  );
}
