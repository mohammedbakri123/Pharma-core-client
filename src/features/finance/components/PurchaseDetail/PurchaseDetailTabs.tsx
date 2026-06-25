import { CardContent } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import type { PurchaseDetailsDto } from "@/types";
import { PurchaseStatus } from "@/types";
import PurchaseItemsTable from "./PurchaseItemsTable";
import PurchasePaymentsSection from "./PurchasePaymentsSection";
import PurchaseReturnsSection from "./PurchaseReturnsSection";

interface PurchaseDetailTabsProps {
  purchase: PurchaseDetailsDto;
}

export default function PurchaseDetailTabs({
  purchase,
}: PurchaseDetailTabsProps) {
  const isCompleted = purchase.status === PurchaseStatus.Completed;

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
          <PurchaseItemsTable purchase={purchase} />
        </TabsContent>
        <TabsContent value="payments" className="mt-0 outline-none">
          <PurchasePaymentsSection
            purchaseId={purchase.purchaseId}
            isCompleted={isCompleted}
          />
        </TabsContent>
        <TabsContent value="returns" className="mt-0 outline-none">
          <PurchaseReturnsSection
            purchaseId={purchase.purchaseId}
            isCompleted={isCompleted}
          />
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
