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
