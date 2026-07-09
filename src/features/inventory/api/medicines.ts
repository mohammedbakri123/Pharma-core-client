import api from "../../../core/api/client";
import type {
  MedicineDto,
  MedicineListResponse,
  CreateMedicineRequest,
  UpdateMedicineRequest,
  GetMedicinesRequest,
  StockMovementListResponse,
} from "../types/Medicine";

const getMedicines = (params?: GetMedicinesRequest) =>
  api.get<MedicineListResponse>("/medicines", { params });

const getDeletedMedicines = (params?: GetMedicinesRequest) =>
  api.get<MedicineListResponse>("/medicines/deleted", { params });

const searchMedicines = (params: {
  q: string;
  page?: number;
  limit?: number;
}) => api.get<MedicineListResponse>("/medicines/search", { params });

const getMedicine = (id: number) => api.get<MedicineDto>(`/medicines/${id}`);

const createMedicine = (data: CreateMedicineRequest) =>
  api.post<MedicineDto>("/medicines", data);

const updateMedicine = (id: number, data: UpdateMedicineRequest) =>
  api.put<MedicineDto>(`/medicines/${id}`, data);

const deleteMedicine = (id: number) => api.delete(`/medicines/${id}`);

const restoreMedicine = (id: number) => api.post(`/medicines/${id}/restore`);

const hardDeleteMedicine = (id: number) => api.delete(`/medicines/${id}/hard`);

const getMedicineMovements = (
  id: number,
  params?: { page?: number; limit?: number },
) => api.get<StockMovementListResponse>(`/medicines/${id}/movements`, { params });

export const MedicineApi = {
  getMedicines,
  getDeletedMedicines,
  searchMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  restoreMedicine,
  hardDeleteMedicine,
  getMedicineMovements,
};
