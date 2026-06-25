import { Card } from "@/ui/card";
import PurchasesHeader from "../components/Purchases/PurchasesHeader";
import PurchasesTable from "../components/Purchases/PurchasesTable";
import PurchasesFooter from "../components/Purchases/PurchasesFooter";

export default function PurchasesPage() {
  return (
    <Card>
      <PurchasesHeader />
      <PurchasesTable />
      <PurchasesFooter />
    </Card>
  );
}
