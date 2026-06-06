export interface HealthCheckDto {
  status: string;
  timestamp: string;
  version?: string;
  database: string;
}

export interface BackupResultDto {
  backupPath: string;
  backupName: string;
  timestamp: string;
  sizeBytes: number;
}
