import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";


import ApiSettings from "./ApiSettings";

export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      {/* Pharmacy Info */}
      {/* TODO: do this some day */}

      {/* System Preferences */}
           {/* TODO: do this some day */}


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
