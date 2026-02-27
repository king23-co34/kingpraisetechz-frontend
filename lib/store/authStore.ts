import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, SignupData } from "@/types";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      twoFactorRequired: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post("/auth/login", { email, password });
          const { token, user, requires2FA, tempToken } = response.data;

          if (requires2FA) {
            // Store temp token for 2FA verification
            if (tempToken) {
              localStorage.setItem("tempToken", tempToken);
              localStorage.setItem("pendingUser", JSON.stringify(user));
            }
            set({ twoFactorRequired: true, isLoading: false });
            return { requires2FA: true };
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            twoFactorRequired: false,
          });
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          return { requires2FA: false };
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Login failed. Please try again.";
          toast.error(message);
          throw error;
        }
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post("/auth/signup", data);
          const { token, user, requires2FA, tempToken } = response.data;

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
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          toast.success("Account created successfully! Welcome aboard.");
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Signup failed. Please try again.";
          toast.error(message);
          throw error;
        }
      },

      verify2FA: async (code: string) => {
        set({ isLoading: true });
        try {
          const tempToken = localStorage.getItem("tempToken");
          const response = await apiClient.post(
            "/auth/verify-2fa",
            { code },
            { headers: { Authorization: `Bearer ${tempToken}` } }
          );
          const { token, user } = response.data;

          localStorage.removeItem("tempToken");
          localStorage.removeItem("pendingUser");

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            twoFactorRequired: false,
          });
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          toast.success("Authentication successful!");
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Invalid code. Please try again.";
          toast.error(message);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          twoFactorRequired: false,
        });
        delete apiClient.defaults.headers.common["Authorization"];
        localStorage.removeItem("tempToken");
        localStorage.removeItem("pendingUser");
        toast.success("Logged out successfully");
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: "kpt-auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
