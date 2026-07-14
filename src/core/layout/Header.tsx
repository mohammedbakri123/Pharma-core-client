import { Button } from "@/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/utils/utils";
import ThemeToggle from "@/ui/ThemeToggle";
import { useApiHealth } from "@features/settings";
import { useSidebar } from "./sidebar-context";
import HeaderSearch from "./HeaderSearch";

export default function Header() {
  const { data: healthResponse } = useApiHealth();
  const { toggleSidebar } = useSidebar();

  const isHealthy = healthResponse?.status === "ok";

  const connectionState = {
    label: isHealthy ? "خدمة .NET متاحة" : "خدمة .NET غير متاحة",

    className: isHealthy
      ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",

    dotClassName: isHealthy ? "bg-green-500" : "bg-red-500",
  };

  return (
    <header className="h-14 md:h-16 bg-card border-b flex items-center justify-between gap-2 px-3 md:px-6 shadow-sm z-10">
      <div className="flex items-center gap-2 md:gap-4 md:flex-none md:w-1/3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground shrink-0"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <HeaderSearch />
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <ThemeToggle />

        <div
          className={cn(
            "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
            connectionState.className,
          )}
        >
          <div
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              connectionState.dotClassName,
            )}
          />
          {connectionState.label}
        </div>
      </div>
    </header>
  );
}
