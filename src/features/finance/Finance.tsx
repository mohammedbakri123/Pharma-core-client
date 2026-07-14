import { Outlet } from "react-router-dom";
import { Receipt, Coins, Wallet, ArrowLeftRight } from "lucide-react";
import TabNav from "@/ui/TabNav";
import { UserRole } from "@features/auth";

const tabs = [
  {
    to: "/finance/payments",
    label: "عام",
    icon: <ArrowLeftRight className="w-4 h-4" />,
    allowedRoles: [UserRole.Admin],
  },
  {
    to: "/finance/sales",
    label: "المبيعات",
    icon: <Coins className="w-4 h-4" />,
  },
  {
    to: "/finance/purchases",
    label: "المشتريات",
    icon: <Wallet className="w-4 h-4" />,
    allowedRoles: [UserRole.Admin],
  },
  {
    to: "/finance/expenses",
    label: "المصروفات",
    icon: <Receipt className="w-4 h-4" />,
    allowedRoles: [UserRole.Admin],
  },
];

export default function Finance() {
  return (
    <div className="space-y-6" dir="rtl">
      <TabNav tabs={tabs} variant="pill">
        <Outlet />
      </TabNav>
    </div>
  );
}
