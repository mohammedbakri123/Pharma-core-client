export { default as SettingsPage } from "./pages/SettingsPage";
export { default as SettingsHeader } from "./components/SettingsHeader";
export { default as GeneralSettings } from "./components/general/GeneralSettings";
export { default as UsersSettings } from "./components/users/UsersSettings";

export { default as ApiSettings } from "./components/general/ApiSettings";
export { default as ColorSchemePicker } from "./components/general/ColorSchemePicker";
export {
  useApiHealth,
  useBackupDatabase,
  useRestoreDatabase,
} from "./hooks/useSettings";
export { useColorScheme, initColorScheme, COLOR_SCHEMES } from "./hooks/useColorScheme";
export type { ColorScheme } from "./hooks/useColorScheme";
export * from "./types/settings";
