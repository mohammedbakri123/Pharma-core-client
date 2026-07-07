import { Card } from "@/ui/card";
import PurchasesHeader from "../components/PurchasesHeader";
import PurchasesTable from "../components/PurchasesTable";
import PurchasesFooter from "../components/PurchasesFooter";

export default function PurchasesPage() {
  return (
    <Card>
      <PurchasesHeader />
      <PurchasesTable />
      <PurchasesFooter />
    </Card>
  );
}
