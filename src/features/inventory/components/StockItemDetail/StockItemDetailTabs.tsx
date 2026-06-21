import { CardContent } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Package, Layers, DollarSign, SaudiRiyal } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { StatCard } from "./StatCard";
import { BatchesTable } from "./BatchesTable";
import type { BatchStockDto } from "../../types/inventory";

interface StockItemDetailTabsProps {
  batches: BatchStockDto[];
  totalQuantity: number;
}

export default function StockItemDetailTabs({
  batches,
  totalQuantity,
}: StockItemDetailTabsProps) {
  const totalValue = batches.reduce(
    (s, b) => s + b.quantityRemaining * b.purchasePrice,
    0,
  );

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="px-6 border-b border-border/40 bg-muted/5">
        <TabsList className="bg-transparent border-b border-transparent w-full justify-end gap-6 p-0 h-12 rounded-none">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger
            value="batches"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            الباتشات ({batches.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <CardContent className="p-6">
        <TabsContent value="overview" className="mt-0 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <StatCard
              icon={Package}
              label="الكمية المتبقية"
              value={new Intl.NumberFormat("ar-SA").format(totalQuantity)}
            />
            <StatCard
              icon={Layers}
              label="عدد الباتشات"
              value={batches.length}
            />
            <StatCard
              icon={DollarSign}
              label="إجمالي قيمة المخزون"
              value={
                <span className="flex items-center gap-1">
                  {formatCurrency(totalValue)}
                  <SaudiRiyal className="w-4 h-4" />
                </span>
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="batches" className="mt-0 outline-none">
          <BatchesTable batches={batches} />
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
