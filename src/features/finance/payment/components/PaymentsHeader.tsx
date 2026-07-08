import { CardDescription, CardHeader, CardTitle } from "@/ui/card";
import FilterSelect from "@/ui/filter-select";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { ArrowLeftRight, Calendar } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const typeOptions = [
  { value: "all", label: "كل الحركات" },
  { value: "incoming", label: "قبض" },
  { value: "outgoing", label: "صرف" },
];

const methodOptions = [
  { value: "all", label: "كل الطرق" },
  { value: "cash", label: "نقداً" },
  { value: "card", label: "بطاقة" },
];

const referenceOptions = [
  { value: "all", label: "كل المصادر" },
  { value: "sale", label: "المبيعات" },
  { value: "purchase", label: "المشتريات" },
  { value: "expense", label: "المصروفات" },
  { value: "sales_Return", label: "مرتجعات المبيعات" },
  { value: "purchase_Return", label: "مرتجعات المشتريات" },
];

export default function PaymentsHeader() {
  const [searchParams, setSearchParams] = useSearchParams();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  function handleDateChange(field: "from" | "to", value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(field, value);
    } else {
      params.delete(field);
    }
    params.set("page", "1");
    setSearchParams(params);
  }

  return (
    <CardHeader className="text-right border-b border-border/40 bg-card">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="order-2 lg:order-1 flex flex-wrap items-end gap-3 w-full lg:w-auto">
          <FilterSelect
            filterField="type"
            options={typeOptions}
            placeholder="نوع الحركة"
            label="نوع الحركة"
          />

          <FilterSelect
            filterField="method"
            options={methodOptions}
            placeholder="طريقة الدفع"
            label="طريقة الدفع"
          />

          <FilterSelect
            filterField="referenceType"
            options={referenceOptions}
            placeholder="المصدر"
            label="المصدر"
          />

          <fieldset className="space-y-1">
            <Label className="text-xs text-muted-foreground block text-right">
              من تاريخ
            </Label>
            <div className="relative">
              <Input
                type="date"
                value={from}
                onChange={(e) => handleDateChange("from", e.target.value)}
                className="w-40 text-right bg-background [&::-webkit-calendar-picker-indicator]:mr-0"
              />
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </fieldset>

          <fieldset className="space-y-1">
            <Label className="text-xs text-muted-foreground block text-right">
              إلى تاريخ
            </Label>
            <div className="relative">
              <Input
                type="date"
                value={to}
                onChange={(e) => handleDateChange("to", e.target.value)}
                className="w-40 text-right bg-background [&::-webkit-calendar-picker-indicator]:mr-0"
              />
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </fieldset>
        </div>

        <div className="order-1 lg:order-2">
          <CardTitle className="text-lg flex items-center gap-2 justify-end">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
            نظرة عامة على المدفوعات
          </CardTitle>

          <CardDescription className="text-right">
            متابعة إجمالي الدخل والخارج والصافي حسب الفترة المحددة.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
