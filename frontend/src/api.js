import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.error(
        "Token kedaluwarsa atau tidak valid! Melakukan auto-logout."
      );
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
