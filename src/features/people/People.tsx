import { Outlet } from "react-router-dom";
import PeopleHeader from "./components/PeopleHeader";
import TabNav from "@/ui/TabNav";
import { Users, Truck } from "lucide-react";

const tabs = [
  { to: "/people/customers", label: "العملاء", icon: <Users className="w-4 h-4" /> },
  { to: "/people/suppliers", label: "الموردين", icon: <Truck className="w-4 h-4" /> },
];

export default function People() {
  return (
    <div className="space-y-6" dir="rtl">
      <PeopleHeader />
      <TabNav tabs={tabs} variant="pill">
        <Outlet />
      </TabNav>
    </div>
  );
}
