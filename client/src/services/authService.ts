import API from "./api"; // 🟢 ვტვირთავთ უკვე გამართულ API ინსტანსს api.ts-იდან

export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export const authService = {
  // 1. რეგისტრაცია
  register: async (userData: {
    email: string;
    password: string;
    name?: string;
  }) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },

  // 2. მეილის ვერიფიკაცია / აქტივაცია
  verifyEmail: async (data: { token: string | null; email: string | null }) => {
    const response = await API.post("/auth/verify-email", data);
    return response.data;
  },

  // 3. შესვლა (Login)
  login: async (userData: { email: string; password: string }) => {
    const response = await API.post("/auth/login", userData);
    return response.data;
  },

  // 4. პაროლის აღდგენის მოთხოვნა (Forgot Password)
  forgotPassword: async (data: { email: string }) => {
    const response = await API.post("/auth/forgot-password", data);
    return response.data;
  },

  // 5. ახალი პაროლის დაყენება (Reset Password)
  resetPassword: async (data: {
    token: string | null;
    email: string | null;
    newPassword: string;
  }) => {
    const response = await API.post("/auth/reset-password", data);
    return response.data;
  },

  // 6. Google ავტორიზაცია (დამატებულია)
  googleAuth: async (data: { credential: string }) => {
    const response = await API.post("/auth/google", data);
    return response.data;
  },
};
