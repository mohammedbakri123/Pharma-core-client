import { useState } from "react";
import { Button } from "@/ui/button";
import { Mail, Lock, UserPlus, User } from "lucide-react";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import { NavLink } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, password });
  };

  return (
    <AuthLayout title="إنشاء حساب" subtitle="قم بإنشاء حساب جديد للبدء">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User size={16} />}
        />

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
          <UserPlus className="w-4 h-4 ml-2" />
          إنشاء حساب
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        لديك حساب بالفعل؟
        <NavLink
          to="/login"
          className="text-primary cursor-pointer hover:underline"
        >
          إنشاء حساب
        </NavLink>
      </p>
    </AuthLayout>
  );
}
