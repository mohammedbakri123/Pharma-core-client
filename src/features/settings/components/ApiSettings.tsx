import { useState } from "react";
import { useApiHealth } from "../hooks/useSettings";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Activity, RefreshCw, Server, Wifi, WifiOff, Database, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/ui/badge";

export default function ApiSettings() {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5084";

  const { 
    data: healthResponse, 
    isLoading, 
    refetch, 
    isError,
    isRefetching
  } = useApiHealth();

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await refetch();
      if (res.data && !res.isError) {
        toast({
          title: "تم الاتصال بنجاح",
          description: `تم اختبار الاتصال بالخادم. الحالة: ${res.data.status || "Ok"}، قاعدة البيانات: ${res.data.databaseStatus || "متصلة"}`,
        });
      } else {
        throw new Error("Offline");
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "فشل الاتصال",
        description: "تعذر الوصول إلى خادم واجهة البرمجة (.NET API). يرجى التحقق من تشغيل الخادم.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="outline" className="animate-pulse">جاري التحقق...</Badge>;
    if (isError) return <Badge variant="destructive" className="flex items-center gap-1"><WifiOff className="w-3 h-3" /> غير متصل</Badge>;
    return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1"><Wifi className="w-3 h-3" /> متصل ونشط</Badge>;
  };

  const getDatabaseStatusBadge = () => {
    if (isLoading) return <span className="text-muted-foreground text-sm">جاري الفحص...</span>;
    if (isError || healthResponse?.databaseStatus !== "connected") {
      return (
        <span className="text-red-500 text-sm font-semibold flex items-center gap-1 justify-end">
          <Database className="w-4 h-4" /> غير متصلة
        </span>
      );
    }
    return (
      <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-1 justify-end">
        <CheckCircle className="w-4 h-4 text-emerald-500" /> متصلة ومستقرة
      </span>
    );
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Connection Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Base URL */}
        <div className="space-y-2">
          <Label htmlFor="api-base-url" className="flex items-center gap-1.5 justify-end">
            <Server className="w-4 h-4 text-primary" /> عنوان خادم التطبيق (Base URL)
          </Label>
          <Input 
            id="api-base-url" 
            value={baseURL} 
            readOnly 
            className="text-left font-mono bg-muted text-muted-foreground border-border/40 focus:ring-0 cursor-default" 
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 justify-end">
            <Activity className="w-4 h-4 text-primary" /> حالة اتصال الشبكة
          </Label>
          <div className="h-10 flex items-center justify-between border border-border/40 px-3 bg-background rounded-md">
            <span>{getStatusBadge()}</span>
            <span className="text-sm font-medium">الخادم الأساسي</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Version */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 justify-end">
            <Clock className="w-4 h-4 text-primary" /> إصدار نظام التشغيل (Build)
          </Label>
          <Input 
            id="api-version" 
            value={isLoading ? "جاري التحميل..." : isError ? "غير متاح" : healthResponse?.version || "1.0.0.0"} 
            readOnly 
            className="text-right bg-muted text-muted-foreground border-border/40 focus:ring-0 cursor-default" 
          />
        </div>

        {/* Database Status */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 justify-end">
            <Database className="w-4 h-4 text-primary" /> قاعدة بيانات SQL Server
          </Label>
          <div className="h-10 flex items-center justify-between border border-border/40 px-3 bg-background rounded-md">
            <span>{getDatabaseStatusBadge()}</span>
            <span className="text-sm font-medium">حالة قاعدة البيانات</span>
          </div>
        </div>

      </div>

      {/* Connection actions */}
      <div className="flex justify-start gap-3 pt-4 border-t border-border/40">
        <Button 
          onClick={handleTestConnection} 
          disabled={isTesting || isLoading || isRefetching}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 flex items-center gap-1.5 transition-all duration-200"
        >
          {isTesting || isRefetching ? (
            <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
          ) : (
            <Activity className="w-4 h-4 ml-1.5" />
          )}
          فحص الاتصال الفوري
        </Button>
      </div>

    </div>
  );
}
