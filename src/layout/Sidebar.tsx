import { cn } from "@/utils/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  TrendingUp,
  FileText,
} from "lucide-react";
import logo from "@assets/generated_images/minimalist_pharmacy_logo_icon.png";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

const sidebarItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", to: "/" },
  { icon: ShoppingCart, label: "نقطة البيع", to: "/pos" },
  { icon: Package, label: "المخزون", to: "/inventory" },
  { icon: Users, label: "المرضى", to: "/patients" },
  { icon: TrendingUp, label: "التقارير", to: "/reports" },
  { icon: FileText, label: "الفواتير", to: "/invoices" },
  { icon: Settings, label: "الإعدادات", to: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-l border-sidebar-border shadow-xl z-20">
      {/* 🔹 Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
          <img src={logo} alt="PharmaCore" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-lg tracking-tight">
            فارماكور
          </h1>
          <p className="text-xs text-sidebar-foreground/60">
            نظام ERP الإصدار 2.0
          </p>
        </div>
      </div>

      {/* 🔹 Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.to} item={item} />
        ))}
      </nav>

      {/* 🔹 Footer */}
      <SidebarFooter />
    </aside>
  );
}
