import { Navigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { UserRole } from "@features/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Allow only these roles. If omitted, any authenticated user can access. */
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user?.role && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
