import axios from "axios";

const DEFAULT_API_URL = "https://retro-store.onrender.com/api";

function resolveApiBaseUrl(): string {
  const raw = String(import.meta.env.VITE_API_URL || DEFAULT_API_URL).trim();
  const trimmed = raw.replace(/\/+$/, "");
  if (!trimmed) return DEFAULT_API_URL;
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// მოთხოვნის გაგზავნისას ტოკენის მიმაგრება
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    const headers = config.headers as { delete?: (key: string) => void };
    headers.delete?.("Content-Type");
  }
  return config;
});

// პასუხის დამუშავება და 401 შეცდომის ავტომატური დაჭერა
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || "");
    const isPublicContent = url.includes("/content/");
    if (error.response && error.response.status === 401 && !isPublicContent) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
