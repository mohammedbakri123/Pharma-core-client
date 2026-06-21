import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Receipt, Coins, Wallet, ArrowLeftRight } from "lucide-react";
import SalesPage from "./pages/SalesPage";
import ExpensesPage from "./pages/ExpensesPage";
import PurchasesPage from "./pages/PurchasesPage";
import PaymentsPage from "./pages/PaymentsPage";

export default function Finance() {
  return (
    <div className="space-y-6" dir="rtl">
      <Tabs defaultValue="Sales" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-4 max-w-lg bg-muted/40 p-1.5 rounded-xl border border-border/40 mb-6 h-auto">
          <TabsTrigger
            value="Payments"
            className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" /> نظرة عامة
          </TabsTrigger>

          <TabsTrigger
            value="Sales"
            className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <Coins className="w-4 h-4" /> المبيعات
          </TabsTrigger>
          <TabsTrigger
            value="Purchases"
            className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <Wallet className="w-4 h-4" /> المشتريات
          </TabsTrigger>
          <TabsTrigger
            value="Expenses"
            className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <Receipt className="w-4 h-4" /> المصروفات
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="Sales"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <SalesPage />
        </TabsContent>

        <TabsContent
          value="Purchases"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <PurchasesPage />
        </TabsContent>

        <TabsContent
          value="Expenses"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <ExpensesPage />
        </TabsContent>

        <TabsContent
          value="Payments"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <PaymentsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
