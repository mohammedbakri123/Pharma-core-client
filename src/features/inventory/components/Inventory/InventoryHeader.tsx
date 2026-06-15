import { Input } from "@/ui/input";
import { Pill, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CardDescription, CardHeader, CardTitle } from "@/ui/card";
import Filter from "@/ui/filter";

export default function InventoryHeader() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);

  // Sync input when URL changes (back/forward navigation)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchInput.trim()) {
        params.set("search", searchInput);
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      // Avoid unnecessary URL updates
      if (params.toString() !== searchParams.toString()) {
        setSearchParams(params);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  return (
    <CardHeader className="text-right border-b border-border/40 bg-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="order-2 sm:order-1 flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث في المخزن..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pr-9 text-right bg-background focus-visible:ring-primary/30"
            />
          </div>
          <Filter
            filterField="expiringDays"
            options={[
              { value: "all", label: "تاريخ الانتهاء" },
              { value: "30", label: "30 يوم" },
              { value: "60", label: "60 يوم" },
              { value: "90", label: "90 يوم" },
            ]}
          />
          <Filter
            filterField="lowStock"
            options={[
              { value: "all", label: "المخزون" },
              { value: "10", label: "أقل من 10" },
              { value: "30", label: "أقل من 30" },
              { value: "50", label: "أقل من 50" },
              { value: "100", label: "أقل من 100" },
            ]}
          />
        </div>

        <div className="order-1 sm:order-2">
          <CardTitle className="text-lg flex items-center gap-2 justify-end">
            <Pill className="w-5 h-5 text-primary" />
            إدارة المخزون
          </CardTitle>

          <CardDescription className="text-right">
            إدارة المخزون في النظام.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
