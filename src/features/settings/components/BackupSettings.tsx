import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { backupDatabase, restoreDatabase } from "@/api";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/ui/card";
import { Button } from "@/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  History,
  CheckCircle,
  Clock
} from "lucide-react";
import { Badge } from "@/ui/badge";

interface BackupHistoryItem {
  id: string;
  name: string;
  size: string;
  date: string;
  status: "success" | "restored";
}

export default function BackupSettings() {
  const { toast } = useToast();
  const [backups, setBackups] = useState<BackupHistoryItem[]>([
    { id: "1", name: "pharma_backup_2026-06-05_auto.bak", size: "12.4 MB", date: "2026-06-05 12:00", status: "success" },
    { id: "2", name: "pharma_backup_2026-06-04_manual.bak", size: "12.2 MB", date: "2026-06-04 18:30", status: "restored" },
  ]);

  // Mutation: Backup Database
  const backupMutation = useMutation({
    mutationFn: async () => {
      const res = await backupDatabase();
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title: "اكتمل النسخ الاحتياطي",
        description: "تم إنشاء نسخة احتياطية لقاعدة البيانات بنجاح وحفظها على الخادم.",
      });

      // Add to local history list
      const formattedSize = data.sizeBytes 
        ? `${(data.sizeBytes / (1024 * 1024)).toFixed(2)} MB` 
        : "12.5 MB";
      
      const newBackup: BackupHistoryItem = {
        id: Date.now().toString(),
        name: data.backupName || `pharma_backup_${new Date().toISOString().split('T')[0]}_manual.bak`,
        size: formattedSize,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: "success",
      };

      setBackups((prev) => [newBackup, ...prev]);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل النسخ الاحتياطي",
        description: error.response?.data?.message || "حدث خطأ أثناء الاتصال بالخادم لإنشاء النسخة الاحتياطية.",
      });
    },
  });

  // Mutation: Restore Database
  const restoreMutation = useMutation({
    mutationFn: async (fileName: string) => {
      return restoreDatabase(fileName);
    },
    onSuccess: (_, fileName) => {
      toast({
        title: "اكتمل استعادة قاعدة البيانات",
        description: "تمت استعادة البيانات بنجاح. قد يستغرق التطبيق دقيقة واحدة لإعادة التهيئة.",
      });
      // Mark as restored in history
      setBackups((prev) => 
        prev.map((b) => b.name === fileName ? { ...b, status: "restored" } : b)
      );
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشلت عملية الاستعادة",
        description: error.response?.data?.message || "فشلت استعادة قاعدة البيانات. يرجى مراجعة سجلات الخادم.",
      });
    },
  });

  const handleBackup = () => {
    backupMutation.mutate();
  };

  const handleRestore = (fileName: string) => {
    if (confirm(`تحذير: هل أنت متأكد من رغبتك في استعادة قاعدة البيانات من الملف "${fileName}"؟\nسيؤدي هذا إلى الكتابة فوق كافة البيانات الحالية وتجاوز أي تغييرات تم إجراؤها بعد هذا النسخ.`)) {
      restoreMutation.mutate(fileName);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Backup Card actions */}
        <Card className="md:col-span-1 border-border/40 shadow-md">
          <CardHeader className="border-b border-border/40 bg-card">
            <CardTitle className="text-base flex items-center gap-2 justify-end">
              <Database className="w-5 h-5 text-primary" /> قاعدة البيانات الحالية
            </CardTitle>
            <CardDescription>إنشاء نسخ احتياطية فورية وتأمين بيانات الصيدلية.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <Badge className="bg-emerald-500 text-white">متصلة</Badge>
                <span className="text-muted-foreground">حالة محرك البيانات</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-medium text-foreground">SQL Server 2022</span>
                <span className="text-muted-foreground">نوع محرك قاعدة البيانات</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-medium text-foreground">12.5 MB</span>
                <span className="text-muted-foreground">حجم الملفات الحالي</span>
              </div>
            </div>

            <Button 
              onClick={handleBackup}
              disabled={backupMutation.isPending}
              className="w-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-1.5 transition-all duration-200"
            >
              {backupMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
              ) : (
                <Database className="w-4 h-4 ml-1.5" />
              )}
              إنشاء نسخة احتياطية الآن
            </Button>
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card className="md:col-span-2 border-border/40 shadow-md">
          <CardHeader className="border-b border-border/40 bg-card">
            <CardTitle className="text-base flex items-center gap-2 justify-end">
              <History className="w-5 h-5 text-primary" /> سجل النسخ الاحتياطي والاستعادة
            </CardTitle>
            <CardDescription>قائمة بالنسخ الاحتياطية المتوفرة على خادم فارماكور المحلي.</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground">اسم الملف</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground">الحجم</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground">التاريخ والوقت</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground">الحالة</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {backups.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-foreground truncate max-w-[200px]" title={b.name}>
                        {b.name}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground text-xs font-mono">{b.size}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs font-mono">{b.date}</td>
                      <td className="py-3 px-3">
                        {b.status === "restored" ? (
                          <Badge className="bg-blue-500 text-white hover:bg-blue-600 text-xxs">مستعَاد</Badge>
                        ) : (
                          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 text-xxs">ناجح</Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRestore(b.name)}
                          disabled={restoreMutation.isPending}
                          className="text-primary hover:bg-primary/10 h-7 w-7 transition-colors"
                          title="استعادة قاعدة البيانات من هذا الملف"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-md text-xs text-yellow-600 dark:text-yellow-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">ملاحظة أمان:</span> استعادة قاعدة البيانات هي عملية حساسة. يرجى توخي الحذر الشديد والتأكد من إتمام كافة المبيعات والعمليات النشطة قبل الشروع بالاستعادة لتجنب فقدان البيانات أو تعطل نقطة البيع (POS).
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
