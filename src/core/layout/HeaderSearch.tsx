import { useHeaderSearch } from "@/hooks/use-header-search";
import { Input } from "@/ui/input";
import { cn } from "@/utils/utils";
import {
  ArrowUpLeft,
  FileText,
  Loader2,
  Pill,
  Search,
  Truck,
  User,
} from "lucide-react";

const resultTypeConfig = {
  medicine: {
    icon: Pill,
    label: "دواء",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300",
  },
  customer: {
    icon: User,
    label: "عميل",
    className: "bg-sky-50 text-sky-700 dark:bg-sky-900/25 dark:text-sky-300",
  },
  supplier: {
    icon: Truck,
    label: "مورد",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/25 dark:text-amber-300",
  },
  shortcut: {
    icon: FileText,
    label: "انتقال",
    className: "bg-muted text-muted-foreground",
  },
};

export default function HeaderSearch() {
  const {
    goToResult,
    handleSearchSubmit,
    isSearchOpen,
    isSearching,
    results,
    searchInput,
    searchRef,
    setIsSearchOpen,
    setSearchInput,
    trimmedSearch,
  } = useHeaderSearch();

  return (
    <div ref={searchRef} className="relative flex-1 md:flex-none max-w-md">
      <form onSubmit={handleSearchSubmit}>
        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="ابحث عن دواء، عميل، مورد أو اختصار..."
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsSearchOpen(false);
            }
          }}
          className="pr-9 bg-background border-input focus-visible:ring-primary/20 w-full"
          aria-label="البحث العام"
          aria-expanded={isSearchOpen}
        />
      </form>

      {isSearchOpen && trimmedSearch.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-[min(28rem,calc(100vw-1.5rem))] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg z-50">
          {trimmedSearch.length < 2 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-right">
              اكتب حرفين على الأقل للبحث
            </div>
          ) : isSearching && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري البحث...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto py-1">
              {results.map((result) => {
                const config = resultTypeConfig[result.type];
                const Icon = config.icon;

                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => goToResult(result.path)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-right transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                        config.className,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {result.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {config.label} · {result.description}
                      </span>
                    </span>
                    <ArrowUpLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-muted-foreground">
              لا توجد نتائج مطابقة
            </div>
          )}
        </div>
      )}
    </div>
  );
}
