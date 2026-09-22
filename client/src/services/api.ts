import axios from "axios";

// ვქმნით axios-ის ინსტანსს ბექენდის ძირითადი URL-ით (გადართულია Render-ის ლაივ სერვერზე)
const API = axios.create({
  baseURL: "https://retro-store.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ტოკენის ავტომატურად მიმაგრება მოთხოვნებზე
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
