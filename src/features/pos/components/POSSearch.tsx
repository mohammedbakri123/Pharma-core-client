import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search, ScanBarcode, LayoutGrid, List } from "lucide-react";

export default function POSSearch({
  searchQuery,
  setSearchQuery,
  viewMode,
  onViewModeChange,
}: any) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="البحث عن منتجات..."
          className="pr-10 h-11 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-1">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={() => onViewModeChange("grid")}
        >
          <LayoutGrid className="w-5 h-5" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={() => onViewModeChange("list")}
        >
          <List className="w-5 h-5" />
        </Button>
      </div>

      <Button variant="outline" size="icon" className="h-11 w-11 shrink-0">
        <ScanBarcode className="w-5 h-5" />
      </Button>
    </div>
  );
}
