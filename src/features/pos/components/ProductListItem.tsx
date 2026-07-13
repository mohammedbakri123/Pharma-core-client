import { Plus, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { StockAlertDto } from "@features/inventory/types/inventory";

function getStockLevel(quantity: number) {
  if (quantity <= 0) return "out";
  if (quantity <= 5) return "critical";
  if (quantity <= 20) return "low";
  return "available";
}

const stockConfig = {
  out: {
    icon: XCircle,
    label: "نفد",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    dot: "bg-rose-500",
    glow: "shadow-rose-500/20",
  },
  critical: {
    icon: AlertTriangle,
    label: "حرج",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
    glow: "shadow-amber-500/20",
  },
  low: {
    icon: AlertTriangle,
    label: "منخفض",
    color: "text-amber-300",
    bg: "bg-amber-500/5",
    border: "border-amber-500/10",
    dot: "bg-amber-400",
    glow: "",
  },
  available: {
    icon: CheckCircle2,
    label: "متوفر",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    glow: "",
  },
};

export default function ProductListItem({
  product,
  onClick,
  isAdding,
  cartQuantity,
}: {
  product: StockAlertDto;
  onClick: (id: number) => void;
  isAdding: boolean;
  cartQuantity: number;
}) {
  const name = product.arabicName ?? product.name;
  const level = getStockLevel(product.totalQuantity);
  const config = stockConfig[level];
  const StockIcon = config.icon;
  const outOfStock = product.totalQuantity <= 0;
  const disabled = isAdding || outOfStock;

  return (
    <button
      onClick={() => onClick(product.medicineId)}
      disabled={disabled}
      className={`
        group relative w-full text-right
        rounded-xl border transition-all duration-300 ease-out
        disabled:pointer-events-none disabled:opacity-30
        ${disabled ? "" : "hover:translate-x-[-2px]"}
        ${
          cartQuantity > 0
            ? "border-primary/30 bg-primary/[0.03]"
            : "border-transparent hover:border-border/40 hover:bg-accent/40"
        }
      `}
    >
      {/* Cart badge */}
      {cartQuantity > 0 && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/30">
          {cartQuantity}
        </div>
      )}

      <div className="flex items-center gap-4 px-5 py-3.5">
        {/* Stock indicator */}
        <div className={`relative flex-shrink-0 ${disabled ? "" : "group-hover:scale-105"} transition-transform duration-300`}>
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${config.bg} ${config.border} border`}>
            <StockIcon className={`h-5 w-5 ${config.color}`} strokeWidth={1.5} />
          </div>
          {/* Pulsing dot for critical items */}
          {(level === "out" || level === "critical") && (
            <span className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${config.dot} animate-pulse`} />
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2.5">
            <h3 className="truncate text-[13px] font-semibold text-foreground/90 leading-tight">
              {name}
            </h3>
            {product.categoryName && (
              <span className="flex-shrink-0 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
                {product.categoryName}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-3">
            {product.barcode && (
              <span className="font-mono text-[11px] text-muted-foreground/40 tracking-tight">
                {product.barcode}
              </span>
            )}
            {product.nearestExpireDate && (
              <span className="text-[11px] text-muted-foreground/40">
                <span className="text-muted-foreground/30">•</span>{" "}
                ينتهي {new Date(product.nearestExpireDate).toLocaleDateString("ar-SA")}
              </span>
            )}
          </div>
        </div>

        {/* Stock count */}
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className={`text-sm font-bold tabular-nums ${config.color}`}>
              {product.totalQuantity <= 0 ? (
                <span className="text-xs">—</span>
              ) : (
                product.totalQuantity
              )}
            </div>
            <div className="text-[9px] font-medium text-muted-foreground/40 uppercase tracking-widest">
              {config.label}
            </div>
          </div>

          {/* Add button */}
          {!disabled && (
            <div className={`
              flex h-9 w-9 items-center justify-center rounded-lg
              border border-border/30 bg-card/50 text-muted-foreground/40
              opacity-0 scale-95
              group-hover:opacity-100 group-hover:scale-100 group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/10
              transition-all duration-200 ease-out
            `}>
              <Plus className="h-4 w-4" strokeWidth={2} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line for items in cart */}
      {cartQuantity > 0 && (
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-l from-primary/40 via-primary/20 to-transparent" />
      )}
    </button>
  );
}
