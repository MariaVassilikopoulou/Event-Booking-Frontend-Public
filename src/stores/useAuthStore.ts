import { AuthState } from "@/types/globalTypes";
import {create} from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    userName: null,
    userEmail: null,
    token: null,
  
    login: (token, userName, email) => {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", email);
  
      set({
        isLoggedIn: true,
        userName,
        userEmail: email,
        token,
      });
    },
  
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
  
      set({
        isLoggedIn: false,
        userName: null,
        userEmail: null,
        token: null,
      });
    },
  
    
    loadFromStorage: () => {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");
  
      if (token && userName) {
        set({
          isLoggedIn: true,
          token,
          userName,
          userEmail,
        });
      }
    },
  }));