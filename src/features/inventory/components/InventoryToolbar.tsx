import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search, Filter } from "lucide-react";

export default function InventoryToolbar({ searchTerm, setSearchTerm }: any) {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="البحث بالاسم أو SKU..."
          className="pr-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button variant="outline" className="text-muted-foreground">
        <Filter className="w-4 h-4 ml-2" /> تصفية
      </Button>
    </div>
  );
}
