import { CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function CustomersHeader() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchInput.trim()) {
        params.set("search", searchInput);
        params.set("page", "1");
      } else {
        params.delete("search");
      }

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
              placeholder="ابحث عن عميل..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pr-9 text-right bg-background focus-visible:ring-primary/30"
            />
          </div>
        </div>

        <div className="order-1 sm:order-2">
          <CardTitle className="text-lg flex items-center gap-2 justify-end">
            <Users className="w-5 h-5 text-primary" />
            إدارة العملاء
          </CardTitle>

          <CardDescription className="text-right">
            إدارة العملاء المسجلين في النظام.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
