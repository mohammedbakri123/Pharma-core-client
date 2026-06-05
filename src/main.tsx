import { createRoot } from "react-dom/client";
import App from "./app/app";
import { Toaster } from "@/ui/toaster";
import "./core/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>,
);
