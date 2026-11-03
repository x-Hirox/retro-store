import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://retro-store.onrender.com/api",
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
  return config;
});

// პასუხის დამუშავება და 401 შეცდომის ავტომატური დაჭერა
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || "");
    const isPublicContent = url.includes("/content/");
    if (error.response && error.response.status === 401 && !isPublicContent) {
      // თუ ტოკენი ვადაგასულია ან არასწორია
      localStorage.removeItem("token");
      // გადავამისამართოთ ლოგინზე მხოლოდ მაშინ, თუ უკვე იქ არ არის
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
