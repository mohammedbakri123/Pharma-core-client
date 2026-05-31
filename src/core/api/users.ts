import api from "./client";
import type {
  UserDto,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types";

export const usersApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    role?: number;
    search?: string;
  }) => api.get<UserListResponse>("/users", { params }),

  create: (data: CreateUserRequest) =>
    api.post<UserDto>("/users", data),

  update: (id: number, data: UpdateUserRequest) =>
    api.put<UserDto>(`/users/${id}`, data),

  delete: (id: number) => api.delete(`/users/${id}`),

  hardDelete: (id: number) =>
    api.delete(`/users/${id}/hard`),
};
