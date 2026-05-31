import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

export default function ApiSettings() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
        <div className="space-y-2">
          <Label htmlFor="api-base-url">عنوان الخدمة</Label>
          <Input id="api-base-url" readOnly className="text-right" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-prefix">بادئة واجهة البرمجة</Label>
          <Input id="api-prefix" readOnly className="text-right" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
        <div className="space-y-2">
          <Label htmlFor="api-health-path">مسار الفحص</Label>
          <Input id="api-health-path" readOnly className="text-right" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-status">حالة الاتصال</Label>
          <Input id="api-status" readOnly className="text-right" />
        </div>
      </div>
    </div>
  );
}
