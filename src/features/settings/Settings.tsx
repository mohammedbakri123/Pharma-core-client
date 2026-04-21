import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Switch } from "@/ui/switch";
import { Separator } from "@/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export default function Settings() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          الإعدادات
        </h2>
        <p className="text-muted-foreground">
          إدارة تكوين الصيدلية والتفضيلات.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="notifications">التنبيهات</TabsTrigger>
          <TabsTrigger value="billing">الفواتير</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="text-right">
              <CardTitle>معلومات الصيدلية</CardTitle>
              <CardDescription>
                المعلومات العامة لفرع الصيدلية الخاص بك.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الصيدلية</Label>
                  <Input
                    id="name"
                    defaultValue="فارماكور المركزية"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">رقم الترخيص</Label>
                  <Input
                    id="license"
                    defaultValue="PH-8829-NYC"
                    disabled
                    className="text-right"
                  />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  defaultValue="123 مجمع المدينة الطبي"
                  className="text-right"
                />
              </div>
              <div className="flex justify-start">
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-right">
              <CardTitle>تفضيلات النظام</CardTitle>
              <CardDescription>تكوين سلوك نظام ERP.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 text-right">
                  <Label>الوضع الداكن</Label>
                  <p className="text-sm text-muted-foreground">
                    تفعيل السمة الداكنة للواجهة.
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 text-right">
                  <Label>تسجيل الخروج التلقائي</Label>
                  <p className="text-sm text-muted-foreground">
                    تسجيل الخروج بعد 15 دقيقة من عدم النشاط.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-right">
              <CardTitle>اتصال خدمة .NET</CardTitle>
              <CardDescription>
                إعدادات الربط الحالية التي يقرأها التطبيق من متغيرات بيئة Vite.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6 text-right">
          <Card>
            <CardHeader>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
