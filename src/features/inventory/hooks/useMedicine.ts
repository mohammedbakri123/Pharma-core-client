import { MedicineApi } from "@/api";
import { GetMedicinesRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useMedicineList(params: GetMedicinesRequest) {
  return useQuery({
    queryKey: ["users-list", params],
    queryFn: async () => {
      const response = await MedicineApi.getMedicines(params);
      return response.data;
    },
  });
}
