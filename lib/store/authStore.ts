"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { AuthState, User, SignupData } from "@/types";
import { authAPI } from "@/lib/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      twoFactorRequired: false,

      // ==========================
      // LOGIN
      // ==========================
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const { data } = await authAPI.login(email, password);
          const { token, user, requires2FA, tempToken } = data;

          // ---- 2FA Required ----
          if (requires2FA) {
            if (tempToken) {
              localStorage.setItem("tempToken", tempToken);
              localStorage.setItem("pendingUser", JSON.stringify(user));
            }
            set({ twoFactorRequired: true, isLoading: false });
            return { requires2FA: true };
          }

          // ---- Normal Login ----
          set({
            user,
            token,
            isAuthenticated: true,
            twoFactorRequired: false,
            isLoading: false,
          });

          toast.success("Login successful!");
          return { requires2FA: false };
        } catch (error: any) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message ||
            "Login failed. Please try again.";
          toast.error(message);
          throw error;
        }
      },

      // ==========================
      // SIGNUP
      // ==========================
      signup: async (data: SignupData) => {
        set({ isLoading: true });

        try {
          const { data: resData } = await authAPI.signup(data);
          const { token, user, requires2FA, tempToken } = resData;

          if (requires2FA) {
            if (tempToken) {
              localStorage.setItem("tempToken", tempToken);
              localStorage.setItem("pendingUser", JSON.stringify(user));
            }
            set({ twoFactorRequired: true, isLoading: false });
            return;
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success("Account created successfully!");
        } catch (error: any) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message ||
            "Signup failed. Please try again.";
          toast.error(message);
          throw error;
        }
      },

      // ==========================
      // VERIFY 2FA
      // ==========================
      verify2FA: async (code: string) => {
        set({ isLoading: true });

        try {
          const { data } = await authAPI.verify2FA(code);
          const { token, user } = data;

          localStorage.removeItem("tempToken");
          localStorage.removeItem("pendingUser");

          set({
            user,
            token,
            isAuthenticated: true,
            twoFactorRequired: false,
            isLoading: false,
          });

          toast.success("Authentication successful!");
        } catch (error: any) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message ||
            "Invalid verification code.";
          toast.error(message);
          throw error;
        }
      },

      // ==========================
      // LOGOUT
      // ==========================
      logout: () => {
        localStorage.removeItem("tempToken");
        localStorage.removeItem("pendingUser");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          twoFactorRequired: false,
        });

        toast.success("Logged out successfully");
      },

      // ==========================
      // UPDATE USER
      // ==========================
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({ user: { ...currentUser, ...userData } });
      },
    }),
    {
      name: "kpt-auth-store",

      // Only persist essential auth data
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),

      // Optional: run when store rehydrates
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);