import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "cashier";
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const userRole = user?.role;
    if (role === "admin" && userRole !== 1) {
      return <Navigate to="/" replace />;
    }
    if (role === "cashier" && userRole !== 2) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
