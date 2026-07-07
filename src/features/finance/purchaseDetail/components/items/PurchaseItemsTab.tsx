import { useParams } from "react-router-dom";
import { useGetPurchase } from "../../../common/hooks/usePurchases";
import PurchaseItemsTable from "./PurchaseItemsTable";
import { Spinner } from "@/ui/spinner";

export default function PurchaseItemsTab() {
  const { id } = useParams<{ id: string }>();
  const purchaseId = Number(id);
  const { data: purchase, isLoading } = useGetPurchase(purchaseId);

  if (isLoading || !purchase) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return <PurchaseItemsTable purchase={purchase} />;
}
