import { UserRole } from "@features/auth";

/**
 * Role-based access permissions configuration.
 *
 * To add a new role:
 * 1. Add it to the UserRole enum in @features/auth/types
 * 2. Add its permission entries below using the helpers
 */

export type Feature =
  | "dashboard"
  | "pos"
  | "inventory"
  | "people"
  | "finance"
  | "settings";

/** Map each feature to the roles that can access it (sidebar visibility). */
const featurePermissions: Record<Feature, UserRole[]> = {
  dashboard: [UserRole.Admin],
  pos: [UserRole.Admin, UserRole.Cashier],
  inventory: [UserRole.Admin, UserRole.Cashier],
  people: [UserRole.Admin, UserRole.Cashier],
  finance: [UserRole.Admin, UserRole.Cashier],
  settings: [UserRole.Admin, UserRole.Cashier],
};

export function hasFeatureAccess(
  role: UserRole | undefined,
  feature: Feature
): boolean {
  if (!role) return false;
  return featurePermissions[feature]?.includes(role) ?? false;
}
