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
    <>
      {/* Mobile list layout */}
      <button
        onClick={() => onClick(product.medicineId)}
        disabled={disabled}
        className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card px-3 py-2.5 text-right transition-all duration-150 hover:border-primary/30 hover:bg-primary/[0.03] active:scale-[0.98] disabled:pointer-events-none sm:hidden"
        style={{ opacity: outOfStock ? 0.4 : undefined }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold leading-tight">{name}</h3>
            {cartQuantity > 0 && (
              <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartQuantity}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground/60">
            <span
              className={`inline-flex items-center gap-1 ${
                outOfStock
                  ? "text-destructive"
                  : lowStock
                    ? "text-amber-500"
                    : "text-muted-foreground/60"
              }`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  outOfStock
                    ? "bg-destructive"
                    : lowStock
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />
              {outOfStock ? "نفد" : `${product.totalQuantity}`}
            </span>
            {product.categoryName && (
              <>
                <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/20" />
                <span className="truncate">{product.categoryName}</span>
              </>
            )}
          </div>
        </div>

        {!disabled && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/40 bg-background text-muted-foreground opacity-0 transition-all duration-150 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary group-hover:opacity-100">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </button>

      {/* Desktop grid card */}
      <button
        onClick={() => onClick(product.medicineId)}
        disabled={disabled}
        className="group relative hidden flex-col rounded-2xl border border-border/50 bg-card p-3 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 disabled:pointer-events-none sm:flex sm:p-4"
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
    </>
  );
}
