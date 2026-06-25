import { Outlet } from "react-router-dom";
import SettingsHeader from "../components/SettingsHeader";
import TabNav from "@/ui/TabNav";
import { Landmark, Users, Database } from "lucide-react";

const tabs = [
  { to: "/settings/general", label: "عام", icon: <Landmark className="w-4 h-4" /> },
  { to: "/settings/users", label: "الموظفين", icon: <Users className="w-4 h-4" /> },
  { to: "/settings/backup", label: "النسخ الاحتياطي", icon: <Database className="w-4 h-4" /> },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <SettingsHeader />
      <TabNav tabs={tabs} variant="pill">
        <Outlet />
      </TabNav>
    </div>
  );
}
