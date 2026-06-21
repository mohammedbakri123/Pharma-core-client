export const statementTypeLabels: Record<string, string> = {
  invoice: "فاتورة مبيعات",
  sale: "فاتورة مبيعات",
  payment: "سند قبض (دفعة)",
  return: "مرتجع مبيعات",
  salesreturn: "مرتجع مبيعات",
};

export const statementTypeBadgeConfig: Record<string, { label: string; className: string }> = {
  invoice: {
    label: "فاتورة مبيعات",
    className: "bg-blue-600 hover:bg-blue-600/95 text-white",
  },
  sale: {
    label: "فاتورة مبيعات",
    className: "bg-blue-600 hover:bg-blue-600/95 text-white",
  },
  payment: {
    label: "سند قبض (دفعة)",
    className: "bg-emerald-600 hover:bg-emerald-600/95 text-white",
  },
  return: {
    label: "مرتجع مبيعات",
    className: "bg-amber-600 hover:bg-amber-600/95 text-white",
  },
  salesreturn: {
    label: "مرتجع مبيعات",
    className: "bg-amber-600 hover:bg-amber-600/95 text-white",
  },
};
