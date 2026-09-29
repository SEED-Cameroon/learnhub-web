import { apiClient } from "./apiClient";

const TOKEN_KEY = "lhc_token";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const loginUser = async (email, password) => {
  const data = await apiClient.post("/auth/login", {
    email,
    password,
  });

  return data;
};

export const getCurrentUser = async () => {
  return apiClient.get("/auth/me");
};