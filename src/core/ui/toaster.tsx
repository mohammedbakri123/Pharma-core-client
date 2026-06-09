import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/ui/toast";

const variantIcons = {
  default: null,
  success: CheckCircle2,
  destructive: CircleAlert,
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const Icon = variantIcons[props.variant ?? "default"];

        return (
          <Toast key={id} {...props}>
            <div className="flex w-full gap-3 items-start">
              {Icon && (
                <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
