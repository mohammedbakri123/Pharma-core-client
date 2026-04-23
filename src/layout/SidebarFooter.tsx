import { LogOut } from "lucide-react";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";

export default function SidebarFooter() {
  const handleLogout = () => {
    // 🔥 هنا لاحقًا تربطها مع auth
    console.log("logout");
  };

  return (
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
        onClick={handleLogout}
        variant="ghost"
        className="w-full justify-start text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
        size="sm"
      >
        <LogOut className="w-4 h-4 ml-2" />
        تسجيل الخروج
      </Button>
    </div>
  );
}
