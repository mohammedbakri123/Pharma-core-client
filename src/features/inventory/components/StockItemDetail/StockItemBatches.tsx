import { useParams } from "react-router-dom";
import { useGetStockByMedicine } from "../../hooks/useInventory";
import { BatchesTable } from "./BatchesTable";
import { Spinner } from "@/ui/spinner";

export default function StockItemBatches() {
  const { id } = useParams<{ id: string }>();
  const medicineId = Number(id);
  const { data: stock, isLoading } = useGetStockByMedicine(medicineId);

  if (isLoading || !stock) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  const batches = stock.batches || [];
  return <BatchesTable batches={batches} />;
}
