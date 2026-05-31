import { useState } from "react";
import { Input } from "@/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { type UseFormRegisterReturn } from "react-hook-form";

type Props = {
  type?: "text" | "email" | "password";
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
};

export default function AuthInput({
  type = "text",
  placeholder,
  error,
  registration,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1">
      <div className="relative">
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
          >
            {!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        <Input
          type={isPassword && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          className={`${isPassword ? "pl-10" : ""} ${error ? "border-destructive" : ""}`}
          {...registration}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive pr-2">{error}</p>
      )}
    </div>
  );
}