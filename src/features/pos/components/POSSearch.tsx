import { Search, ScanBarcode } from "lucide-react";

interface POSSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function POSSearch({ searchQuery, setSearchQuery }: POSSearchProps) {
  return (
    <div className="group relative flex items-center gap-3">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 text-muted-foreground/60 transition-colors duration-300 group-focus-within:text-primary" />
        </div>
        <input
          placeholder="ابحث عن منتج بالاسم أو الباركود..."
          className="h-12 w-full rounded-2xl border border-border/60 bg-card/80 pr-12 text-base backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary/40 focus:bg-card focus:shadow-[0_0_0_3px_hsl(170_75%_41%/0.12)] focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          dir="rtl"
        />
      </div>

      <button
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_0_3px_hsl(170_75%_41%/0.12)] active:scale-95"
        title="مسح الباركود"
      >
        <ScanBarcode className="h-5 w-5 animate-pulse [animation-duration:4s]" />
      </button>
    </div>
  );
}
