import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Receipt, Coins, Wallet } from "lucide-react";
import InvoicesHeader from "./components/InvoicesHeader";
import InvoicesTable from "./components/InvoicesTable";
import ExpensesPage from "./pages/ExpensesPage";
import PurchasesPage from "./pages/PurchasesPage";

export default function Invoices() {
  const invoices = [
    {
      id: "INV-2024-001",
      patient: "علي محمد",
      date: "2024-01-20",
      amount: "150.00 ر.س",
      status: "مدفوعة",
    },
    {
      id: "INV-2024-002",
      patient: "أحمد محمود",
      date: "2024-01-21",
      amount: "45.00 ر.س",
      status: "مدفوعة",
    },
    {
      id: "INV-2024-003",
      patient: "سارة خالد",
      date: "2024-01-21",
      amount: "210.20 ر.س",
      status: "مسودة",
    },
    {
      id: "INV-2024-004",
      patient: "محمد حسن",
      date: "2024-01-22",
      amount: "85.00 ر.س",
      status: "مدفوعة",
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <Tabs defaultValue="Sales" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 max-w-lg bg-muted/40 p-1.5 rounded-xl border border-border/40 mb-6 h-auto">
          <TabsTrigger
            value="Expenses"
            className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <Receipt className="w-4 h-4" /> المصروفات
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
        </TabsList>

        <TabsContent
          value="Expenses"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <ExpensesPage />
        </TabsContent>

        <TabsContent
          value="Sales"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <InvoicesHeader />
          <InvoicesTable data={invoices} />
        </TabsContent>

        <TabsContent
          value="Purchases"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none"
        >
          <PurchasesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
