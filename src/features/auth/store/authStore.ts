import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole, type AuthenticatedUser, type LoginResponse } from "../types";

interface AuthState {
  token: string | null;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  setAuth: (auth: LoginResponse) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (auth) =>
        set({
          token: auth.token,
          user: auth.user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),

      hasRole: (role) => get().user?.role === role,
    }),
    {
      name: "pharma-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
