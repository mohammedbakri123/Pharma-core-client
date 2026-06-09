import { UserRole } from "@features/auth";
import { UserFormData, UserDto } from "@/types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Lock, MapPin, Phone, User } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

interface CreateEditUserFormProps {
  userToEdit?: UserDto;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export default function CreateEditUserForm({
  userToEdit,
  onSubmit,
}: CreateEditUserFormProps) {
  const isEditMode = !!userToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    defaultValues: {
      userName: userToEdit?.userName ?? "",
      phoneNumber: userToEdit?.phoneNumber ?? "",
      address: userToEdit?.address ?? "",
      role: userToEdit?.role ?? UserRole.Cashier,
      password: "",
    },
  });

  const handleFormSubmit: SubmitHandler<UserFormData> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userName">اسم المستخدم</Label>

          <div className="relative">
            <Input
              id="userName"
              placeholder="مثال: ahmad_pharmacist"
              className="pr-10 text-right bg-background"
              {...register("userName", {
                required: "اسم المستخدم مطلوب",
                minLength: {
                  value: 3,
                  message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
                },
              })}
            />

            <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {errors.userName && (
            <p className="text-sm text-destructive">
              {errors.userName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            {isEditMode ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"}
          </Label>

          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="6 خانات على الأقل"
              className="pr-10 text-right bg-background"
              {...register("password", {
                validate: (value) => {
                  if (!value) {
                    if (isEditMode) return true;
                    return "كلمة المرور مطلوبة";
                  }
                  return (
                    value.length >= 6 ||
                    "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                  );
                },
              })}
            />

            <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">رقم الهاتف</Label>

          <div className="relative">
            <Input
              id="phoneNumber"
              placeholder="+968 90000000"
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
              placeholder="الحي، المدينة"
              className="pr-10 text-right bg-background"
              {...register("address")}
            />

            <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>صلاحية النظام</Label>

        <div className="flex gap-4 justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <span>صيدلاني / كاشير</span>

            <input
              type="radio"
              value={UserRole.Cashier}
              {...register("role", {
                required: "اختر صلاحية المستخدم",
              })}
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span>مدير النظام</span>

            <input
              type="radio"
              value={UserRole.Admin}
              {...register("role", {
                required: "اختر صلاحية المستخدم",
              })}
            />
          </label>
        </div>

        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isEditMode ? "حفظ التعديلات" : "إضافة مستخدم"}
      </Button>
    </form>
  );
}
