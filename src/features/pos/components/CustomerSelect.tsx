import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Spinner } from "@/ui/spinner";
import { Search, User } from "lucide-react";
import { getCustomers } from "@features/people/api/customers";
import { useDebounce } from "@/hooks/use-debounce";

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

  useEffect(() => {
    if (!open) {
      setSearch("");
      setCustomers([]);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getCustomers({ search: debouncedSearch || undefined, limit: 20 })
      .then((res) => setCustomers(res.data.customers))
      .finally(() => setLoading(false));
  }, [debouncedSearch, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>اختيار عميل</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن عميل..."
            className="pr-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-auto space-y-1">
          <button
            onClick={() => {
              onSelect({ id: 0, name: "عميل نقدي" });
              onOpenChange(false);
            }}
            className="w-full text-right px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            <span>عميل نقدي</span>
          </button>

          {loading ? (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          ) : (
            customers.map((c) => (
              <button
                key={c.customerId}
                onClick={() => {
                  onSelect({ id: c.customerId, name: c.name });
                  onOpenChange(false);
                }}
                className="w-full text-right px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <span className="font-medium">{c.name}</span>
                {c.phoneNumber && (
                  <span className="text-muted-foreground text-xs mr-2">
                    {c.phoneNumber}
                  </span>
                )}
              </button>
            ))
          )}

          {!loading && customers.length === 0 && search && (
            <p className="text-center text-sm text-muted-foreground py-4">
              لا توجد نتائج
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
