import { UserRole } from "@features/auth/types";

export interface UserDto {
  userId: number;
  userName: string;
  phoneNumber: string | null;
  address: string | null;
  role: UserRole;
  createdAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface UserListResponse {
  users: UserDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateUserRequest {
  userName: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  userName?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  role?: UserRole;
}
