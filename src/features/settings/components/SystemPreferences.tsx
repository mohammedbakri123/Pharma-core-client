import { useEffect, useState } from "react";
import { Label } from "@/ui/label";
import { Switch } from "@/ui/switch";
import { Separator } from "@/ui/separator";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Printer, AlertTriangle, Percent, Moon, Sun, ShieldAlert } from "lucide-react";

export default function SystemPreferences() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // States
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [autoLogout, setAutoLogout] = useState(true);
  const [autoPrint, setAutoPrint] = useState(true);
  const [stockThreshold, setStockThreshold] = useState(10);
  const [defaultTax, setDefaultTax] = useState(15);

  // Load settings on mount
  useEffect(() => {
    const savedAutoLogout = localStorage.getItem("pref_auto_logout");
    if (savedAutoLogout !== null) setAutoLogout(savedAutoLogout === "true");

    const savedAutoPrint = localStorage.getItem("pref_auto_print");
    if (savedAutoPrint !== null) setAutoPrint(savedAutoPrint === "true");

    const savedThreshold = localStorage.getItem("pref_stock_threshold");
    if (savedThreshold !== null) setStockThreshold(Number(savedThreshold));

    const savedTax = localStorage.getItem("pref_default_tax");
    if (savedTax !== null) setDefaultTax(Number(savedTax));
  }, []);

  // Sync theme when isDarkMode changes
  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
    // Dispatch event to sync ThemeToggle component
    window.dispatchEvent(new Event("theme-change"));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      localStorage.setItem("pref_auto_logout", String(autoLogout));
      localStorage.setItem("pref_auto_print", String(autoPrint));
      localStorage.setItem("pref_stock_threshold", String(stockThreshold));
      localStorage.setItem("pref_default_tax", String(defaultTax));

      toast({
        title: "تم حفظ التفضيلات",
        description: "تم تحديث إعدادات وتفضيلات النظام بنجاح.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل حفظ التفضيلات.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Theme Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 text-right flex-1">
          <Label className="flex items-center gap-1.5 font-semibold">
            {isDarkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
            الوضع الداكن (Dark Mode)
          </Label>
          <p className="text-xs text-muted-foreground">
            تفعيل المظهر الداكن لتخفيف إجهاد العين أثناء العمل الليلي.
          </p>
        </div>
        <Switch 
          checked={isDarkMode} 
          onCheckedChange={handleThemeChange} 
        />
      </div>

      <Separator className="bg-border/60" />

      {/* Auto Logout */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 text-right flex-1">
          <Label className="flex items-center gap-1.5 font-semibold">
            <ShieldAlert className="w-4 h-4 text-primary" /> تسجيل الخروج التلقائي للأمان
          </Label>
          <p className="text-xs text-muted-foreground">
            تسجيل الخروج التلقائي بعد 15 دقيقة من عدم النشاط لحماية بيانات الصيدلية.
          </p>
        </div>
        <Switch 
          checked={autoLogout} 
          onCheckedChange={setAutoLogout} 
        />
      </div>

      <Separator className="bg-border/60" />

      {/* Auto Print Receipt */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 text-right flex-1">
          <Label className="flex items-center gap-1.5 font-semibold">
            <Printer className="w-4 h-4 text-primary" /> الطباعة التلقائية للفواتير
          </Label>
          <p className="text-xs text-muted-foreground">
            إرسال الفاتورة تلقائياً إلى طابعة الإيصالات الحرارية فور إتمام عملية البيع.
          </p>
        </div>
        <Switch 
          checked={autoPrint} 
          onCheckedChange={setAutoPrint} 
        />
      </div>

      <Separator className="bg-border/60" />

      {/* Numbers Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Stock Alert */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="w-4 h-4 text-yellow-500" /> حد تنبيه نقص المخزون
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={1000}
              value={stockThreshold}
              onChange={(e) => setStockThreshold(Number(e.target.value))}
              className="text-right focus-visible:ring-primary/30"
            />
            <span className="text-sm text-muted-foreground min-w-[40px]">عبوات</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            سيتم عرض تحذير للمنتجات التي يقل رصيدها عن هذا الحد في لوحة التحكم.
          </p>
        </div>

        {/* Default Tax Rate */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 font-semibold">
            <Percent className="w-4 h-4 text-primary" /> نسبة الضريبة الافتراضية
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              value={defaultTax}
              onChange={(e) => setDefaultTax(Number(e.target.value))}
              className="text-right focus-visible:ring-primary/30"
            />
            <span className="text-sm text-muted-foreground min-w-[40px]">%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            نسبة الضريبة القياسية المضافة تلقائياً إلى الفواتير والمبيعات الجديدة.
          </p>
        </div>

      </div>

      <div className="flex justify-start pt-4 border-t border-border/40">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 transition-all duration-200"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
          ) : (
            <Save className="w-4 h-4 ml-1.5" />
          )}
          حفظ التفضيلات
        </Button>
      </div>
      
    </div>
  );
}
