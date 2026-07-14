import type { ReactNode } from "react";
import { useAuth } from "@features/auth/hooks/useAuth";
import { type UserRole } from "@features/auth";

interface RoleGateProps {
  /** Only these roles see the children. If omitted, everyone sees them. */
  allowedRoles?: UserRole[];
  /** Fallback to render when the user's role is not allowed. */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Conditionally renders children based on the current user's role.
 *
 * Usage:
 *   <RoleGate allowedRoles={[UserRole.Admin]}>
 *     <Button>Delete</Button>
 *   </RoleGate>
 *
 *   <RoleGate allowedRoles={[UserRole.Admin]} fallback={<Button disabled>...</Button>}>
 *     <Button>Edit</Button>
 *   </RoleGate>
 */
export default function RoleGate({
  allowedRoles,
  fallback = null,
  children,
}: RoleGateProps) {
  const { user } = useAuth();

  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  if (user?.role && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
