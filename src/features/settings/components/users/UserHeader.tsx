import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";

import { Search, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function UserHeader() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) params.set("search", value);
    else params.delete("search");

    params.set("page", "1");

    setSearchParams(params);
  };

  return (
    <Card>
      <CardHeader className="text-right border-b border-border/40 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="order-2 sm:order-1 flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن مستخدم..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-9 text-right bg-background focus-visible:ring-primary/30"
              />
            </div>
          </div>
          <div className="order-1 sm:order-2">
            <CardTitle className="text-lg flex items-center gap-2 justify-end">
              <Users className="w-5 h-5 text-primary" /> إدارة المستخدمين
            </CardTitle>
            <CardDescription className="text-right">
              إدارة صلاحيات وصول الصيادلة والموظفين للنظام.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
