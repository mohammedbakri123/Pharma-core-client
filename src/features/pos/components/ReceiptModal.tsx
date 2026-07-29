import { Printer, CheckCircle2, Usb } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/ui/dialog";
import type { PosCheckoutResultDto } from "../types/pos";
import { useThermalPrinter, buildBrowserReceiptHtml } from "../hooks/use-thermal-printer";

const methodLabels: Record<string, string> = {
  cash: "نقداً",
  card: "بطاقة",
};

function ReceiptContent({ receipt }: { receipt: PosCheckoutResultDto }) {
  const { state, printOrFallback } = useThermalPrinter();

  const date = new Date(receipt.createdAt);
  const timeStr = date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-4 text-sm animate-in fade-in duration-300 delay-150 [animation-fill-mode:both]">
      <div className="text-center space-y-1">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
        <h3 className="text-base font-bold">تم الدفع بنجاح</h3>
        <p className="text-xs text-muted-foreground/60">{dateStr} - {timeStr}</p>
      </div>

      <div className="rounded-xl border border-border/40 bg-background/50 p-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground/70">رقم الفاتورة</span>
          <span className="font-bold tabular-nums">#{receipt.saleId}</span>
        </div>
        {receipt.customerName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground/70">العميل</span>
            <span className="font-medium">{receipt.customerName}</span>
          </div>
        )}
        {receipt.userName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground/70">بواسطة</span>
            <span className="font-medium">{receipt.userName}</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border/40 bg-background/50">
        <div className="border-b border-border/30 px-3 py-2">
          <span className="text-[11px] font-bold text-muted-foreground/70">الأصناف</span>
        </div>
        <div className="divide-y divide-border/20 px-3 py-2">
          {receipt.items.map((item) => (
            <div key={item.medicineId} className="flex items-center justify-between py-1.5">
              <span className="truncate text-sm font-medium ml-2">
                {item.medicineName}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground/80">
                {item.quantity} × {item.unitPrice.toFixed(2)} ={" "}
                <span className="font-semibold text-foreground">{item.totalPrice.toFixed(2)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-background/50 p-3 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground/70">
          <span>المجموع الفرعي</span>
          <span className="tabular-nums">{receipt.subtotal.toFixed(2)} ر.س</span>
        </div>
        {receipt.discount > 0 && (
          <div className="flex justify-between text-xs text-destructive/80">
            <span>الخصم</span>
            <span className="tabular-nums">-{receipt.discount.toFixed(2)} ر.س</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-1 border-t border-border/30">
          <span>الإجمالي</span>
          <span className="tabular-nums text-primary">{receipt.totalAmount.toFixed(2)} ر.س</span>
        </div>

        <div className="pt-1 space-y-1">
          {receipt.payments.map((p, i) => (
            <div key={i} className="flex justify-between text-xs text-muted-foreground/70">
              <span>{methodLabels[p.method] ?? p.method}</span>
              <span className="tabular-nums">{p.amount.toFixed(2)} ر.س</span>
            </div>
          ))}
          <div className="flex justify-between text-xs">
            <span className="font-medium text-muted-foreground/80">المدفوع</span>
            <span className="tabular-nums font-medium">{receipt.paidAmount.toFixed(2)} ر.س</span>
          </div>
          {receipt.changeAmount > 0 && (
            <div className="flex justify-between text-sm font-bold text-emerald-500">
              <span>الباقي</span>
              <span className="tabular-nums">{receipt.changeAmount.toFixed(2)} ر.س</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => printOrFallback(receipt)}
          disabled={state.connected && !state.device}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
        >
          <Usb className="h-4 w-4" />
          {state.connected ? "طباعة على الفاتورة الحرارية" : "طباعة الفاتورة"}
        </button>

        <button
          onClick={() => {
            const win = window.open("", "_blank", "width=400,height=600");
            if (!win) return;
            win.document.write(buildBrowserReceiptHtml(receipt));
            win.document.close();
            win.focus();
            win.print();
          }}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border/50 text-sm font-medium transition-colors hover:bg-muted/50 active:scale-[0.98]"
        >
          <Printer className="h-4 w-4" />
          طباعة عادية
        </button>
      </div>
    </div>
  );
}

export default function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: PosCheckoutResultDto | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!receipt} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm animate-in zoom-in-95 duration-200">
        {receipt && <ReceiptContent receipt={receipt} />}
      </DialogContent>
    </Dialog>
  );
}
