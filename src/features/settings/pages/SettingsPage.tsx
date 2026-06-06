import { Outlet, useLocation } from "react-router-dom";
import SettingsHeader from "../components/SettingsHeader";
import SettingsTabs from "../components/SettingsTabs";

export default function SettingsPage() {
  const location = useLocation();
  const isIndex =
    location.pathname === "/settings" || location.pathname === "/settings/";

  return (
    <div className="space-y-6" dir="rtl">
      
      {isIndex ?<>
      <SettingsHeader />
      <SettingsTabs />
      </>  : <Outlet />}
    </div>
  );
}
