import InventoryHeader from "./components/InventoryHeader";
import InventoryTabs from "./components/InventoryTabs";

export default function Inventory() {
  return (
    <div className="space-y-6" dir="rtl">
      <InventoryHeader />
      <InventoryTabs />
    </div>
  );
}
