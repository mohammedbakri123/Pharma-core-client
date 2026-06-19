import { Card } from "@/ui/card";
import SalesHeader from "../components/Sales/SalesHeader";
import SalesTable from "../components/Sales/SalesTable";

export default function SalesPage() {
  return (
    <Card>
      <SalesHeader />
      <SalesTable />
    </Card>
  );
}
