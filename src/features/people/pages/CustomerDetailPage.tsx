import { useParams, useNavigate, Outlet } from "react-router-dom";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { useGetCustomer } from "../hooks/useCustomers";
import { Ban } from "lucide-react";
import { Spinner } from "@/ui/spinner";
import CustomerDetailHeader from "../components/CustomerDetails/CustomerDetailHeader";
import TabNav from "@/ui/TabNav";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useGetCustomer(customerId);

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
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/people")}
            >
              العودة إلى العملاء
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tabs = [
    { to: `/people/customer/${id}/overview`, label: "نظرة عامة والمالية" },
    { to: `/people/customer/${id}/sales`, label: "سجل الفواتير" },
    { to: `/people/customer/${id}/statement`, label: "كشف الحساب (الدفتر)" },
  ];

  return (
    <Card className="overflow-hidden dir-rtl">
      <CustomerDetailHeader
        customer={customer}
        onBack={() => navigate("/people")}
      />

      <TabNav tabs={tabs} variant="underline">
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </TabNav>
    </Card>
  );
}
