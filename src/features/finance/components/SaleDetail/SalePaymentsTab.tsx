import { useParams } from "react-router-dom";
import { useGetSale } from "../../hooks/useSales";
import { SaleStatus } from "@/types";
import SalePaymentsSection from "./SalePaymentsSection";
import { Spinner } from "@/ui/spinner";

export default function SalePaymentsTab() {
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
  return <SalePaymentsSection saleId={sale.saleId} isCompleted={isCompleted} />;
}
