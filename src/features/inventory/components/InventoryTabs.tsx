import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

import { Warehouse, Pill, Scale } from "lucide-react";
import MedicinePage from "../pages/MedicinePage";
import InventoryPage from "../pages/InventoryPage";
import AdjustmentsPage from "../pages/AdjustmentsPage";

export default function InventoryTabs() {
  return (
    <Tabs defaultValue="Inventory" className="w-full" dir="rtl">
      <TabsList className="grid w-full grid-cols-3 max-w-lg bg-muted/40 p-1.5 rounded-xl border border-border/40 mb-6 h-auto">
        <TabsTrigger
          value="Inventory"
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <Warehouse className="w-4 h-4" /> المخزن
        </TabsTrigger>
        <TabsTrigger
          value="Medicines"
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <Pill className="w-4 h-4" /> الاصناف
        </TabsTrigger>
        <TabsTrigger
          value="Adjustments"
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <Scale className="w-4 h-4" /> التسويات
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="Inventory"
        className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
      >
        <InventoryPage />
      </TabsContent>

      <TabsContent
        value="Medicines"
        className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
      >
        <MedicinePage />
      </TabsContent>

      <TabsContent
        value="Adjustments"
        className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
      >
        <AdjustmentsPage />
      </TabsContent>
    </Tabs>
  );
}
