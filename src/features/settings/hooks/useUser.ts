import { usersApi } from './../api/users';
import { useAuthStore } from "@features/auth/store/authStore";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateUserRequest } from '@/types';

export function useUsersList(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: ["users-list", page, limit, search],
    queryFn: async () => {
      const res = await usersApi.getAll({ page, limit, search: search || undefined });
      return res.data;
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => usersApi.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
}


export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}