import {
  CreateExpenseRequest,
  ExpenseDto,
  UpdateExpenseRequest,
} from "@/types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Loader2, DollarSign, FileText } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

interface CreateExpenseFormProps {
  expenseToEdit?: ExpenseDto;
  onSubmit: (
    data: CreateExpenseRequest | UpdateExpenseRequest,
  ) => Promise<void>;
}

export default function CreateExpenseForm({
  expenseToEdit,
  onSubmit,
}: CreateExpenseFormProps) {
  const isEditMode = !!expenseToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseRequest>({
    defaultValues: {
      amount: expenseToEdit?.amount ?? undefined,
      description: expenseToEdit?.description ?? "",
    },
  });

  const handleFormSubmit: SubmitHandler<CreateExpenseRequest> = async (
    data,
  ) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="space-y-2">
        <Label htmlFor="amount">المبلغ</Label>

        <div className="relative">
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="مبلغ المصروف"
            className="pr-10 text-right bg-background"
            {...register("amount", {
              required: "المبلغ مطلوب",
              valueAsNumber: true,
              min: { value: 0.01, message: "المبلغ يجب أن يكون أكبر من 0" },
            })}
          />

          <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        {errors.amount && (
          <p className="text-sm text-destructive">
            {errors.amount.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">البيان</Label>

        <div className="relative">
          <textarea
            id="description"
            placeholder="وصف المصروف (اختياري)"
            className="pr-10 text-right bg-background min-h-24 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("description")}
          />

          <FileText className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        {isEditMode ? "حفظ التغييرات" : "إضافة مصروف"}
      </Button>
    </form>
  );
}
