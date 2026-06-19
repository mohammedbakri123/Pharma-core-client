
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Users, Truck } from "lucide-react";
import CustomersPage from "./pages/CustomersPage";
import SuppliersPage from "./pages/SuppliersPage";

export default function People() {
  return (
    <div className="space-y-6" dir="rtl">
      <Tabs defaultValue="Customers" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 max-w-sm bg-muted/40 p-1.5 rounded-xl border border-border/40 mb-6 h-auto">
          <TabsTrigger
            value="Customers"
            className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <Users className="w-4 h-4" /> العملاء
          </TabsTrigger>
          <TabsTrigger
            value="Suppliers"
            className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <Truck className="w-4 h-4" /> الموردين
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="Customers"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <CustomersPage />
        </TabsContent>

        <TabsContent
          value="Suppliers"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <SuppliersPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
