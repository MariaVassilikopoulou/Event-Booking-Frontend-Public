import { AuthState } from "@/types/globalTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userName: null,
      userEmail: null,
      token: null,

      login: (token, userName, email) =>
        set({ isLoggedIn: true, userName, userEmail: email, token }),

      logout: () =>
        set({ isLoggedIn: false, userName: null, userEmail: null, token: null }),

      // no-op — persist middleware rehydrates automatically on mount
      loadFromStorage: () => {},
    }),
    { name: "auth-storage" }
  )
);