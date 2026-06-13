import {
  CreateMedicineRequest,
  MedicineDto,
  MedicineUnit,
  UpdateMedicineRequest,
} from "@/types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useCategories } from "@features/inventory/hooks/useCategories";
import { Loader2, Package, ScanLine, Type } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { unitLabels } from "./medicineUnitConfig";

interface CreateEditMedicineFormProps {
  medicineToEdit?: MedicineDto;
  onSubmit: (
    data: CreateMedicineRequest | UpdateMedicineRequest,
  ) => Promise<void>;
}

export default function CreateEditMedicineForm({
  medicineToEdit,
  onSubmit,
}: CreateEditMedicineFormProps) {
  const isEditMode = !!medicineToEdit;
  const { data, isLoading: categoriesLoading } = useCategories();
  const categories = data?.categories || [];
  console.log(categories);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateMedicineRequest | UpdateMedicineRequest>({
    defaultValues: {
      name: medicineToEdit?.name ?? "",
      arabicName: medicineToEdit?.arabicName ?? "",
      barcode: medicineToEdit?.barcode ?? "",
      categoryId: medicineToEdit?.categoryId ?? undefined,
      unit: medicineToEdit?.unit ?? undefined,
    },
  });

  const handleFormSubmit: SubmitHandler<
    CreateMedicineRequest | UpdateMedicineRequest
  > = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="arabicName">الاسم العربي</Label>

          <div className="relative">
            <Input
              id="arabicName"
              placeholder="اسم الدواء بالعربية"
              className="pr-10 text-right bg-background"
              {...register("arabicName", {
                required: "الاسم العربي مطلوب",
              })}
            />

            <Type className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {errors.arabicName && (
            <p className="text-sm text-destructive">
              {errors.arabicName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">الاسم (لاتيني)</Label>

          <div className="relative">
            <Input
              id="name"
              placeholder="Medicine name"
              className="pr-10 bg-background dir=ltr text-left"
              {...register("name", {
                required: "الاسم مطلوب",
              })}
            />

            <Type className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="barcode">الباركود</Label>

          <div className="relative">
            <Input
              id="barcode"
              placeholder="رمز الباركود"
              className="pr-10 text-right bg-background"
              {...register("barcode")}
            />

            <ScanLine className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>الفئة</Label>

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() ?? ""}
                onValueChange={(value) =>
                  field.onChange(value ? Number(value) : undefined)
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent portal={false}>
                  {categoriesLoading ? (
                    <div className="flex justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem
                        key={cat.categoryId}
                        value={cat.categoryId.toString()}
                      >
                        {cat.categoryArabicName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>الوحدة</Label>

        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(value) =>
                field.onChange(value ? (value as MedicineUnit) : undefined)
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="اختر الوحدة" />
              </SelectTrigger>
              <SelectContent portal={false}>
                {Object.entries(unitLabels).map(([unitValue, label]) => (
                  <SelectItem key={unitValue} value={unitValue}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        {isEditMode ? "حفظ التعديلات" : "إضافة دواء"}
      </Button>
    </form>
  );
}
