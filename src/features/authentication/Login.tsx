import { useState } from "react";
import { Button } from "@/ui/button";
import { Mail, Lock, LogIn } from "lucide-react";
import AuthInput from "./AuthInput";
import AuthLayout from "./AuthLayout";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <AuthLayout title="تسجيل الدخول" subtitle="أدخل بياناتك للوصول إلى النظام">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
        />

        <AuthInput
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={16} />}
        />

        <Button className="w-full bg-primary hover:bg-primary/90 shadow-md">
          <LogIn className="w-4 h-4 ml-2" />
          تسجيل الدخول
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        ليس لديك حساب؟{" "}
        <NavLink
          to="/register"
          className="text-primary cursor-pointer hover:underline"
        >
          إنشاء حساب
        </NavLink>
      </p>
    </AuthLayout>
  );
}
