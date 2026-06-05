import { Navigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { UserRole } from "@features/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  console.log(user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

 
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;}

  return <>{children}</>;
}
