import { useForm } from "react-hook-form";
import { Button } from "@/ui/button";
import { User, Phone, MapPin } from "lucide-react";

type ProfileFormData = {
  userName: string;
  phoneNumber?: string;
  address?: string;
};

type ProfileFormProps = {
  defaultValues: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
};

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <User className="absolute right-3 top-3 text-muted-foreground" size={16} />
        <input
          {...register("userName", { required: "اسم المستخدم مطلوب" })}
          placeholder="اسم المستخدم"
          className="w-full pr-10 py-2 border border-input rounded-md"
        />
        {errors.userName && (
          <p className="text-sm text-destructive pr-2">{errors.userName.message}</p>
        )}
      </div>

      <div className="relative">
        <Phone className="absolute right-3 top-3 text-muted-foreground" size={16} />
        <input
          {...register("phoneNumber")}
          placeholder="رقم الهاتف (اختياري)"
          className="w-full pr-10 py-2 border border-input rounded-md"
        />
      </div>

      <div className="relative">
        <MapPin className="absolute right-3 top-3 text-muted-foreground" size={16} />
        <input
          {...register("address")}
          placeholder="العنوان (اختياري)"
          className="w-full pr-10 py-2 border border-input rounded-md"
        />
      </div>

      <Button type="submit" className="w-full">
        حفظ التعديلات
      </Button>
    </form>
  );
}
