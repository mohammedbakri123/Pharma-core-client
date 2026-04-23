import { Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDarkMode((prev) => !prev)}
      className="text-muted-foreground hover:text-primary"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
