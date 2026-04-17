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
      isAdmin: false,

      login: (token, userName, email, isAdmin) =>
        set({ isLoggedIn: true, userName, userEmail: email, token, isAdmin }),

      logout: () =>
        set({ isLoggedIn: false, userName: null, userEmail: null, token: null, isAdmin: false }),

      // no-op — persist middleware rehydrates automatically on mount
      loadFromStorage: () => {},
    }),
    { name: "auth-storage" }
  )
);