import api from "@/api/client";
import type { LoginRequest, LoginResponse } from "../types";

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  getProfile: () => api.get("/auth/me"),
};
