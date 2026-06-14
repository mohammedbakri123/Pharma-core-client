import { MedicineApi } from "../api/medicines";
import {
  CreateMedicineRequest,
  GetMedicinesRequest,
  UpdateMedicineRequest,
} from "../types/Medicine";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMedicineList(params: GetMedicinesRequest) {
  return useQuery({
    queryKey: ["medicines-list", params],
    queryFn: async () => {
      const response = await MedicineApi.getMedicines(params);
      return response.data;
    },
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MedicineApi.deleteMedicine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines-list"] });
    },
  });
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicineRequest }) =>
      MedicineApi.updateMedicine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines-list"] });
    },
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMedicineRequest) =>
      MedicineApi.createMedicine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines-list"] });
    },
  });
}
