import { useParams } from "react-router-dom";
import { useGetSale } from "../../../common/hooks/useSales";
import { SaleStatus } from "@/types";
import SaleReturnsSection from "./SaleReturnsSection";
import { Spinner } from "@/ui/spinner";

export default function SaleReturnsTab() {
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
  return <SaleReturnsSection saleId={sale.saleId} isCompleted={isCompleted} />;
}
