import { Input } from "@/ui/input";
import { Pill, Search } from "lucide-react";
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/ui/card";
import FilterSelect from "@/ui/filter-select";
import { useDebouncedSearchParams } from "@/hooks/use-debounced-search-params";

export default function InventoryHeader() {
  const { searchInput, setSearchInput } = useDebouncedSearchParams();

  return (
    <CardHeader className="text-right border-b border-border/40 bg-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="order-2 sm:order-1 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-48 lg:w-60">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث في المخزن..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-9 text-right bg-background focus-visible:ring-primary/30"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FilterSelect
                filterField="expiringDays"
                placeholder="تاريخ الانتهاء"
                className="flex-1 sm:w-36 bg-background"
                options={[
                  { value: "all", label: "الكل" },
                  { value: "30", label: "30 يوم" },
                  { value: "60", label: "60 يوم" },
                  { value: "90", label: "90 يوم" },
                ]}
              />
              <FilterSelect
                filterField="lowStock"
                placeholder="المخزون"
                className="flex-1 sm:w-36 bg-background"
                options={[
                  { value: "all", label: "الكل" },
                  { value: "10", label: "أقل من 10" },
                  { value: "30", label: "أقل من 30" },
                  { value: "50", label: "أقل من 50" },
                  { value: "100", label: "أقل من 100" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="order-1 sm:order-2 shrink-0">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 justify-end">
            <Pill className="w-5 h-5 text-primary" />
            إدارة المخزون
          </CardTitle>

          <CardDescription className="text-right text-xs sm:text-sm">
            إدارة المخزون في النظام.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
