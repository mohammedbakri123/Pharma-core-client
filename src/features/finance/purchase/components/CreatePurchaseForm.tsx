import { CreatePurchaseRequest } from "@/types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { FileText, Hash, Loader2, Truck } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

interface CreatePurchaseFormProps {
  onSubmit: (data: CreatePurchaseRequest) => Promise<void>;
}

export default function CreatePurchaseForm({
  onSubmit,
}: CreatePurchaseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreatePurchaseRequest>();

  const handleFormSubmit: SubmitHandler<CreatePurchaseRequest> = async (
    data,
  ) => {
    await onSubmit({
      ...data,
      supplierId: Number.isNaN(data.supplierId) ? undefined : data.supplierId,
      invoiceNumber: data.invoiceNumber?.trim() || undefined,
      note: data.note?.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="space-y-2">
        <Label htmlFor="supplierId">رقم المورد</Label>
        <div className="relative">
          <Input
            id="supplierId"
            type="number"
            placeholder="معرف المورد (اختياري)"
            className="pr-10 text-right bg-background"
            {...register("supplierId", { valueAsNumber: true })}
          />
          <Truck className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
        <div className="relative">
          <Input
            id="invoiceNumber"
            placeholder="رقم فاتورة المورد (اختياري)"
            className="pr-10 text-right bg-background"
            {...register("invoiceNumber")}
          />
          <Hash className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">ملاحظة</Label>
        <div className="relative">
          <textarea
            id="note"
            placeholder="ملاحظة (اختياري)"
            className="pr-10 text-right bg-background min-h-24 flex w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("note")}
          />
          <FileText className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        إنشاء فاتورة مشتريات
      </Button>
    </form>
  );
}
