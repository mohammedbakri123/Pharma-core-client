import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { CardContent } from "@/ui/card";
import { Column, DataTable } from "@/ui/data-table";
import { Pagination } from "@/ui/pagination";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  PaymentMethod,
  PaymentOverviewItem,
  PaymentReferenceType,
  PaymentsQueryParams,
  PaymentType,
  methodLabels,
} from "@/types";
import { Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetFilters,
  usePaymentsOverview,
} from "../../common/hooks/usePayments";

const typeLabels: Record<PaymentType, string> = {
  [PaymentType.Incoming]: "قبض",
  [PaymentType.Outgoing]: "صرف",
};

const referenceLabels: Record<string, string> = {
  sale: "بيع",
  purchase: "شراء",
  expense: "مصروف",
  salesreturn: "مرتجع بيع",
  purchasereturn: "مرتجع شراء",
};

function normalizeReferenceType(referenceType: PaymentReferenceType | string) {
  return String(referenceType).toLowerCase().replaceAll("_", "");
}

function getReferenceRoute(payment: PaymentOverviewItem) {
  const type = normalizeReferenceType(payment.referenceType);

  if (type === "sale") return `/finance/sales/${payment.referenceId}`;
  if (type === "purchase") return `/finance/purchases/${payment.referenceId}`;
  if (type === "salesreturn" && payment.parentReferenceId) {
    return `/finance/sales/${payment.parentReferenceId}/returns/${payment.referenceId}`;
  }
  if (type === "purchasereturn" && payment.parentReferenceId) {
    return `/finance/purchases/${payment.parentReferenceId}/returns/${payment.referenceId}`;
  }

  return null;
}

function getReferenceTypeLabel(referenceType: PaymentReferenceType | string) {
  return referenceLabels[normalizeReferenceType(referenceType)] ?? "مصدر";
}

export default function PaymentsTable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = usePaymentsOverview(
    useGetFilters(searchParams),
  );

  const columns: Column<PaymentOverviewItem>[] = [
    {
      key: "paymentId",
      header: "#",
      render: (payment) => (
        <span className="font-semibold text-foreground">
          #{payment.paymentId}
        </span>
      ),
    },
    {
      key: "type",
      header: "الحركة",
      render: (payment) => (
        <Badge
          variant="outline"
          className={
            payment.type === PaymentType.Incoming
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
              : "border-rose-500/30 bg-rose-500/10 text-rose-700"
          }
        >
          {typeLabels[payment.type] ?? "-"}
        </Badge>
      ),
    },
    {
      key: "reference",
      header: "المصدر",
      render: (payment) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-start">
            <Badge variant="secondary">
              {getReferenceTypeLabel(payment.referenceType)}
            </Badge>
            <span className="font-medium text-foreground">
              {payment.referenceLabel}
            </span>
          </div>
          {payment.partyName && (
            <p className="text-xs text-muted-foreground">{payment.partyName}</p>
          )}
        </div>
      ),
    },
    {
      key: "method",
      header: "الطريقة",
      render: (payment) => (
        <span className="text-muted-foreground">
          {payment.method ? methodLabels[payment.method] : "-"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "المبلغ",
      render: (payment) => (
        <span className="font-semibold text-foreground" dir="ltr">
          {formatCurrency(payment.amount)} ريال
        </span>
      ),
    },
    {
      key: "userName",
      header: "المستخدم",
      render: (payment) => (
        <span className="text-muted-foreground">
          {payment.userName || (payment.userId ? `#${payment.userId}` : "-")}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (payment) => (
        <span className="text-muted-foreground text-sm" dir="ltr">
          {formatDate(payment.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (payment) => {
        const route = getReferenceRoute(payment);

        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            disabled={!route}
            onClick={() => {
              if (route) navigate(route);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<PaymentOverviewItem>
        columns={columns}
        data={data?.payments || []}
        keyExtractor={(payment) => payment.paymentId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على حركات مدفوعات ضمن الفلاتر المحددة."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      <Pagination
        limit={data?.pagination.limit}
        total={data?.pagination.total}
      />
    </CardContent>
  );
}
