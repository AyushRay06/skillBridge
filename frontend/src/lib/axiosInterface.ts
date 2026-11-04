import axios from "axios";

export const axiosAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/",
  withCredentials: true,
});

// Attach Authorization header if token exists in localStorage (essential for cross-origin setups)
axiosAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add request interceptor to include token from cookie
axiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthMe = error.config?.url?.includes("/auth/me");
      if (!isAuthMe) {
        // Clear local storage and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);
