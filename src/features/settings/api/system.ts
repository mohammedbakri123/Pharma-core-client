import api from "../../../core/api/client";
import type { HealthCheckDto, BackupResultDto } from "@/types";


 const getHealth = () =>
  api.get<HealthCheckDto>("/health");

 const backupDatabase = (backupName?: string) =>
  api.post<BackupResultDto>("/backup", { backupName });

 const restoreDatabase = (backupFile: string) =>
  api.post("/restore", { backupFile });


export const settingsApi = {
  getHealth,
  backupDatabase,
  restoreDatabase,
};