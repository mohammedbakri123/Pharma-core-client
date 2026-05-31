import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import GeneralSettings from "./GeneralSettings";
import UsersSettings from "./UsersSettings";

export default function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
        <TabsTrigger value="general">عام</TabsTrigger>
        <TabsTrigger value="users">المستخدمين</TabsTrigger>
        <TabsTrigger value="notifications">التنبيهات</TabsTrigger>
        <TabsTrigger value="billing">الفواتير</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6 mt-6">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="users" className="mt-6">
        <UsersSettings />
      </TabsContent>
    </Tabs>
  );
}
