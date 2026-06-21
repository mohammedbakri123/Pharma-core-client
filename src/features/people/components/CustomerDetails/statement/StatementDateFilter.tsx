import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RefreshCw } from "lucide-react";

interface StatementDateFilterProps {
  fromDate: string;
  toDate: string;
  isLoading: boolean;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onClear: () => void;
  onRefresh: () => void;
}

export default function StatementDateFilter({
  fromDate,
  toDate,
  isLoading,
  onFromDateChange,
  onToDateChange,
  onClear,
  onRefresh,
}: StatementDateFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-end p-4 border border-border/40 bg-muted/10 rounded-xl">
      <div className="w-full md:w-auto space-y-1">
        <Label className="text-xs">من تاريخ</Label>
        <div className="relative">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
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
            onChange={(e) => onToDateChange(e.target.value)}
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
            onClick={onClear}
          >
            تصفية
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="h-9 text-xs font-semibold px-4 flex items-center gap-1.5 cursor-pointer"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          تحديث كشف الحساب
        </Button>
      </div>
    </div>
  );
}
