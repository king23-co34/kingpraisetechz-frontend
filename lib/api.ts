// Optional helper for fetch-like requests with auth
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
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