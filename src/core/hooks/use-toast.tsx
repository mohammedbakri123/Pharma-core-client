import rhtToast from "react-hot-toast";

const TOAST_LIMIT = 2;
const activeToasts: string[] = [];

type ToastVariant = "default" | "success" | "destructive";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (props: ToastOptions & { id: string }) => void;
}

function ToastContent({ title, description }: ToastOptions) {
  return (
    <div className="grid gap-1">
      {title && <div className="text-sm font-semibold">{title}</div>}
      {description && <div className="text-sm opacity-90">{description}</div>}
    </div>
  );
}

function genId() {
  return Math.random().toString(36).substring(2, 9);
}

function removeToast(id: string) {
  const index = activeToasts.indexOf(id);
  if (index !== -1) {
    activeToasts.splice(index, 1);
  }
}

function showToast(id: string, options: ToastOptions) {
  while (activeToasts.length >= TOAST_LIMIT) {
    const oldestId = activeToasts.shift();
    if (oldestId) {
      rhtToast.dismiss(oldestId);
    }
  }

  activeToasts.push(id);

  const content = (
    <ToastContent title={options.title} description={options.description} />
  );

  const commonOptions = {
    id,
    onClose: () => removeToast(id),
  };

  switch (options.variant) {
    case "success":
      rhtToast.success(content, commonOptions);
      break;
    case "destructive":
      rhtToast.error(content, commonOptions);
      break;
    default:
      rhtToast(content, commonOptions);
  }
}

function toast(options: ToastOptions): ToastReturn {
  const id = genId();

  showToast(id, options);

  return {
    id,
    dismiss: () => {
      removeToast(id);
      rhtToast.dismiss(id);
    },
    update: (props) => {
      showToast(props.id, props);
    },
  };
}

function dismiss(toastId?: string) {
  if (toastId) {
    removeToast(toastId);
    rhtToast.dismiss(toastId);
  } else {
    activeToasts.length = 0;
    rhtToast.dismiss();
  }
}

function useToast() {
  return { toast, dismiss };
}

export { useToast, toast };
