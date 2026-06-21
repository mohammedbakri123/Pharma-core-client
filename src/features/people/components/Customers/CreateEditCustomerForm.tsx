import type { CustomerDto, CreateCustomerRequest, UpdateCustomerRequest } from "@/types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { User, Phone, MapPin, FileText } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

interface CreateEditCustomerFormProps {
  customerToEdit?: CustomerDto;
  onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>;
}

export default function CreateEditCustomerForm({
  customerToEdit,
  onSubmit,
}: CreateEditCustomerFormProps) {
  const isEditMode = !!customerToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerRequest | UpdateCustomerRequest>({
    defaultValues: {
      name: customerToEdit?.name ?? "",
      phoneNumber: customerToEdit?.phoneNumber ?? "",
      address: customerToEdit?.address ?? "",
      note: customerToEdit?.note ?? "",
    },
  });

  const handleFormSubmit: SubmitHandler<CreateCustomerRequest | UpdateCustomerRequest> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="space-y-2">
        <Label htmlFor="name">اسم العميل</Label>

        <div className="relative">
          <Input
            id="name"
            placeholder="اسم العميل"
            className="pr-10 text-right bg-background"
            {...register("name", {
              required: "اسم العميل مطلوب",
            })}
          />

          <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">رقم الهاتف</Label>

        <div className="relative">
          <Input
            id="phoneNumber"
            placeholder="رقم الهاتف"
            className="pr-10 text-right bg-background"
            {...register("phoneNumber")}
          />

          <Phone className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">العنوان</Label>

        <div className="relative">
          <Input
            id="address"
            placeholder="العنوان"
            className="pr-10 text-right bg-background"
            {...register("address")}
          />

          <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">ملاحظة</Label>

        <div className="relative">
          <Input
            id="note"
            placeholder="ملاحظة (اختياري)"
            className="pr-10 text-right bg-background"
            {...register("note")}
          />

          <FileText className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isEditMode ? "حفظ التعديلات" : "إضافة عميل"}
      </Button>
    </form>
  );
}
