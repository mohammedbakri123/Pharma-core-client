import { Link, useLocation } from "wouter";
import { cn } from "@/utils/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Input } from "@/ui/input";
// import { useApiHealth } from "@/core/api/endpoints/system";
import { useState, useEffect } from "react";
import logo from "@assets/generated_images/minimalist_pharmacy_logo_icon.png";

const sidebarItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
  { icon: ShoppingCart, label: "نقطة البيع", href: "/pos" },
  { icon: Package, label: "المخزون", href: "/inventory" },
  { icon: Users, label: "المرضى", href: "/patients" },
  { icon: TrendingUp, label: "التقارير", href: "/reports" },
  { icon: FileText, label: "الفواتير", href: "/invoices" },
  { icon: Settings, label: "الإعدادات", href: "/settings" },
];

// Connection state

// isloading

// {
//   label: "جاري فحص الواجهة الخلفية",
//   className: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
//   dotClassName: "bg-amber-500",
// }

// data?
// {
//   label: "خدمة .NET متصلة",
//   className: "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
//   dotClassName: "bg-green-500",
// }

// not present

// {
//   label: "خدمة .NET غير متاحة",
//   className: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
//   dotClassName: "bg-red-500",
// }

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const apiHealth = useApiHealth();

  const connectionState = {
    label: "خدمة .NET غير متاحة",
    className:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    dotClassName: "bg-red-500",
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className="flex h-screen bg-background font-sans overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-l border-sidebar-border shadow-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
            <img
              src={logo}
              alt="PharmaCore"
              className="w-8 h-8 object-contain"
            />
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

        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-primary-foreground"
                        : "text-sidebar-foreground/50"
                    )}
                  />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-sidebar-border/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <Avatar className="w-9 h-9 border border-sidebar-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>د.س</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">د. سارة أحمد</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                صيدلاني مسؤول
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
            size="sm"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full max-w-md">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن أدوية، مرضى، أو فواتير..."
                className="pr-9 bg-background border-input focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-muted-foreground hover:text-primary"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
                connectionState.className
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  connectionState.dotClassName
                )}
              />
              {connectionState.label}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 left-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background/50 p-6">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
