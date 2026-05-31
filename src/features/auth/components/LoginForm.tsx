import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/ui/button";
import AuthInput from "./AuthInput";
import { loginSchema, type LoginInput } from "@/lib/validators";

type LoginFormProps = {
  onSubmit: (data: LoginInput) => void;
  isPending: boolean;
  error: Error | null;
};

export function LoginForm({ onSubmit, isPending, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AuthInput
        type="text"
        placeholder="اسم المستخدم"
        error={errors.userName?.message}
        registration={register("userName")}
      />

      <AuthInput
        type="password"
        placeholder="كلمة المرور"
        error={errors.password?.message}
        registration={register("password")}
      />

      {error && (
        <p className="text-sm text-destructive text-center">
          فشل تسجيل الدخول. تأكد من البيانات.
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 shadow-md"
        disabled={isPending}
      >
        {isPending ? "جاري التحميل..." : "تسجيل الدخول"}
      </Button>
    </form>
  );
}