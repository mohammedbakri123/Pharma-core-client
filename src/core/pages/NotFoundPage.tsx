import { Link } from "react-router-dom";
import { Button } from "@/ui/button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Large 404 */}
        <div className="relative">
          <span className="block font-heading text-[10rem] font-black leading-none tracking-tighter text-muted/40 select-none sm:text-[14rem]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              404
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3 max-w-md">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            الصفحة غير موجودة
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/">
              <ArrowRight className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to="/" onClick={() => window.history.back()}>
              العودة للخلف
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
