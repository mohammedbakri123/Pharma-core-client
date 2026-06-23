import { CardContent } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { ShoppingCart, CreditCard, RotateCcw } from "lucide-react";
import SaleItemsTable from "./SaleItemsTable";
import SalePaymentsSection from "./SalePaymentsSection";
import SaleReturnsSection from "./SaleReturnsSection";
import type { SaleDetailsDto } from "@/types";
import { SaleStatus } from "@/types";

interface SaleDetailTabsProps {
  sale: SaleDetailsDto;
}

export default function SaleDetailTabs({ sale }: SaleDetailTabsProps) {
  const isCompleted = sale.status === SaleStatus.Completed;

  return (
    <Tabs defaultValue="items" className="w-full">
      <div className="px-6 border-b border-border/40 bg-muted/5">
        <TabsList className="bg-transparent border-b border-transparent w-full justify-end gap-6 p-0 h-12 rounded-none">
          <TabsTrigger
            value="items"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            الأصناف
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            المدفوعات
          </TabsTrigger>
          <TabsTrigger
            value="returns"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            المرتجعات
          </TabsTrigger>
        </TabsList>
      </div>

      <CardContent className="p-6">
        <TabsContent value="items" className="mt-0 outline-none">
          <SaleItemsTable sale={sale} />
        </TabsContent>
        <TabsContent value="payments" className="mt-0 outline-none">
          <SalePaymentsSection saleId={sale.saleId} isCompleted={isCompleted} />
        </TabsContent>
        <TabsContent value="returns" className="mt-0 outline-none">
          <SaleReturnsSection saleId={sale.saleId} isCompleted={isCompleted} />
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
