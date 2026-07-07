import { useParams } from "react-router-dom";
import { useGetPurchase } from "../../../common/hooks/usePurchases";
import { PurchaseStatus } from "@/types";
import PurchasePaymentsSection from "./PurchasePaymentsSection";
import { Spinner } from "@/ui/spinner";

export default function PurchasePaymentsTab() {
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

  const isCompleted = purchase.status === PurchaseStatus.Completed;
  return (
    <PurchasePaymentsSection
      purchaseId={purchase.purchaseId}
      isCompleted={isCompleted}
    />
  );
}
