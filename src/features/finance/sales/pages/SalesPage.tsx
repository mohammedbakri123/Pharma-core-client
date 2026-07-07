import { Card } from "@/ui/card";
import SalesHeader from "../components/SalesHeader";
import SalesTable from "../components/SalesTable";
import SalesFooter from "../components/SalesFooter";

export default function SalesPage() {
  return (
    <Card>
      <SalesHeader />
      <SalesTable />
      <SalesFooter />
    </Card>
  );
}
