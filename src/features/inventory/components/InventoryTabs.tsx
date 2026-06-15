import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

import { Warehouse, Pill, Wallet, WalletCards } from "lucide-react";
import MedicinePage from "../pages/MedicinePage";
import InventoryPage from "../pages/InventoryPage";

export default function SettingsTabs() {
  return (
    <Tabs defaultValue="Inventory" className="w-full" dir="rtl">
      <TabsList className="grid w-full grid-cols-4 max-w-lg bg-muted/40 p-1.5 rounded-xl border border-border/40 mb-6 h-auto">
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
          value="Sales"
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <Wallet className="w-4 h-4" /> المبيعات
        </TabsTrigger>
        <TabsTrigger
          value="Purchase"
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <WalletCards className="w-4 h-4" /> المشتريات
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
        value="Sales"
        className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
      ></TabsContent>
      <TabsContent
        value="Purchase"
        className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
      ></TabsContent>
    </Tabs>
  );
}
