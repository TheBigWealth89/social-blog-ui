import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:2011/api/auth",
  withCredentials: true, //send cookies
});
let accessToken: string | null = null;
const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Attach access token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    // For login requests, create a clean config without any Authorization
    if (config.url?.endsWith('/login')) {
      const cleanConfig = { ...config };
      delete cleanConfig.headers.Authorization;
      return cleanConfig;
    }

    // For other requests, add Authorization only if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Refresh access token if expired
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          "http://localhost:2011/api/auth/refresh",
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        if (
          axios.isAxiosError(refreshErr) &&
          refreshErr.response?.status === 403
        ) {
          alert("Session invalid or token reused. Please log in again.");
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

class AuthServices {
  async signup(
    username: string,
    email: string,
    password: string,
    profilePicture: string
  ) {
    try {
      const response = await axiosInstance.post("/register", {
        username,
        email,
        password,
        profilePicture,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      setAccessToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  logout() {
    axiosInstance.post("/logout", {});
    setAccessToken(null);
    localStorage.removeItem("user");
  }
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}
export default new AuthServices();
