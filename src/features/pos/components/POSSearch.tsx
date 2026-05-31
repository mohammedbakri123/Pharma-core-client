import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search, ScanBarcode } from "lucide-react";

export default function POSSearch({ searchQuery, setSearchQuery }: any) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="البحث عن منتجات..."
          className="pr-10 h-11 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Button variant="outline" size="icon" className="h-11 w-11 shrink-0">
        <ScanBarcode className="w-5 h-5" />
      </Button>
    </div>
  );
}
