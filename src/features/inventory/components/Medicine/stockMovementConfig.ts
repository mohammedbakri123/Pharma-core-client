export const stockMovementTypeLabels: Record<number, string> = {
  1: "وارد",
  2: "صادر",
  3: "تسوية",
};

export const stockMovementTypeBadge: Record<number, { label: string; className: string }> = {
  1: { label: "وارد", className: "bg-emerald-600 hover:bg-emerald-600/95 text-white" },
  2: { label: "صادر", className: "bg-red-600 hover:bg-red-600/95 text-white" },
  3: { label: "تسوية", className: "bg-amber-600 hover:bg-amber-600/95 text-white" },
};

export const referenceTypeLabels: Record<number, string> = {
  1: "مشتريات",
  2: "مبيعات",
  3: "مرتجع",
  4: "تسوية",
};