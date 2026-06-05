import { useState } from "react";
import { Input } from "@/ui/input";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { type UseFormRegisterReturn } from "react-hook-form";

type Props = {
  type?: "text" | "email" | "password";
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
  icon?: LucideIcon;
};

export default function AuthInput({
  type = "text",
  placeholder,
  error,
  registration,
  icon: Icon,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1">
      <div className="relative">
        {/* Left Side: Password Eye Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 cursor-pointer"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}

        {/* Right Side: Input Icon */}
        {Icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
            <Icon size={16} />
          </div>
        )}

        <Input
          type={isPassword && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          className={`text-right w-full bg-background/50 border-border/60 focus-visible:ring-primary/20 transition-all ${
            isPassword ? "pl-10" : ""
          } ${Icon ? "pr-10" : ""} ${error ? "border-destructive/80 focus-visible:ring-destructive/20" : ""}`}
          {...registration}
        />
      </div>

      {error && (
        <p className="text-xs text-destructive mt-1 font-semibold pr-2">{error}</p>
      )}
    </div>
  );
}