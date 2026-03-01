"use client"; // Ensure this file runs only on client side

import axios from "axios";

// ===================================
// BASE URL
// ===================================

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://king-praise-techz-backend.onrender.com/api";

// ===================================
// AXIOS CLIENT
// ===================================

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("kpt-auth-store");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn("Failed to parse auth storage:", err);
      }
    }
  }
  return config;
});

// Handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("kpt-auth-store");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

// ===================================
// HELPER FETCH FUNCTION
// (Optional: still supports fetch-based requests)
// ===================================

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("kpt-auth-store");
    if (authStorage) {
      try {
        token = JSON.parse(authStorage)?.state?.token || null;
      } catch {}
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("kpt-auth-store");
      window.location.href = "/auth/login";
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

// ===================================
// AUTH API MODULE
// ===================================

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),

  signup: (data: Record<string, any>) =>
    apiClient.post("/auth/register", data),

  verify2FA: (code: string) => {
    const tempToken = typeof window !== "undefined" ? localStorage.getItem("tempToken") : null;
    if (!tempToken) throw new Error("Temp token missing");
    return apiClient.post(
      "/auth/verify-2fa",
      { code },
      { headers: { Authorization: `Bearer ${tempToken}` } }
    );
  },
};