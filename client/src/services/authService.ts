import API from "./api"; // 🟢 ვტვირთავთ უკვე გამართულ API ინსტანსს api.ts-იდან

export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// რეგისტრაცია
export const registerUser = async (userData: {
  email: string;
  password: string;
  name?: string;
}) => {
  // 🟢 /auth/register ავტომატურად დაემატება https://retro-store.onrender.com/api-ს
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// შესვლა (Login)
export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};
