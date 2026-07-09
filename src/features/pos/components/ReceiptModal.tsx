import { Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import type { PosCheckoutResultDto } from "../types/pos";

const methodLabels: Record<string, string> = {
  cash: "نقداً",
  card: "بطاقة",
};

export default function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: PosCheckoutResultDto | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!receipt} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">تم الدفع بنجاح</DialogTitle>
        </DialogHeader>

        {receipt && (
          <div className="space-y-3 text-sm">
            <div className="bg-muted rounded-lg p-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رقم الفاتورة</span>
                <span className="font-medium">#{receipt.saleId}</span>
              </div>
              {receipt.paymentIds.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم الدفعة</span>
                  <span className="font-medium">
                    #{receipt.paymentIds.join(", #")}
                  </span>
                </div>
              )}
              {receipt.customerName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العميل</span>
                  <span className="font-medium">{receipt.customerName}</span>
                </div>
              )}
              {receipt.userName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">بواسطة</span>
                  <span className="font-medium">{receipt.userName}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              {receipt.items.map((item) => (
                <div key={item.medicineId} className="flex justify-between">
                  <span className="text-muted-foreground truncate ml-2">
                    {item.medicineName}
                  </span>
                  <span>
                    {item.quantity} × {item.unitPrice.toFixed(2)} ={" "}
                    {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span>{receipt.subtotal.toFixed(2)} ر.س</span>
              </div>
              {receipt.discount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>الخصم</span>
                  <span>-{receipt.discount.toFixed(2)} ر.س</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base">
                <span>الإجمالي</span>
                <span>{receipt.totalAmount.toFixed(2)} ر.س</span>
              </div>

              {receipt.payments.map((p, i) => (
                <div key={i} className="flex justify-between text-muted-foreground">
                  <span>
                    طريقة الدفع {i + 1} - {methodLabels[p.method] ?? p.method}
                  </span>
                  <span>{p.amount.toFixed(2)} ر.س</span>
                </div>
              ))}

              <div className="flex justify-between text-muted-foreground">
                <span>المدفوع</span>
                <span>{receipt.paidAmount.toFixed(2)} ر.س</span>
              </div>
              {receipt.changeAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                  <span>الباقي</span>
                  <span>{receipt.changeAmount.toFixed(2)} ر.س</span>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
