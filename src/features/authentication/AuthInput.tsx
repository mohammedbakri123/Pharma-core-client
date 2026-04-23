import { useState } from "react";
import { Input } from "@/ui/input";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  type?: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
};

export default function AuthInput({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">
      {/* Icon */}
      {icon && (
        <div className="absolute right-3 top-3 text-muted-foreground">
          {icon}
        </div>
      )}

      <Input
        type={isPassword && !showPassword ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pr-10 ${isPassword ? "pl-10" : ""}`}
      />

      {/* Show/Hide password */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute left-3 top-3 text-muted-foreground"
        >
          {!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}
