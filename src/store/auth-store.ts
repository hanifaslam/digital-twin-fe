import {
  Access,
  Hotels,
  LoginResponse,
} from "@/types/response/auth/auth-response";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoredUser {
  id: string;
  username: string;
  name: string;
  access: Access[] | null;
  hotels: Hotels[] | null;
  picture?: string | null;
  is_superadmin: boolean;
}

interface AuthState {
  user: StoredUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  setUser: (user: StoredUser | null) => void;
  login: (user: LoginResponse) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      login: (user) => {
        const filteredUser: StoredUser = {
          is_superadmin: user.is_superadmin,
          id: user.id,
          username: user.username,
          name: user.name,
          access: null,
          hotels: [],
          picture: user.picture || null,
        };

        set({
          user: filteredUser,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: "auth-data",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useAuthStore;
