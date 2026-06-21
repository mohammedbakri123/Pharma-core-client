import React, { useState } from "react";
import { usePayCustomerDebt } from "../../../hooks/useCustomers";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { PaymentMethod } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/ui/spinner";

interface PayDebtFormProps {
  customerId: number;
  maxAmount: number;
  onSuccess?: () => void;
}

export default function PayDebtForm({ customerId, maxAmount, onSuccess }: PayDebtFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("1"); // Cash default
  const [description, setDescription] = useState<string>("");
  const { toast } = useToast();
  const { mutateAsync: payDebt, isPending } = usePayCustomerDebt(customerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: "خطأ في الإدخال",
        description: "يرجى إدخال مبلغ صحيح أكبر من الصفر.",
      });
      return;
    }

    try {
      await payDebt({
        amount: numAmount,
        method: Number(method) as PaymentMethod,
        description: description || undefined,
      });
      toast({
        title: "تم تسديد الدين",
        description: `تم سداد مبلغ ${numAmount} ريال بنجاح.`,
        variant: "success",
      });
      setAmount("");
      setDescription("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "فشل السداد",
        description: err instanceof Error ? err.message : "حدث خطأ غير متوقع.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-4 bg-muted/20 border-border/40">
      <h3 className="font-semibold text-foreground text-sm">تسديد الديون للعميل</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="amount" className="text-xs">المبلغ المسترد (ريال)</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`أقصى مبلغ: ${maxAmount}`}
              className="h-9 pr-3 text-xs pl-16 text-right"
              required
            />
            {maxAmount > 0 && (
              <button
                type="button"
                onClick={() => setAmount(maxAmount.toString())}
                className="absolute left-2 top-1.5 px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors"
              >
                كامل الدين
              </button>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="method" className="text-xs">طريقة الدفع</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger id="method" className="h-9 text-xs">
              <SelectValue placeholder="اختر طريقة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">نقدي (Cash)</SelectItem>
              <SelectItem value="2">شبكة (Card)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs">ملاحظات / وصف</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ملاحظات السداد (اختياري)"
            className="h-9 text-xs"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || maxAmount <= 0} size="sm" className="h-9 text-xs font-semibold px-6 cursor-pointer">
          {isPending ? <Spinner size="sm" className="ml-1" /> : null}
          تسجيل الدفعة
        </Button>
      </div>
    </form>
  );
}
