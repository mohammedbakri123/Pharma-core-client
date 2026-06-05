import {
  useBackupDatabase,
  useRestoreDatabase,
  useBackupHistory,
  formatBackupName,
} from "../hooks/useSettings";
import type { BackupHistoryItem } from "../types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/ui/card";
import { Button } from "@/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  History,
} from "lucide-react";
import { Badge } from "@/ui/badge";

export default function BackupSettings() {
  const { toast } = useToast();
  const { backups, addBackup, markRestored } = useBackupHistory();
  const backupMutation = useBackupDatabase();
  const restoreMutation = useRestoreDatabase();

  const handleBackup = () => {
    backupMutation.mutate(undefined, {
      onSuccess: (data) => {
        toast({
          title: "اكتمل النسخ الاحتياطي",
          description:
            "تم إنشاء نسخة احتياطية لقاعدة البيانات بنجاح وحفظها على الخادم.",
        });

        const { size, name, date } = formatBackupName(data);

        const newBackup: BackupHistoryItem = {
          id: Date.now().toString(),
          name,
          size,
          date,
          status: "success",
        };

        addBackup(newBackup);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "فشل النسخ الاحتياطي",
          description:
            error?.response?.data?.message ||
            "حدث خطأ أثناء الاتصال بالخادم لإنشاء النسخة الاحتياطية.",
        });
      },
    });
  };

  const handleRestore = (fileName: string) => {
    if (
      confirm(
        `تحذير: هل أنت متأكد من رغبتك في استعادة قاعدة البيانات من الملف "${fileName}"؟\nسيؤدي هذا إلى الكتابة فوق كافة البيانات الحالية وتجاوز أي تغييرات تم إجراؤها بعد هذا النسخ.`
      )
    ) {
      restoreMutation.mutate(fileName, {
        onSuccess: () => {
          toast({
            title: "اكتمل استعادة قاعدة البيانات",
            description:
              "تمت استعادة البيانات بنجاح. قد يستغرق التطبيق دقيقة واحدة لإعادة التهيئة.",
          });
          markRestored(fileName);
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "فشلت عملية الاستعادة",
            description:
              error?.response?.data?.message ||
              "فشلت استعادة قاعدة البيانات. يرجى مراجعة سجلات الخادم.",
          });
        },
      });
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
