import {
  useCustomerDebt,
  useCustomerUnpaidSales,
} from "../../../hooks/useCustomers";
import { formatCurrency } from "@/utils/formatters";
import { Spinner } from "@/ui/spinner";
import { DollarSign, Receipt, Percent, Undo2, Ban } from "lucide-react";
import StatCard from "./StatCard";
import UnpaidSalesTable from "./UnpaidSalesTable";

interface CustomerOverviewProps {
  customerId: number;
}

export default function CustomerOverview({
  customerId,
}: CustomerOverviewProps) {
  const {
    data: debtData,
    isLoading: isLoadingDebt,
    isError: isErrorDebt,
  } = useCustomerDebt(customerId);
  const {
    data: unpaidSalesData,
    isLoading: isLoadingUnpaid,
    isError: isErrorUnpaid,
  } = useCustomerUnpaidSales(customerId);

  if (isLoadingDebt || isLoadingUnpaid) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">جاري تحميل نظرة عامة...</p>
      </div>
    );
  }

  if (isErrorDebt || isErrorUnpaid || !debtData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive gap-2">
        <Ban className="w-8 h-8" />
        <p className="font-semibold text-sm">
          فشل تحميل البيانات المالية للعميل.
        </p>
      </div>
    );
  }

  const unpaidSales = unpaidSalesData?.unpaidSales || [];

  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="الرصيد المتبقي (الديون)"
          value={`${formatCurrency(debtData.netBalance)} ر.س`}
          icon={<DollarSign className="w-5 h-5" />}
          iconClassName={debtData.netBalance > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}
          valueClassName={debtData.netBalance > 0 ? "text-destructive" : "text-success"}
        />
        <StatCard
          label="إجمالي المشتريات"
          value={`${formatCurrency(debtData.totalSales)} ر.س`}
          icon={<Receipt className="w-5 h-5" />}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          label="إجمالي المدفوعات"
          value={`${formatCurrency(debtData.totalPaid)} ر.س`}
          icon={<Percent className="w-5 h-5" />}
          iconClassName="bg-success/10 text-success"
          valueClassName="text-success"
        />
        <StatCard
          label="إجمالي المرتجعات"
          value={`${formatCurrency(debtData.totalReturns)} / ${debtData.totalReturns > 0 ? "ر.س" : "0"}`}
          icon={<Undo2 className="w-5 h-5" />}
          iconClassName="bg-accent/10 text-accent-foreground"
          valueClassName="text-accent-foreground"
        />
      </div>

      <UnpaidSalesTable unpaidSales={unpaidSales} customerId={customerId} />
    </div>
  );
}
