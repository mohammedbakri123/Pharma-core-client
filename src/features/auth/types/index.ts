export enum UserRole {
  Admin = 1,
  Cashier = 2,
}

export interface User {
  userId: number;
  userName: string;
  phoneNumber: string | null;
  address: string | null;
  role: UserRole;
  createdAt: string | null;
}

export interface AuthenticatedUser {
  userId: number;
  userName: string;
  role: UserRole;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}