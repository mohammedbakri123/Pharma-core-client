import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { CreditCard, Banknote } from "lucide-react";

export default function CartSummary({ subtotal, tax, total, cart }: any) {
  return (
    <div className="p-4 bg-muted/50 border-t border-border space-y-3">
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ر.س</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>ضريبة القيمة المضافة (15%)</span>
          <span>{tax.toFixed(2)} ر.س</span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between font-bold text-lg text-foreground">
          <span>الإجمالي</span>
          <span>{total.toFixed(2)} ر.س</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full border-primary/20 text-primary hover:bg-primary/5"
        >
          <CreditCard className="w-4 h-4 ml-2" /> بطاقة
        </Button>

        <Button
          variant="outline"
          className="w-full border-primary/20 text-primary hover:bg-primary/5"
        >
          <Banknote className="w-4 h-4 ml-2" /> نقداً
        </Button>
      </div>

      <Button
        className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/20"
        size="lg"
        disabled={cart.length === 0}
      >
        إتمام الدفع
      </Button>
    </div>
  );
}
