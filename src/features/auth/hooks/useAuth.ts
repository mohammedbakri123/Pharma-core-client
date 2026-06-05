import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { authApi } from "../api";
import { useAuthStore } from "@features/auth/store/authStore";
import { UserRole, type LoginRequest, type LoginResponse } from "../types";


export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout, hasRole } =
    useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    hasRole,
    isAdmin: hasRole(UserRole.Admin),
    isCashier: hasRole(UserRole.Cashier),
  };
}


export function useLogin() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      authApi.login(data) as Promise<AxiosResponse<LoginResponse>>,
    onSuccess: (response) => {
      const { token, user } = response.data;
      setAuth({ token, user });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}

import { usersApi } from "@/api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: async (data: { userName?: string; password?: string; phoneNumber?: string; address?: string }) => {
      if (!user) throw new Error("User not authenticated");
      const response = await usersApi.update(user.userId, data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Update store state so the username updates in the sidebar
      if (user && token) {
        setAuth({
          token,
          user: {
            ...user,
            userName: updatedUser.userName,
          },
        });
      }
    },
  });
}

