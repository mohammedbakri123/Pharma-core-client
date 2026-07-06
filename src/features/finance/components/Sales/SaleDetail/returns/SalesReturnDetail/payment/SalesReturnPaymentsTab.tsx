import { useParams } from "react-router-dom";
import { useSaleReturnById } from "@features/finance/hooks/useSalesReturns";
import { SalesReturnStatus } from "@/types";
import { Spinner } from "@/ui/spinner";
import SalesReturnPaymentSection from "./SalesReturnPaymentSection";

export default function SalesReturnPaymentsTab() {
  const { id, returnId } = useParams<{ id: string; returnId: string }>();
  const saleId = Number(id);
  const returnIdNum = Number(returnId);
  const { data: returnData, isLoading } = useSaleReturnById(
    saleId,
    returnIdNum,
  );

  if (isLoading || !returnData) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  const isCompleted = returnData.status === SalesReturnStatus.Completed;
  return (
    <SalesReturnPaymentSection
      saleId={saleId}
      returnId={returnIdNum}
      isCompleted={isCompleted}
    />
  );
}
