import { useState } from "react";
import { useCustomerStatement } from "../../../hooks/useCustomers";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Ban, RefreshCw } from "lucide-react";
import { DataTable } from "@/ui/data-table";
import StatementTypeBadge from "./StatementTypeBadge";

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
  const entries = statement?.entries || [];
  const openingBalance = statement?.openingBalance ?? 0;
  const closingBalance = statement?.closingBalance ?? 0;

  const columns = [
    {
      key: "date",
      header: "التاريخ",
      render: (e: any) => formatDate(e.date),
    },
    {
      key: "type",
      header: "نوع الحركة",
      render: (e: any) => <StatementTypeBadge type={e.type} />,
    },
    {
      key: "referenceId",
      header: "رقم المرجع",
      render: (e: any) => <span className="font-mono text-muted-foreground">#{e.referenceId}</span>,
    },
    {
      key: "description",
      header: "البيان / الوصف",
      render: (e: any) => <span className="text-muted-foreground">{e.description || "-"}</span>,
    },
    {
      key: "debit",
      header: "مدين (+)",
      render: (e: any) => e.debit > 0 ? (
        <span className="text-destructive font-semibold">
          +{formatCurrency(e.debit)} ر.س
        </span>
      ) : "-",
    },
    {
      key: "credit",
      header: "دائن (-)",
      render: (e: any) => e.credit > 0 ? (
        <span className="text-emerald-600 font-semibold">
          -{formatCurrency(e.credit)} ر.س
        </span>
      ) : "-",
    },
    {
      key: "runningBalance",
      header: "الرصيد الجاري",
      render: (e: any) => (
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
      {/* Date Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-end p-4 border border-border/40 bg-muted/10 rounded-xl">
        <div className="w-full md:w-auto space-y-1">
          <Label className="text-xs">من تاريخ</Label>
          <div className="relative">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
        <div className="w-full md:w-auto space-y-1">
          <Label className="text-xs">إلى تاريخ</Label>
          <div className="relative">
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {(fromDate || toDate) && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-semibold px-4 cursor-pointer"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              تصفية
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="h-9 text-xs font-semibold px-4 flex items-center gap-1.5 cursor-pointer"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            تحديث كشف الحساب
          </Button>
        </div>
      </div>

      {/* Balance Summary Header */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border bg-background/50 flex flex-col justify-center">
          <span className="text-[10px] text-muted-foreground font-semibold">الرصيد الافتتاحي</span>
          <span className={`text-sm font-bold ${openingBalance > 0 ? "text-destructive" : "text-emerald-600"}`}>
            {formatCurrency(openingBalance)} ر.س
          </span>
        </div>
        <div className="p-3 rounded-lg border bg-background/50 flex flex-col justify-center">
          <span className="text-[10px] text-muted-foreground font-semibold">الرصيد الختامي</span>
          <span className={`text-sm font-bold ${closingBalance > 0 ? "text-destructive" : "text-emerald-600"}`}>
            {formatCurrency(closingBalance)} ر.س
          </span>
        </div>
      </div>

      {/* Account Ledger Table */}
      <DataTable
        columns={columns}
        data={entries}
        keyExtractor={(e) => `${e.date || ""}-${e.type}-${e.referenceId}-${e.runningBalance}`}
        isLoading={isLoading}
        emptyMessage="لا توجد حركات مسجلة للعميل خلال هذه الفترة."
      />
    </div>
  );
}
