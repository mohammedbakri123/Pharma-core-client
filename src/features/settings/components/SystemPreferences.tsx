import { Label } from "@/ui/label";
import { Switch } from "@/ui/switch";
import { Separator } from "@/ui/separator";

export default function SystemPreferences() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-4">
        <div className="space-y-0.5 text-right">
          <Label>الوضع الداكن</Label>
          <p className="text-sm text-muted-foreground">
            .تفعيل السمة الداكنة للواجهة
          </p>
        </div>
        <Switch />
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-4">
        <div className="space-y-0.5 text-right">
          <Label>تسجيل الخروج التلقائي</Label>
          <p className="text-sm text-muted-foreground">
            .تسجيل الخروج بعد 15 دقيقة من عدم النشاط
          </p>
        </div>
        <Switch defaultChecked />
      </div>
    </div>
  );
}
