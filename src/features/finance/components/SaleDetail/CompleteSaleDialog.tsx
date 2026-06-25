import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import {
  Banknote,
  User,
  ShoppingCart,
  BadgePercent,
  FileText,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useCompleteSale, useGetSale } from "../../hooks/useSales";
import { useToast } from "@/hooks/use-toast";

interface CompleteSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: number;
  onSuccess?: () => void;
}

export default function CompleteSaleDialog({
  open,
  onOpenChange,
  saleId,
  onSuccess,
}: CompleteSaleDialogProps) {
  const { toast } = useToast();
  const { data: sale } = useGetSale(saleId);

  const { mutate: completeMutation, isPending } = useCompleteSale(saleId);

  const handleSubmit = () => {
    completeMutation(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
        toast({
          title: "تم إتمام الفاتورة بنجاح",
          description: "تم إتمام الفاتورة بنجاح.",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "فشل إتمام الفاتورة",
          description: "حدث خطأ أثناء إتمام الفاتورة.",
          variant: "destructive",
        });
      },
    });
  };

  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            إتمام الفاتورة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {sale.customerName && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                العميل
              </span>
              <span className="text-sm font-medium">
                {sale.customerName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="w-4 h-4" />
              عدد الأصناف
            </span>
            <span className="text-sm font-medium">
              {sale.items?.length ?? 0}
            </span>
          </div>

          {sale.discount > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <BadgePercent className="w-4 h-4" />
                الخصم
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(sale.discount)} ريال
              </span>
            </div>
          )}

          {sale.note && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                ملاحظة
              </span>
              <span className="text-sm font-medium">{sale.note}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              تاريخ الإنشاء
            </span>
            <span className="text-sm font-medium">
              {formatDate(sale.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">
              الإجمالي
            </span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(sale.totalAmount)} ريال
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "جاري الإتمام..." : "إتمام الفاتورة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
