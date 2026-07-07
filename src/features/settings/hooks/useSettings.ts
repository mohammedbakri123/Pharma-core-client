import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { settingsApi } from "../api/system";

// import type { HealthCheckDto, BackupResultDto } from "@/types";

const PHARMACY_INFO_KEY = "pharmacy_info";


export function useApiHealth() {
  return useQuery({
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
  return useMutation<unknown, Error, void>({
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


