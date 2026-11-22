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
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const headers = config.headers;
  if (token && headers) {
    headers.Authorization = `Bearer ${token}`;
  }
  const isForm =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isForm && headers) {
    if (typeof headers.delete === "function") {
      headers.delete("Content-Type");
      headers.delete("content-type");
    } else {
      delete (headers as { [key: string]: unknown })["Content-Type"];
      delete (headers as { [key: string]: unknown })["content-type"];
    }
  } else if (headers && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
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
