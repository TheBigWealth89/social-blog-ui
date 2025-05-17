import axios from "axios";
// Create a separate instance for auth operations that don't need tokens
const authAxios = axios.create({
  baseURL: "http://localhost:2011/api/auth",
  withCredentials: true,
});

// Main instance for authenticated requests
const axiosInstance = axios.create({
  baseURL: "http://localhost:2011/api/auth",
  withCredentials: true,
});

// Update token storage to use localStorage
export const setAccessToken = (token: string | null) => {
  console.log(
    "🔐 Setting access token:",
    token ? "New token being stored" : "Clearing token"
  );
  if (token) {
    localStorage.setItem("accessToken", token);
    console.log("💾 Token saved to localStorage");
  } else {
    localStorage.removeItem("accessToken");
    console.log("🗑️ Token removed from localStorage");
  }
};

export const getAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  console.log(
    "🔍 Getting access token:",
    token ? "Token found" : "No token in storage"
  );
  return token;
};

// Add token to requests on the main instance
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url, "Method:", config.method);

    // Initialize headers
    config.headers = config.headers || {};
    config.headers["Content-Type"] = "application/json";

    // Add token if available
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Added token to request");
    }

    console.log("Final headers:", JSON.stringify(config.headers, null, 2));
    return config;
  },
  (err) => Promise.reject(err)
);

// Refresh access token if expired
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    console.log("Response error:", {
      status: err.response?.status,
      url: originalRequest?.url,
      headers: originalRequest?.headers,
    });

    if (err.response?.status === 401 && !originalRequest._retry) {
      console.log("Token expired, attempting to refresh...");
      originalRequest._retry = true;

      try {
        console.log("Making refresh token request...");
        const { data } = await axios.post(
          "http://localhost:2011/api/auth/refresh",
          {}, // Empty body
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Refresh token response:", {
          success: !!data.accessToken,
          responseData: data,
        });

        if (!data.accessToken) {
          console.error("No access token received in refresh response");
          throw new Error("No access token received");
        }

        setAccessToken(data.accessToken);
        console.log("New access token set successfully:", {
          tokenExists: !!data.accessToken,
          tokenFirstChars: data.accessToken.substring(0, 10) + "...",
        });

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`; // Use new token directly
        console.log("Updated original request with new token");

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token error:", {
          status: axios.isAxiosError(refreshErr)
            ? refreshErr.response?.status
            : "unknown",
          data: axios.isAxiosError(refreshErr)
            ? refreshErr.response?.data
            : "unknown",
          message:
            refreshErr instanceof Error ? refreshErr.message : "unknown error",
        });
        if (
          axios.isAxiosError(refreshErr) &&
          refreshErr.response?.status === 403
        ) {
          console.log("Session invalid or token reused, redirecting to login");
          localStorage.removeItem("user"); // Clear user data
          setAccessToken(null); // Clear access token
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
  getAccessToken() {
    return getAccessToken();
  }

  async signup(
    username: string,
    email: string,
    password: string,
    profilePicture: string
  ) {
    try {
      const response = await authAxios.post("/register", {
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
      const response = await authAxios.post("/login", {
        email,
        password,
      });
      // console.log("Login response:", response.data);
      if (!response.data.accessToken) {
        throw new Error("No access token received from server");
      }
      // Store access token
      setAccessToken(response.data.accessToken);
      // Store user data in localStorage
      const userData = { ...response.data.user };
      console.log("Storing user data:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  }

  async logout() {
    try {
      await axiosInstance.post("/logout", {});
      setAccessToken(null);
      localStorage.removeItem("user");
      // Redirect to login page after successful logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local data even if server request fails
      setAccessToken(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem("user");
      if (!user || user === "undefined") return null;
      return JSON.parse(user);
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      return null;
    }
  }
}

export default new AuthServices();
