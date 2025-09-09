import axios from "axios";

// IMPORTANT: baseURL me "ec2-user@" mat rakho
export const api = axios.create({
  baseURL: "http://localhost:8800",
  // baseURL: "http://localhost:8800", # for local development
  baseURL: "/api",
});

export const setAuthHeader = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
export const clearAuthHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};

// agar 404 to call krni h /v1/athentication/send-otp
