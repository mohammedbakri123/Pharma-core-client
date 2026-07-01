import { useParams } from "react-router-dom";

import { Spinner } from "@/ui/spinner";
import { useSaleReturnById } from "@features/finance/hooks/useSalesReturns";
import SalesReturnTable from "./SalesReturnTable";

export default function SalesReturnItemsTab() {
  const { id } = useParams<{ id: string }>();
  const { returnId } = useParams<{ returnId: string }>();

  const saleId = Number(id);
  const saleReturnId = Number(returnId);
  const { data: salesReturn, isLoading } = useSaleReturnById(
    saleId,
    saleReturnId,
  );

  if (isLoading || !salesReturn) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return <SalesReturnTable SaleReturn={salesReturn} />;
}
