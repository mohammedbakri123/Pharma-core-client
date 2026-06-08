import api from "../../../core/api/client";
import type {
  UserDto,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersRequest,
} from "@/types";

export const usersApi = {
  getAll: (params?: GetUsersRequest) =>
    api.get<UserListResponse>("/users", { params }),

  create: (data: CreateUserRequest) => api.post<UserDto>("/users", data),

  update: (id: number, data: UpdateUserRequest) =>
    api.put<UserDto>(`/users/${id}`, data),

  delete: (id: number) => api.delete(`/users/${id}`),

  hardDelete: (id: number) => api.delete(`/users/${id}/hard`),
};
