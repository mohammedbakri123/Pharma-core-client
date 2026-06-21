import { Card } from "@/ui/card";
import PurchasesHeader from "../components/Purchases/PurchasesHeader";
import PurchasesTable from "../components/Purchases/PurchasesTable";

export default function PurchasesPage() {
  return (
    <Card>
      <PurchasesHeader />
      <PurchasesTable />
    </Card>
  );
}
