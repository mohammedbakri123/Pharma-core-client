import { Spinner } from "@/ui/spinner";
import { Card, CardContent } from "@/ui/card";
import { Package } from "lucide-react";
import type { StockAlertDto } from "@features/inventory/types/inventory";

const colors = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
];

function getColor(id: number) {
  return colors[id % colors.length] ?? colors[0]!;
}

function StockBadge({ total }: { total: number }) {
  if (total <= 5)
    return (
      <span className="text-[10px] text-amber-500 dark:text-amber-400 font-medium">
        {total} متبقي
      </span>
    );
  return (
    <span className="text-[10px] text-muted-foreground">
      {total} متبقي
    </span>
  );
}

export default function ProductCard({
  product,
  onClick,
  isAdding,
  viewMode,
}: {
  product: StockAlertDto;
  onClick: (id: number) => void;
  isAdding: boolean;
  viewMode: "grid" | "list";
}) {
  const name = product.arabicName ?? product.name;

  if (viewMode === "list") {
    return (
      <button
        onClick={() => onClick(product.medicineId)}
        disabled={isAdding}
        className={`w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-right ${
          isAdding ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div
          className={`w-9 h-9 rounded-full ${getColor(product.medicineId)} flex items-center justify-center font-bold text-xs shrink-0`}
        >
          {isAdding ? <Spinner className="w-4 h-4" /> : name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{name}</div>
          <div className="text-xs text-muted-foreground">
            {product.categoryName ?? ""}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <StockBadge total={product.totalQuantity} />
        </div>
      </button>
    );
  }

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 group bg-card ${
        isAdding ? "pointer-events-none opacity-60" : ""
      }`}
      onClick={() => onClick(product.medicineId)}
    >
      <CardContent className="p-4 flex flex-col items-center text-center h-full justify-between gap-3">
        <div
          className={`w-12 h-12 rounded-full ${getColor(product.medicineId)} flex items-center justify-center font-bold text-lg mb-1 group-hover:scale-110 transition-transform`}
        >
          {isAdding ? <Spinner className="w-5 h-5" /> : name.charAt(0)}
        </div>

        <div>
          <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
            {name}
          </h3>
          <div className="flex items-center justify-center gap-1">
            <StockBadge total={product.totalQuantity} />
            {product.categoryName && (
              <>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">
                  {product.categoryName}
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
