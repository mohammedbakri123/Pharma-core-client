import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";

export default function BackupPlaceholder() {
  return (
    <Card>
      <CardHeader className="text-right">
        <CardTitle>النسخ الاحتياطي</CardTitle>
        <CardDescription>
          قريباً - ستتمكن من إنشاء نسخ احتياطية من بيانات النظام.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm text-center py-8">
          هذه الميزة قيد التطوير حالياً.
        </p>
      </CardContent>
    </Card>
  );
}
