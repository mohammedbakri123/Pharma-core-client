import { Check } from "lucide-react";
import type { StockAlertDto } from "@features/inventory/types/inventory";

const gradients = [
  "from-primary/15 to-primary/5",
  "from-blue-500/15 to-blue-500/5",
  "from-amber-500/15 to-amber-500/5",
  "from-rose-500/15 to-rose-500/5",
  "from-violet-500/15 to-violet-500/5",
  "from-emerald-500/15 to-emerald-500/5",
  "from-orange-500/15 to-orange-500/5",
  "from-cyan-500/15 to-cyan-500/5",
];

function getGradient(id: number) {
  return gradients[id % gradients.length] ?? gradients[0]!;
}

export default function ProductCard({
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
  const outOfStock = product.totalQuantity <= 0;
  const lowStock = product.totalQuantity > 0 && product.totalQuantity <= 5;
  const disabled = isAdding || outOfStock;

  return (
    <button
      onClick={() => onClick(product.medicineId)}
      disabled={disabled}
      className="group relative flex flex-col rounded-2xl border border-border/50 bg-card p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 disabled:pointer-events-none"
      style={{ opacity: outOfStock ? 0.4 : undefined }}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${getGradient(product.medicineId)} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />

      <div className="relative z-10 flex flex-col gap-2.5">
        {cartQuantity > 0 && (
          <div className="absolute left-0 top-0 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
            {cartQuantity}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                outOfStock
                  ? "bg-destructive"
                  : lowStock
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium ${
                outOfStock
                  ? "text-destructive"
                  : lowStock
                    ? "text-amber-500"
                    : "text-muted-foreground"
              }`}
            >
              {outOfStock ? "نفد" : `${product.totalQuantity}`}
            </span>
          </div>
          {!disabled && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground opacity-0 shadow-sm transition-all duration-200 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary group-hover:opacity-100">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {name}
          </h3>
          {product.categoryName && (
            <p className="text-[11px] text-muted-foreground/70">
              {product.categoryName}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
