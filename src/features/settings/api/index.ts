import {
  getHealth,
  backupDatabase,
  restoreDatabase,
  usersApi,
} from "@/api";
import type { NewUserPayload } from "../types";

export const settingsApi = {
  getHealth,
  backupDatabase,
  restoreDatabase,
  getUsers: (params?: { page?: number; limit?: number; role?: number; search?: string }) =>
    usersApi.getAll(params),
  createUser: (data: NewUserPayload) =>
    usersApi.create({
      userName: data.userName,
      password: data.password,
      phoneNumber: data.phoneNumber,
      address: data.address,
      role: data.role,
    }),
  deleteUser: (id: number) => usersApi.delete(id),
  updateUser: (id: number, data: Partial<NewUserPayload>) =>
    usersApi.update(id, data),
};
