import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";

import PharmacyInfoForm from "./PharmacyInfoForm";
import SystemPreferences from "./SystemPreferences";
import ApiSettings from "./ApiSettings";

export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      {/* Pharmacy Info */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle>معلومات الصيدلية</CardTitle>
          <CardDescription>
            المعلومات العامة لفرع الصيدلية الخاص بك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PharmacyInfoForm />
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle>تفضيلات النظام</CardTitle>
          <CardDescription>.ERP تكوين سلوك نظام</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemPreferences />
        </CardContent>
      </Card>

      {/* API */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle>اتصال خدمة .NET</CardTitle>
          <CardDescription>
            إعدادات الربط الحالية التي يقرأها التطبيق من متغيرات بيئة Vite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiSettings />
        </CardContent>
      </Card>
    </div>
  );
}
