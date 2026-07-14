import { Navigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { UserRole } from "@features/auth";

/** Redirects to the first tab the current user can access. */
export default function RoleRedirect({
  adminPath,
  defaultPath,
}: {
  adminPath: string;
  defaultPath: string;
}) {
  const { user } = useAuth();
  return (
    <Navigate
      to={user?.role === UserRole.Admin ? adminPath : defaultPath}
      replace
    />
  );
}
