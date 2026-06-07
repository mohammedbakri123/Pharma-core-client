import { usersApi } from './../api/users';
import { useAuthStore } from "@features/auth/store/authStore";
import type {
  NewUserPayload,

} from "../types/settings";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useUsersList() {
  return useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const res = await usersApi.getAll({ limit: 100 });
      return res.data;
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: NewUserPayload) => usersApi.create(data),
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