import { useAuthStore } from "@features/auth/store/authStore";
import { UserRole } from "@features/auth/types";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout, hasRole } =
    useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    hasRole,
    isAdmin: hasRole(UserRole.Admin),
    isCashier: hasRole(UserRole.Cashier),
  };
}
