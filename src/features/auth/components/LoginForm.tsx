import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/ui/button";
import AuthInput from "./AuthInput";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { User, Lock, KeyRound } from "lucide-react";

type LoginFormProps = {
  onSubmit: (data: LoginInput) => void;
  isPending: boolean;
  error: Error | null;
};

export function LoginForm({ onSubmit, isPending, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const handlePrefillDemo = () => {
    setValue("userName", "admin");
    setValue("password", "admin");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Input */}
        <AuthInput
          type="text"
          placeholder="اسم المستخدم"
          error={errors.userName?.message}
          registration={register("userName")}
          icon={User}
        />

        {/* Password Input */}
        <AuthInput
          type="password"
          placeholder="كلمة المرور"
          error={errors.password?.message}
          registration={register("password")}
          icon={Lock}
        />

        {error && (
          <p className="text-xs text-destructive text-center font-bold bg-destructive/10 py-2 rounded-md border border-destructive/20 animate-pulse">
            اسم المستخدم أو كلمة المرور غير صحيحة.
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-white shadow-md font-bold transition-all duration-200 py-2.5 rounded-xl cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="pt-2 border-t border-border/40 text-center">
        <button
          type="button"
          onClick={handlePrefillDemo}
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 mx-auto cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5" />
          تعبئة بيانات الحساب التجريبي (admin)
        </button>
        LoginForm
      </div>
    </div>
  );
}
