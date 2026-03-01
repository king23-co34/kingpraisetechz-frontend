import axios from "axios";

// ===================================
// BASE URL
// ===================================

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://king-praise-techz-backend.onrender.com/api";

// ===================================
// AXIOS CLIENT (Legacy usage)
// ===================================

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
      } catch {}
    }
  }
  return config;
});

// ===================================
// AUTH FETCH WRAPPER
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
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.token || null;
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
// API MODULES (Refactored)
// ===================================

export const projectsAPI = {
  getAll: (query?: Record<string, any>) => {
    let url = "/projects";
    if (query) {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }
    return fetchWithAuth(url);
  },
  getById: (id: string) => fetchWithAuth(`/projects/${id}`),
  create: (data: any) =>
    fetchWithAuth("/projects/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchWithAuth(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetchWithAuth(`/projects/${id}`, { method: "DELETE" }),
  uploadMilestone: (id: string, data: any) =>
    fetchWithAuth(`/projects/${id}/milestones`, { method: "POST", body: JSON.stringify(data) }),
  updateMilestone: (projectId: string, milestoneId: string, data: any) =>
    fetchWithAuth(`/projects/${projectId}/milestones/${milestoneId}`, { method: "PUT", body: JSON.stringify(data) }),
};

export const reviewsAPI = {
  getAll: (query?: Record<string, any>) => {
    let url = "/reviews";
    if (query) {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }
    return fetchWithAuth(url);
  },
  create: (data: any) =>
    fetchWithAuth("/reviews", { method: "POST", body: JSON.stringify(data) }),
  approve: (id: string) =>
    fetchWithAuth(`/reviews/${id}/approve`, { method: "POST" }),
  reject: (id: string) =>
    fetchWithAuth(`/reviews/${id}/reject`, { method: "POST" }),
};

export const teamAPI = {
  getAll: (query?: Record<string, any>) => {
    let url = "/team";
    if (query) {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }
    return fetchWithAuth(url);
  },
  getById: (id: string) => fetchWithAuth(`/team/${id}`),
  promoteToAdmin: (id: string, data: any) =>
    fetchWithAuth(`/team/${id}/promote`, { method: "POST", body: JSON.stringify(data) }),
  revokeAdmin: (id: string) =>
    fetchWithAuth(`/team/${id}/revoke-admin`, { method: "POST" }),
};

export const tasksAPI = {
  getAll: (query?: Record<string, any>) => {
    let url = "/tasks";
    if (query) {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }
    return fetchWithAuth(url);
  },
  update: (id: string, data: any) =>
    fetchWithAuth(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

export const notificationsAPI = {
  getAll: (query?: Record<string, any>) => {
    let url = "/notifications";
    if (query) {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }
    return fetchWithAuth(url);
  },
  markAllRead: () => fetchWithAuth("/notifications/mark-all-read", { method: "POST" }),
};

export const dashboardAPI = {
  getStats: (query?: Record<string, any>) => {
    let url = "/dashboard";
    if (query) {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }
    return fetchWithAuth(url);
  },
};