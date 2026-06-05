import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { settingsApi } from "../api";
import { useAuthStore } from "@features/auth/store/authStore";
import type {
  BackupHistoryItem,
  NewUserPayload,
  PharmacyInfo,
  SystemPreferences,
} from "../types";
import type { HealthCheckDto, BackupResultDto } from "@/types";

const PHARMACY_INFO_KEY = "pharmacy_info";

const DEFAULT_PHARMACY_INFO: PharmacyInfo = {
  name: "فارماكور المركزية",
  license: "PH-8829-NYC",
  address: "123 مجمع المدينة الطبي",
  phone: "+966 50 123 4567",
  email: "info@pharmacore.com",
  taxNumber: "300012345600003",
};

const DEFAULT_PREFERENCES: SystemPreferences = {
  isDarkMode: false,
  autoLogout: true,
  autoPrint: true,
  stockThreshold: 10,
  defaultTax: 15,
};

export function useApiHealth() {
  return useQuery<HealthCheckDto>({
    queryKey: ["api-health"],
    queryFn: async () => {
      const res = await settingsApi.getHealth();
      return res.data;
    },
    retry: 1,
    refetchInterval: 20000,
  });
}

export function useBackupDatabase() {
  return useMutation<BackupResultDto, Error, void>({
    mutationFn: async () => {
      const res = await settingsApi.backupDatabase();
      return res.data;
    },
  });
}

export function useRestoreDatabase() {
  return useMutation<unknown, Error, string>({
    mutationFn: (fileName: string) => settingsApi.restoreDatabase(fileName),
  });
}

export function useUsersList() {
  return useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const res = await settingsApi.getUsers({ limit: 100 });
      return res.data;
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: NewUserPayload) => settingsApi.createUser(data),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => settingsApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
}

export function usePharmacyInfo() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PharmacyInfo>({
    queryKey: ["pharmacy-info"],
    queryFn: () => {
      const stored = localStorage.getItem(PHARMACY_INFO_KEY);
      if (stored) {
        try {
          return { ...DEFAULT_PHARMACY_INFO, ...JSON.parse(stored) };
        } catch {
          return DEFAULT_PHARMACY_INFO;
        }
      }
      return DEFAULT_PHARMACY_INFO;
    },
    staleTime: Infinity,
  });

  const saveMutation = useMutation<PharmacyInfo, Error, PharmacyInfo>({
    mutationFn: async (info) => {
      localStorage.setItem(PHARMACY_INFO_KEY, JSON.stringify(info));
      return info;
    },
    onSuccess: (info) => {
      queryClient.setQueryData(["pharmacy-info"], info);
    },
  });

  return {
    info: data ?? DEFAULT_PHARMACY_INFO,
    isLoading,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
}

export function useSystemPreferences() {
  const [preferences, setPreferences] = useState<SystemPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    return {
      isDarkMode: localStorage.getItem("theme") === "dark",
      autoLogout:
        localStorage.getItem("pref_auto_logout") === null
          ? DEFAULT_PREFERENCES.autoLogout
          : localStorage.getItem("pref_auto_logout") === "true",
      autoPrint:
        localStorage.getItem("pref_auto_print") === null
          ? DEFAULT_PREFERENCES.autoPrint
          : localStorage.getItem("pref_auto_print") === "true",
      stockThreshold:
        localStorage.getItem("pref_stock_threshold") === null
          ? DEFAULT_PREFERENCES.stockThreshold
          : Number(localStorage.getItem("pref_stock_threshold")),
      defaultTax:
        localStorage.getItem("pref_default_tax") === null
          ? DEFAULT_PREFERENCES.defaultTax
          : Number(localStorage.getItem("pref_default_tax")),
    };
  });

  const setTheme = (isDark: boolean) => {
    setPreferences((prev) => ({ ...prev, isDarkMode: isDark }));
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

  const setPreference = <K extends keyof SystemPreferences>(
    key: K,
    value: SystemPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    localStorage.setItem("pref_auto_logout", String(preferences.autoLogout));
    localStorage.setItem("pref_auto_print", String(preferences.autoPrint));
    localStorage.setItem(
      "pref_stock_threshold",
      String(preferences.stockThreshold)
    );
    localStorage.setItem("pref_default_tax", String(preferences.defaultTax));
  };

  return { preferences, setTheme, setPreference, save };
}

export function useBackupHistory() {
  const [backups, setBackups] = useState<BackupHistoryItem[]>([
    {
      id: "1",
      name: "pharma_backup_2026-06-05_auto.bak",
      size: "12.4 MB",
      date: "2026-06-05 12:00",
      status: "success",
    },
    {
      id: "2",
      name: "pharma_backup_2026-06-04_manual.bak",
      size: "12.2 MB",
      date: "2026-06-04 18:30",
      status: "restored",
    },
  ]);

  const addBackup = (backup: BackupHistoryItem) => {
    setBackups((prev) => [backup, ...prev]);
  };

  const markRestored = (fileName: string) => {
    setBackups((prev) =>
      prev.map((b) =>
        b.name === fileName ? { ...b, status: "restored" as const } : b
      )
    );
  };

  return { backups, addBackup, markRestored };
}

export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}

export function formatBackupName(data: BackupResultDto) {
  const size = data.sizeBytes
    ? `${(data.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
    : "12.5 MB";
  const name =
    data.backupName ||
    `pharma_backup_${new Date().toISOString().split("T")[0]}_manual.bak`;
  const date = new Date().toISOString().replace("T", " ").substring(0, 16);
  return { size, name, date };
}
