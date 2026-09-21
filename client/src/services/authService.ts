import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // შეიცვალე შენი ბექენდის პორტის მიხედვით თუ საჭიროა

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
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// შესვლა (Login)
export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};
