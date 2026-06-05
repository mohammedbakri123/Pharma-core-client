import ThemeToggle from "@/ui/ThemeToggle";
import logo from "@assets/generated_images/minimalist_pharmacy_logo_icon.png";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-slate-50 via-zinc-100 to-teal-50/30 dark:from-slate-950 dark:via-zinc-900 dark:to-teal-950/20 p-4 overflow-hidden"
      dir="rtl"
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[80px] pointer-events-none"></div>
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Floating Theme Toggle */}
      <div className="absolute top-4 left-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 z-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
        {/* Branding & Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border/40 shadow-md p-3">
            <img src={logo} alt="PharmaCore" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground font-heading">
              فارماكور <span className="text-primary font-light">ERP</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              نظام إدارة الصيدلية والتحكم الذكي
            </p>
          </div>
        </div>

        {/* Card wrapper */}
        <div className="bg-card/75 dark:bg-card/70 backdrop-blur-md rounded-2xl border border-border/40 shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
        
        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/80">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} فارماكور.
        </p>
      </div>
    </div>
  );
}
