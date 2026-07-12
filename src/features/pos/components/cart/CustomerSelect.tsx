import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/dialog";
import { Search, User, Phone } from "lucide-react";
import { getCustomers } from "@features/people/api/customers";
import { useDebounce } from "@/hooks/use-debounce";

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-3 px-3 py-2.5">
      <div className="h-8 w-8 rounded-full bg-muted" />
      <div className="flex-1 space-y-1">
        <div className="h-3.5 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function CustomerSelect({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (customer: { id: number; name: string }) => void;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setCustomers([]);
      setInitialLoad(true);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getCustomers({ search: debouncedSearch || undefined, limit: 20 })
      .then((res) => setCustomers(res.data.customers))
      .finally(() => {
        setLoading(false);
        setInitialLoad(false);
      });
  }, [debouncedSearch, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>اختيار عميل</DialogTitle>
          <DialogDescription>ابحث عن عميل أو تابع كـ "عميل نقدي"</DialogDescription>
        </DialogHeader>

        <div className="group relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
          <input
            placeholder="ابحث عن عميل..."
            className="h-10 w-full rounded-xl border border-border/50 bg-background/50 pr-9 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-background focus:shadow-[0_0_0_2px_hsl(170_75%_41%/0.1)] focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            dir="rtl"
          />
        </div>

        <div className="max-h-64 space-y-1 overflow-auto">
          <button
            onClick={() => {
              onSelect({ id: 0, name: "عميل نقدي" });
              onOpenChange(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.03] px-3 py-2.5 text-right text-sm transition-colors hover:bg-primary/10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-medium">عميل نقدي</span>
              <p className="text-[11px] text-muted-foreground/60">متابعة بدون تحديد عميل</p>
            </div>
          </button>

          <div className="border-t border-border/30 my-2" />

          {loading && initialLoad ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : customers.length > 0 ? (
            customers.map((c) => (
              <button
                key={c.customerId}
                onClick={() => {
                  onSelect({ id: c.customerId, name: c.name });
                  onOpenChange(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {c.name?.charAt(0) ?? "؟"}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{c.name}</span>
                  {c.phoneNumber && (
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                      <Phone className="h-3 w-3" />
                      {c.phoneNumber}
                    </p>
                  )}
                </div>
              </button>
            ))
          ) : !loading && search ? (
            <p className="py-6 text-center text-sm text-muted-foreground/60">لا توجد نتائج</p>
          ) : !loading && !search && !initialLoad ? (
            <p className="py-6 text-center text-sm text-muted-foreground/40">ابدأ بكتابة اسم العميل</p>
          ) : null}

          {loading && !initialLoad && (
            <div className="flex justify-center py-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
