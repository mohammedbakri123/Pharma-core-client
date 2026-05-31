import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";

export default function UsersSettings() {
  return (
    <Card>
      <CardHeader className="text-right">
        <CardTitle>إدارة المستخدمين</CardTitle>
        <CardDescription>إدارة وصول الصيادلة والموظفين.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-muted-foreground">
          ميزات إدارة المستخدمين ستكون متاحة هنا (إضافة/حذف موظفين، أدوار،
          أذونات).
        </div>
      </CardContent>
    </Card>
  );
}
