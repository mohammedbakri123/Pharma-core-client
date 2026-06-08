import { usersApi } from "./../api/users";
import { useAuthStore } from "@features/auth/store/authStore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUserRequest, GetUsersRequest } from "@/types";

export function useUsersList(params: GetUsersRequest) {
  return useQuery({
    queryKey: ["users-list", params],
    queryFn: async () => {
      const response = await usersApi.getAll(params);
      return response.data;
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
