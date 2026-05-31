import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { LoginForm } from "../components/LoginForm";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const onSubmit = (data: Parameters<typeof loginMutation.mutate>[0], e?: React.FormEvent) => {
    if (e) e.preventDefault();
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <AuthLayout title="تسجيل الدخول" subtitle="أدخل بياناتك للوصول إلى النظام">
      <LoginForm
        onSubmit={onSubmit}
        isPending={loginMutation.isPending}
        error={loginMutation.error ? new Error(String(loginMutation.error)) : null}
      />
    </AuthLayout>
  );
}