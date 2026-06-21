import { CardContent } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import CustomerOverview from "./overview/CustomerOverview";
import CustomerSales from "./sales/CustomerSales";
import CustomerStatement from "./statement/CustomerStatement";

interface CustomerDetailTabsProps {
  customerId: number;
}

export default function CustomerDetailTabs({ customerId }: CustomerDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="px-6 border-b border-border/40 bg-muted/5">
        <TabsList className="bg-transparent border-b border-transparent w-full justify-end gap-6 p-0 h-12 rounded-none">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            نظرة عامة والمالية
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            سجل الفواتير
          </TabsTrigger>
          <TabsTrigger
            value="statement"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-bold shadow-none cursor-pointer"
          >
            كشف الحساب (الدفتر)
          </TabsTrigger>
        </TabsList>
      </div>

      <CardContent className="p-6">
        <TabsContent value="overview" className="mt-0 outline-none">
          <CustomerOverview customerId={customerId} />
        </TabsContent>
        <TabsContent value="sales" className="mt-0 outline-none">
          <CustomerSales customerId={customerId} />
        </TabsContent>
        <TabsContent value="statement" className="mt-0 outline-none">
          <CustomerStatement customerId={customerId} />
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
