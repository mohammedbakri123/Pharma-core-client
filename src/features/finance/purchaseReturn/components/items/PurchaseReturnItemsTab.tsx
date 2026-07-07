import { useParams } from "react-router-dom";

import { Spinner } from "@/ui/spinner";
import { usePurchaseReturnById } from "@features/finance/common/hooks/usePurchaseReturns";
import PurchaseReturnTable from "./PurchaseReturnTable";

export default function PurchaseReturnItemsTab() {
  const { id } = useParams<{ id: string }>();
  const { returnId } = useParams<{ returnId: string }>();

  const purchaseId = Number(id);
  const purchaseReturnId = Number(returnId);
  const { data: purchaseReturn, isLoading } = usePurchaseReturnById(
    purchaseId,
    purchaseReturnId,
  );

  if (isLoading || !purchaseReturn) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return <PurchaseReturnTable purchaseReturn={purchaseReturn} />;
}
