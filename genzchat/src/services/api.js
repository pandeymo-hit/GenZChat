import axios from "axios";

// IMPORTANT: baseURL me "ec2-user@" mat rakho
export const api = axios.create({
  baseURL: "http://ec2-52-63-240-218.ap-southeast-2.compute.amazonaws.com:8800",
});

export const setAuthHeader = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
export const clearAuthHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};






// agar 404 to call krni h /v1/athentication/send-otp