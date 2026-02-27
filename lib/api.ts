import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://king-praise-techz-backend.onrender.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Token is set on the instance via defaults, but also check localStorage as fallback
    if (!config.headers["Authorization"]) {
      try {
        const authStorage = localStorage.getItem("kpt-auth-store");
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.token;
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect
      localStorage.removeItem("kpt-auth-store");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),
  signup: (data: any) => apiClient.post("/auth/signup", data),
  verify2FA: (code: string, tempToken?: string) =>
    apiClient.post("/auth/verify-2fa", { code }, {
      headers: tempToken ? { Authorization: `Bearer ${tempToken}` } : {}
    }),
  setup2FA: () => apiClient.post("/auth/setup-2fa"),
  enable2FA: (code: string) => apiClient.post("/auth/enable-2fa", { code }),
  getProfile: () => apiClient.get("/auth/profile"),
};

export const projectsAPI = {
  getAll: (params?: any) => apiClient.get("/projects", { params }),
  getById: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post("/projects", data),
  update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  uploadMilestone: (id: string, data: any) => apiClient.post(`/projects/${id}/milestones`, data),
  updateMilestone: (projectId: string, milestoneId: string, data: any) =>
    apiClient.put(`/projects/${projectId}/milestones/${milestoneId}`, data),
};

export const tasksAPI = {
  getMyTasks: () => apiClient.get("/tasks/my-tasks"),
  getByProject: (projectId: string) => apiClient.get(`/tasks/project/${projectId}`),
  create: (data: any) => apiClient.post("/tasks", data),
  update: (id: string, data: any) => apiClient.put(`/tasks/${id}`, data),
  submitDeliverable: (id: string, data: FormData) =>
    apiClient.post(`/tasks/${id}/submit`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const reviewsAPI = {
  getAll: () => apiClient.get("/reviews"),
  create: (data: any) => apiClient.post("/reviews", data),
  approve: (id: string) => apiClient.put(`/reviews/${id}/approve`),
  reject: (id: string) => apiClient.put(`/reviews/${id}/reject`),
};

export const teamAPI = {
  getAll: () => apiClient.get("/team"),
  promoteToAdmin: (id: string, data: any) => apiClient.post(`/team/${id}/promote`, data),
  revokeAdmin: (id: string) => apiClient.post(`/team/${id}/revoke-admin`),
};

export const notificationsAPI = {
  getAll: () => apiClient.get("/notifications"),
  markRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  markAllRead: () => apiClient.put("/notifications/read-all"),
};

export const dashboardAPI = {
  getStats: (role: string) => apiClient.get(`/dashboard/stats?role=${role}`),
};
