import api from "./client";
import type { HealthCheckDto, BackupResultDto } from "@/types";

export const getHealth = () =>
  api.get<HealthCheckDto>("/health");

export const backupDatabase = (backupName?: string) =>
  api.post<BackupResultDto>("/backup", { backupName });

export const restoreDatabase = (backupFile: string) =>
  api.post("/restore", { backupFile });
