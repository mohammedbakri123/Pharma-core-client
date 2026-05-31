import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { authApi } from "../api";
import { useAuthStore } from "@features/auth/store/authStore";
import type { LoginRequest, LoginResponse } from "../types";

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
