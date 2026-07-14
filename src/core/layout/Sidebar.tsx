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
import { useAuth } from "@features/auth/hooks/useAuth";
import { hasFeatureAccess, type Feature } from "@/permissions";
import logo from "@assets/generated_images/logo.png";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

const sidebarItems: {
  icon: typeof LayoutDashboard;
  label: string;
  to: string;
  feature: Feature;
}[] = [
  { icon: LayoutDashboard, label: "لوحة التحكم", to: "/", feature: "dashboard" },
  { icon: ShoppingCart, label: "نقطة البيع", to: "/pos", feature: "pos" },
  { icon: Package, label: "المخزون", to: "/inventory", feature: "inventory" },
  { icon: Users, label: "العملاء والموردين", to: "/people", feature: "people" },
  { icon: Landmark, label: "المالية", to: "/finance", feature: "finance" },
  { icon: Settings, label: "الإعدادات", to: "/settings", feature: "settings" },
];
// NOTE: featurePermissions in permissions.ts controls which sidebar items
// are visible per role. Only dashboard is restricted to Admin.

function SidebarLogo() {
  return (
    <>
      <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/40 shadow-sm">
        <img
          src={logo}
          alt="PharmaCore"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="font-heading font-bold text-lg tracking-tight">
          فارماكور
        </h1>
        <p className="text-xs text-sidebar-foreground/60">
          نظام ERP الإصدار 1.0
        </p>
      </div>
    </>
  );
}

function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const { user } = useAuth();

  const visibleItems = sidebarItems.filter((item) =>
    hasFeatureAccess(user?.role, item.feature)
  );

  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {visibleItems.map((item) => (
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
            : "bg-transparent pointer-events-none",
        )}
        style={{ backdropFilter: isSidebarOpen ? "blur(4px)" : "none" }}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 bottom-0 right-0 z-50 w-64 bg-sidebar text-sidebar-foreground shadow-2xl",
          "flex flex-col transition-transform duration-300 ease-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full",
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
