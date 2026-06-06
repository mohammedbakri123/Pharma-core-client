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


export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}
