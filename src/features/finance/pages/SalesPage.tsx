import { Card } from "@/ui/card";
import SalesHeader from "../components/Sales/SalesHeader";
import SalesTable from "../components/Sales/SalesTable";
import SalesFooter from "../components/Sales/SalesFooter";

export default function SalesPage() {
  return (
    <Card>
      <SalesHeader />
      <SalesTable />
      <SalesFooter />
    </Card>
  );
}
