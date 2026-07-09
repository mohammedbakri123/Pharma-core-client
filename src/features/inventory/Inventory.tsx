import { Outlet } from "react-router-dom";
import InventoryHeader from "./components/InventoryHeader";
import TabNav from "@/ui/TabNav";
import { Warehouse, Pill } from "lucide-react";

const tabs = [
  { to: "/inventory/stock", label: "المخزن", icon: <Warehouse className="w-4 h-4" /> },
  { to: "/inventory/medicines", label: "الاصناف", icon: <Pill className="w-4 h-4" /> },
];

export default function Inventory() {
  return (
    <div className="space-y-6" dir="rtl">
      <InventoryHeader />
      <TabNav tabs={tabs} variant="pill">
        <Outlet />
      </TabNav>
    </div>
  );
}
