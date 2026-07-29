import { useState } from "react";
import { useCustomerStatement } from "../../../hooks/useCustomers";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Button } from "@/ui/button";
import { Ban } from "lucide-react";
import { DataTable } from "@/ui/data-table";
import type { Column } from "@/ui/data-table";
import type { StatementEntryDto } from "@/types";
import StatementTypeBadge from "./StatementTypeBadge";
import StatementDateFilter from "./StatementDateFilter";
import BalanceSummaryCards from "./BalanceSummaryCards";

interface CustomerStatementProps {
  customerId: number;
}

export default function CustomerStatement({ customerId }: CustomerStatementProps) {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data, isLoading, isError, refetch } = useCustomerStatement(
    customerId,
    fromDate || undefined,
    toDate || undefined
  );

  const statement = data;
  const entries = statement?.entries.reverse() || [];
  const openingBalance = statement?.openingBalance ?? 0;
  const closingBalance = statement?.closingBalance ?? 0;

  const columns: Column<StatementEntryDto>[] = [
    {
      key: "date",
      header: "التاريخ",
      render: (e) => formatDate(e.date),
    },
    {
      key: "type",
      header: "نوع الحركة",
      render: (e) => <StatementTypeBadge type={e.type} />,
    },
    {
      key: "referenceId",
      header: "رقم المرجع",
      render: (e) => <span className="font-mono text-muted-foreground">#{e.referenceId}</span>,
    },
    {
      key: "description",
      header: "البيان / الوصف",
      render: (e) => <span className="text-muted-foreground">{e.description || "-"}</span>,
    },
    {
      key: "debit",
      header: "مدين (+)",
      render: (e) => e.debit > 0 ? (
        <span className="text-destructive font-semibold">
          +{formatCurrency(e.debit)} ر.س
        </span>
      ) : "-",
    },
    {
      key: "credit",
      header: "دائن (-)",
      render: (e) => e.credit > 0 ? (
        <span className="text-emerald-600 font-semibold">
          -{formatCurrency(e.credit)} ر.س
        </span>
      ) : "-",
    },
    {
      key: "runningBalance",
      header: "الرصيد الجاري",
      render: (e) => (
        <span className={`font-bold ${e.runningBalance > 0 ? "text-destructive" : "text-emerald-600"}`}>
          {formatCurrency(e.runningBalance)} ر.س
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive gap-2">
        <Ban className="w-8 h-8" />
        <p className="font-semibold text-sm">فشل تحميل كشف الحساب للعميل.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <StatementDateFilter
        fromDate={fromDate}
        toDate={toDate}
        isLoading={isLoading}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onClear={() => { setFromDate(""); setToDate(""); }}
        onRefresh={() => refetch()}
      />

      <BalanceSummaryCards
        openingBalance={openingBalance}
        closingBalance={closingBalance}
      />

      <DataTable<StatementEntryDto>
        columns={columns}
        data={entries}
        keyExtractor={(e) => `${e.date || ""}-${e.type}-${e.referenceId}-${e.runningBalance}`}
        isLoading={isLoading}
        emptyMessage="لا توجد حركات مسجلة للعميل خلال هذه الفترة."
      />
    </div>
  );
}
