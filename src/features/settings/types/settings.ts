export interface PharmacyInfo {
  name: string;
  license: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
}

export interface SystemPreferences {
  isDarkMode: boolean;
  autoLogout: boolean;
  autoPrint: boolean;
  stockThreshold: number;
  defaultTax: number;
}

export interface BackupHistoryItem {
  id: string;
  name: string;
  size: string;
  date: string;
  status: "success" | "restored";
}



export interface UpdateUserPayload {
  userName?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  role?: number;
}
