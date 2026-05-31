import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";

export default function Settings() {
  return (
    <div className="space-y-6" dir="rtl">
      <SettingsHeader />
      <SettingsTabs />
    </div>
  );
}
