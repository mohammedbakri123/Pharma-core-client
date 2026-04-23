export interface HealthCheckDto {
  status: string;
  timestamp: string;
  version?: string;
  databaseStatus: string;
}

export interface BackupResultDto {
  backupPath: string;
  backupName: string;
  timestamp: string;
  sizeBytes: number;
}
