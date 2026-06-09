import { usersApi } from "./../api/users";
import { useAuthStore } from "@features/auth/store/authStore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUserRequest, GetUsersRequest, UpdateUserRequest } from "@/types";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
}
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) => {
      const cleaned = { ...data };
      // backend accept password as 6 number or null, so if it is empty "" i set it to null

      if (!cleaned.password) delete cleaned.password;
      return usersApi.update(id, cleaned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
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
