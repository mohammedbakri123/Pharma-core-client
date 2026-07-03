import { useParams } from "react-router-dom";
import { useGetSale } from "@features/finance/hooks/useSales";
import { useGetReturnSale } from "@features/finance/hooks/useReturns";
import { SaleStatus } from "@/types";
import { Spinner } from "@/ui/spinner";
import SalesReturnPaymentSection from "./SalesReturnPaymentSection";

export default function SalesReturnPaymentsTab() {
  const { id } = useParams<{ id: string }>();
  const saleId = Number(id);
  const { data: sale, isLoading } = useGetSale(saleId);

  if (isLoading || !sale) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  const isCompleted = sale.status === SaleStatus.Completed;
  return (
    <SalesReturnPaymentSection saleId={sale.saleId} isCompleted={isCompleted} />
  );
}
