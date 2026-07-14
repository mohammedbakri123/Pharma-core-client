import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { LoginForm } from "../components/LoginForm";
import AuthLayout from "../components/AuthLayout";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "../types";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const onSubmit = (
    data: Parameters<typeof loginMutation.mutate>[0],
    e?: React.FormEvent,
  ) => {
    if (e) e.preventDefault();
    const t = toast({
      title: "جاري تسجيل الدخول...",
      description: "يرجى الانتظار",
    });
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        t.update({
          id: t.id,
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك",
          variant: "success",
        });
        const role = response.data.user.role;
        navigate(role === UserRole.Cashier ? "/pos" : "/");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          "فشل تسجيل الدخول. تأكد من البيانات.";
        t.update({
          id: t.id,
          title: "فشل تسجيل الدخول",
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <AuthLayout title="تسجيل الدخول" subtitle="أدخل بياناتك للوصول إلى النظام">
      <LoginForm
        onSubmit={onSubmit}
        isPending={loginMutation.isPending}
        error={
          loginMutation.error ? new Error(String(loginMutation.error)) : null
        }
      />
    </AuthLayout>
  );
}
