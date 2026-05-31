import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { cn } from "@/utils/utils";
import { useEffect, useState } from "react";
import ThemeToggle from "@/ui/ThemeToggle";

export default function Header() {
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", isDarkMode);
  // }, [isDarkMode]);

  const connectionState = {
    label: "خدمة .NET غير متاحة",
    className:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    dotClassName: "bg-red-500",
  };

  return (
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
        {/* <Button
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
        </Button> */}
        <ThemeToggle />

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
  );
}
