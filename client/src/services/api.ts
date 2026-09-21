import axios from "axios";

// ვქმნით axios-ის ინსტანსს ჩვენი ბექენდის ძირითადი URL-ით
const API = axios.create({
  baseURL: "http://localhost:5000/api", // მიუთითე შენი ბექენდის პორტი, თუ განსხვავებულია
  headers: {
    "Content-Type": "application/json",
  },
});

// (სურვილისამებრ) ტოკენის ავტომატურად მიმაგრება მოთხოვნებზე, როცა იუზერი გაივლის ავტორიზაციას
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
