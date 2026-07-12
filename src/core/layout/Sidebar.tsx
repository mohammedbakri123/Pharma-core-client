import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Landmark,
  X,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSidebar } from "./sidebar-context";
import logo from "@assets/generated_images/minimalist_pharmacy_logo_icon.png";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

const sidebarItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", to: "/" },
  { icon: ShoppingCart, label: "نقطة البيع", to: "/pos" },
  { icon: Package, label: "المخزون", to: "/inventory" },
  { icon: Users, label: "العملاء والموردين", to: "/people" },
  { icon: Landmark, label: "المالية", to: "/finance" },
  { icon: Settings, label: "الإعدادات", to: "/settings" },
];

function SidebarLogo() {
  return (
    <>
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
    </>
  );
}

function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {sidebarItems.map((item) => (
        <SidebarItem key={item.to} item={item} onClick={onItemClick} />
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { isSidebarOpen, closeSidebar } = useSidebar();

  if (isDesktop) {
    return (
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-l border-sidebar-border shadow-xl z-20 shrink-0">
        <div className="p-6 flex items-center gap-3 shrink-0">
          <SidebarLogo />
        </div>
        <SidebarNav />
        <SidebarFooter />
      </aside>
    );
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300",
          isSidebarOpen
            ? "bg-black/50 pointer-events-auto"
            : "bg-transparent pointer-events-none"
        )}
        style={{ backdropFilter: isSidebarOpen ? "blur(4px)" : "none" }}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 bottom-0 right-0 z-50 w-64 bg-sidebar text-sidebar-foreground shadow-2xl",
          "flex flex-col transition-transform duration-300 ease-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <SidebarLogo />
          </div>
          <button
            onClick={closeSidebar}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity text-sidebar-foreground/60 hover:text-sidebar-foreground"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarNav onItemClick={closeSidebar} />
        <SidebarFooter />
      </aside>
    </>
  );
}
