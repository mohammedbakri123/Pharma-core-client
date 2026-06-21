import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { ScrollArea } from "@/ui/scroll-area";
import { useGetCustomer } from "../../../hooks/useCustomers";
import type { CustomerDto } from "@/types";
import { Phone, MapPin, Calendar, FileText, UserCircle2, X } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import CustomerOverview from "./CustomerOverview";
import CustomerSales from "./CustomerSales";
import CustomerStatement from "./CustomerStatement";
import { Spinner } from "@/ui/spinner";

interface CustomerDetailsDialogProps {
  customer: CustomerDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  const { data: latestCustomer, isLoading, isError } = useGetCustomer(customer.customerId);

  const displayCustomer = latestCustomer || customer;

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl border border-border shadow-2xl bg-background dir-rtl">
        {/* Custom Header Bar with Profile info */}
        <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/60">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md border-2 border-background select-none">
                {getInitials(displayCustomer.name)}
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-foreground">
                  {displayCustomer.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  رقم العميل: #{displayCustomer.customerId}
                </DialogDescription>
              </div>
            </div>

            {/* Quick Contact & Date info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 text-xs text-muted-foreground w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-border/50">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{displayCustomer.phoneNumber || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[150px]" title={displayCustomer.address || ""}>
                  {displayCustomer.address || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>عضو منذ: {formatDate(displayCustomer.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Customer Note if exists */}
          {displayCustomer.note && (
            <div className="mt-4 p-3 bg-background/50 border border-border/40 rounded-lg flex items-start gap-2 text-xs text-muted-foreground">
              <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed">{displayCustomer.note}</p>
            </div>
          )}
        </div>

        {/* Tabs area */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">جاري تحميل ملف العميل...</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 border-b border-border/40 bg-muted/5">
              <TabsList className="bg-transparent border-b border-transparent w-full justify-start gap-6 p-0 h-12 rounded-none">
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

            <ScrollArea className="flex-1">
              <div className="p-6">
                <TabsContent value="overview" className="mt-0 outline-none">
                  <CustomerOverview customerId={displayCustomer.customerId} />
                </TabsContent>
                <TabsContent value="sales" className="mt-0 outline-none">
                  <CustomerSales customerId={displayCustomer.customerId} />
                </TabsContent>
                <TabsContent value="statement" className="mt-0 outline-none">
                  <CustomerStatement customerId={displayCustomer.customerId} />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
