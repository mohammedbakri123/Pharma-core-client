import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { useGetCustomer } from "../hooks/useCustomers";
import { ArrowRight, Phone, MapPin, Calendar, FileText, Ban } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { Spinner } from "@/ui/spinner";
import CustomerOverview from "../components/Customers/CustomerDetails/CustomerOverview";
import CustomerSales from "../components/Customers/CustomerDetails/CustomerSales";
import CustomerStatement from "../components/Customers/CustomerDetails/CustomerStatement";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);

  const { data: customer, isLoading, isError, refetch } = useGetCustomer(customerId);

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">
              جاري تحميل ملف العميل...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !customer) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <Ban className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">فشل تحميل ملف العميل</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate("/people")}>
              العودة إلى العملاء
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden dir-rtl">
      {/* Visual Accent Bar */}
      <div className="h-1.5 bg-linear-to-l from-primary via-primary/60 to-primary/20" />

      {/* Header and Back navigation */}
      <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/people")}
          className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى العملاء
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md border border-primary/20 select-none">
              {getInitials(customer.name)}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-foreground">
                {customer.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                رقم العميل: #{customer.customerId}
              </p>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 text-xs text-muted-foreground w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-border/40">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>{customer.phoneNumber || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="truncate max-w-[200px]" title={customer.address || ""}>
                {customer.address || "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>عضو منذ: {formatDate(customer.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Customer Note if exists */}
        {customer.note && (
          <div className="mt-4 p-3 bg-background/50 border border-border/40 rounded-lg flex items-start gap-2 text-xs text-muted-foreground">
            <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">{customer.note}</p>
          </div>
        )}
      </div>

      {/* Tabs list & content wrapper */}
      <Tabs defaultValue="overview" className="w-full">
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
    </Card>
  );
}
