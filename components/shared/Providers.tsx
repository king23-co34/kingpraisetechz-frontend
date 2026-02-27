"use client";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api";

export function Providers({ children }: { children: ReactNode }) {
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return <>{children}</>;
}
