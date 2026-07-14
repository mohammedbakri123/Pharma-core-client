import { createRoot } from "react-dom/client";
import App from "./app/app";
import { Toaster } from "react-hot-toast";
import { initColorScheme } from "@features/settings/hooks/useColorScheme";
import "./core/styles/index.css";

initColorScheme();

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        className: "toast-theme",

        duration: 4000,
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      }}
    />
  </>,
);
