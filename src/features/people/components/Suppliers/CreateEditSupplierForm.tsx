import type { CreateSupplierRequest, SupplierDto, UpdateSupplierRequest } from "@/types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Building2, MapPin, Phone } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

interface CreateEditSupplierFormProps {
  supplierToEdit?: SupplierDto;
  onSubmit: (data: CreateSupplierRequest | UpdateSupplierRequest) => Promise<void>;
}

export default function CreateEditSupplierForm({
  supplierToEdit,
  onSubmit,
}: CreateEditSupplierFormProps) {
  const isEditMode = !!supplierToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplierRequest | UpdateSupplierRequest>({
    defaultValues: {
      name: supplierToEdit?.name ?? "",
      phoneNumber: supplierToEdit?.phoneNumber ?? "",
      address: supplierToEdit?.address ?? "",
    },
  });

  const handleFormSubmit: SubmitHandler<CreateSupplierRequest | UpdateSupplierRequest> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="space-y-2">
        <Label htmlFor="name">اسم المورد</Label>

        <div className="relative">
          <Input
            id="name"
            placeholder="اسم المورد"
            className="pr-10 text-right bg-background"
            {...register("name", {
              required: "اسم المورد مطلوب",
            })}
          />

          <Building2 className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
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

      <Button type="submit" disabled={isSubmitting}>
        {isEditMode ? "حفظ التعديلات" : "إضافة مورد"}
      </Button>
    </form>
  );
}
