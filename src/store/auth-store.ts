import {
  Access,
  LoginResponse,
} from "@/types/response/auth/auth-response";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoredUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role_name: string;
  role_id: string;
  access: Access[] | null;
}

interface AuthState {
  user: StoredUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  setUser: (user: StoredUser | null) => void;
  login: (user: LoginResponse & { access?: Access[] }) => void;
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
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role_name: user.role_name,
          role_id: user.role_id,
          access: user.access || null,
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
