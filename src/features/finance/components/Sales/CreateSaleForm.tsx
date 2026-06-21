import { CreateSaleRequest } from "@/types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Loader2, User, FileText, Percent } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

interface CreateSaleFormProps {
  onSubmit: (data: CreateSaleRequest) => Promise<void>;
}

export default function CreateSaleForm({ onSubmit }: CreateSaleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSaleRequest>();

  const handleFormSubmit: SubmitHandler<CreateSaleRequest> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="space-y-2">
        <Label htmlFor="customerId">رقم العميل</Label>
        <div className="relative">
          <Input
            id="customerId"
            type="number"
            placeholder="معرف العميل (اختياري)"
            className="pr-10 text-right bg-background"
            {...register("customerId", { valueAsNumber: true })}
          />
          <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount">الخصم</Label>
        <div className="relative">
          <Input
            id="discount"
            type="number"
            step="0.01"
            placeholder="قيمة الخصم (اختياري)"
            className="pr-10 text-right bg-background"
            {...register("discount", { valueAsNumber: true })}
          />
          <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">ملاحظة</Label>
        <div className="relative">
          <textarea
            id="note"
            placeholder="ملاحظة (اختياري)"
            className="pr-10 text-right bg-background min-h-24 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("note")}
          />
          <FileText className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        إنشاء فاتورة مبيعات
      </Button>
    </form>
  );
}
