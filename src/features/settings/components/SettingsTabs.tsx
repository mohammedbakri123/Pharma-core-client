import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import GeneralSettings from "./GeneralSettings";
import UsersSettings from "./UsersSettings";
import { Landmark, Users, Database } from "lucide-react";

export default function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="w-full" dir="rtl">
      <TabsList className="grid w-full grid-cols-3 max-w-lg bg-muted/40 p-1.5 rounded-xl border border-border/40 mb-6 h-auto">
        <TabsTrigger 
          value="general" 
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <Landmark className="w-4 h-4" /> عام 
        </TabsTrigger>
        <TabsTrigger 
          value="users" 
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <Users className="w-4 h-4" /> الموظفين
        </TabsTrigger>
        <TabsTrigger 
          value="backup" 
          className="rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
        >
          <Database className="w-4 h-4" /> النسخ الاحتياطي
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
        <UsersSettings />
      </TabsContent>

      <TabsContent value="backup" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
        {/* <BackupSettings /> */}
      </TabsContent>
    </Tabs>
  );
}
