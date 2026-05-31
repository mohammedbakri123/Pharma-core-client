import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { Search } from "lucide-react";

export default function CustomersFilters() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="البحث عن عميل..." className="pr-9" />
          </div>

          <div className="space-y-2 text-right">
            <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
              الحالة
            </h3>

            <div className="flex flex-wrap gap-2 justify-start">
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20"
              >
                الكل
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/20"
              >
                نشط
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/20"
              >
                غير نشط
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/20"
              >
                جديد
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
