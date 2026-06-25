import { CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Calendar, Wallet } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import FilterSelect from "@/ui/filter-select";

const statusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "1", label: "مسودة" },
  { value: "2", label: "مكتملة" },
  { value: "3", label: "ملغية" },
];

export default function PurchasesHeader() {
  const [searchParams, setSearchParams] = useSearchParams();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  function handleFromChange(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("from", value);
    } else {
      params.delete("from");
    }
    params.set("page", "1");
    setSearchParams(params);
  }

  function handleToChange(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("to", value);
    } else {
      params.delete("to");
    }
    params.set("page", "1");
    setSearchParams(params);
  }

  return (
    <CardHeader className="text-right border-b border-border/40 bg-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="order-2 sm:order-1 flex items-center gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap items-end gap-3">
            <FilterSelect
              filterField="status"
              options={statusOptions}
              placeholder="الحالة"
              label="الحالة"
            />

            <fieldset className="space-y-1">
              <Label className="text-xs text-muted-foreground block text-right">
                من تاريخ
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="w-40 text-right bg-background [&::-webkit-calendar-picker-indicator]:mr-0 [&::-webkit-calendar-picker-indicator]:mr-auto"
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
                  onChange={(e) => handleToChange(e.target.value)}
                  className="w-40 text-right bg-background [&::-webkit-calendar-picker-indicator]:mr-0 [&::-webkit-calendar-picker-indicator]:mr-auto"
                />
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </fieldset>
          </div>
        </div>

        <div className="order-1 sm:order-2">
          <CardTitle className="text-lg flex items-center gap-2 justify-end">
            <Wallet className="w-5 h-5 text-primary" />
            إدارة المشتريات
          </CardTitle>

          <CardDescription className="text-right">
            تسجيل وإدارة فواتير المشتريات.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
