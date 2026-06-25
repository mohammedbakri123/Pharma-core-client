import { LogOut, User } from "lucide-react";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { useAuthStore } from "@features/auth/store/authStore";
import { useLogout } from "@features/auth/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@features/settings/hooks/useUser";
import { UserRole } from "@features/auth";

export default function SidebarFooter() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  const getRoleName = (role?: UserRole) => {
    if (role === UserRole.Admin) return "مدير النظام";
    if (role === UserRole.Cashier) return "كاشير / صيدلاني";
    return "مستخدم";
  };

  const getFallbackText = (name?: string) => {
    if (!name) return "ص";
    return name.slice(0, 2);
  };

  return (
    <div className="p-4 mt-auto border-t border-sidebar-border/50">
      <Link
        to="/profile"
        className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 cursor-pointer"
      >
        <Avatar className="w-9 h-9 border border-sidebar-border shadow-sm">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.userName || "Admin"}&backgroundColor=1ab298`}
          />
          <AvatarFallback>{getFallbackText(user?.userName)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold truncate text-foreground/90">
            {user?.userName || "غير متصل"}
          </p>
          <p className="text-xs text-sidebar-foreground/60 truncate font-medium">
            {getRoleName(user?.role)}
          </p>
        </div>
      </Link>

      <Button
        onClick={handleLogout}
        variant="ghost"
        disabled={logoutMutation.isPending}
        className="w-full justify-start text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
        size="sm"
      >
        <LogOut className="w-4 h-4 ml-2" />
        {logoutMutation.isPending ? "جاري الخروج..." : "تسجيل الخروج"}
      </Button>
    </div>
  );
}
