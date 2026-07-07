import { useParams } from "react-router-dom";
import { useGetSale } from "../../../common/hooks/useSales";
import SaleItemsTable from "./SaleItemsTable";
import { Spinner } from "@/ui/spinner";

export default function SaleItemsTab() {
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

  return <SaleItemsTable sale={sale} />;
}
