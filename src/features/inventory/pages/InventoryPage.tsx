import { Card } from "@/ui/card";
import InventoryHeader from "../components/Inventory/InventoryHeader";
import InventoryTable from "../components/Inventory/InventoryTable";
import InventoryFooter from "../components/Inventory/InventoryFooter";

export default function InventoryPage() {
  return (
    <Card>
      <InventoryHeader />
      <InventoryTable />
      <InventoryFooter />
    </Card>
  );
}
