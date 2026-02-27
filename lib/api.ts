// lib/api.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://king-praise-techz-backend.onrender.com/api";

// ==============================
// AUTH FETCH WRAPPER
// ==============================

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const authStorage = localStorage.getItem("kpt-auth-store");
  let token: string | null = null;

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      token = parsed?.state?.token || null;
    } catch {}
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
    if (res.status === 401) {
      localStorage.removeItem("kpt-auth-store");
      window.location.href = "/auth/login";
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

// ==============================
// API MODULES
// ==============================

export const projectsAPI = {
  getAll: () => fetchWithAuth("/projects"),
  getById: (id: string) => fetchWithAuth(`/projects/${id}`),
  create: (data: any) =>
    fetchWithAuth("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchWithAuth(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchWithAuth(`/projects/${id}`, {
      method: "DELETE",
    }),
};

export const reviewsAPI = {
  getAll: () => fetchWithAuth("/reviews"),
  create: (data: any) =>
    fetchWithAuth("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const teamAPI = {
  getAll: () => fetchWithAuth("/team"),
  getById: (id: string) => fetchWithAuth(`/team/${id}`),
};

export const tasksAPI = {
  getAll: () => fetchWithAuth("/tasks"),
  update: (id: string, data: any) =>
    fetchWithAuth(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const notificationsAPI = {
  getAll: () => fetchWithAuth("/notifications"),
};

export const dashboardAPI = {
  getStats: () => fetchWithAuth("/dashboard"),
};