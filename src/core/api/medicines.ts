import api from "./client";
import type {
  MedicineDto,
  MedicineListResponse,
  CreateMedicineRequest,
  UpdateMedicineRequest,
} from "@/types";

export const getMedicines = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  unit?: number;
  categoryId?: number;
}) => api.get<MedicineListResponse>("/medicines", { params });

export const getDeletedMedicines = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  unit?: number;
  categoryId?: number;
}) => api.get<MedicineListResponse>("/medicines/deleted", { params });

export const searchMedicines = (params: {
  q: string;
  page?: number;
  limit?: number;
}) => api.get<MedicineListResponse>("/medicines/search", { params });

export const getMedicine = (id: number) =>
  api.get<MedicineDto>(`/medicines/${id}`);

export const createMedicine = (data: CreateMedicineRequest) =>
  api.post<MedicineDto>("/medicines", data);

export const updateMedicine = (id: number, data: UpdateMedicineRequest) =>
  api.put<MedicineDto>(`/medicines/${id}`, data);

export const deleteMedicine = (id: number) =>
  api.delete(`/medicines/${id}`);

export const restoreMedicine = (id: number) =>
  api.post(`/medicines/${id}/restore`);

export const hardDeleteMedicine = (id: number) =>
  api.delete(`/medicines/${id}/hard`);
