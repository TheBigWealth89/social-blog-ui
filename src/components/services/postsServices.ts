import axios from "axios";
import { Post } from "../models/posts";
import authServices, { setAccessToken } from "./authServices";

const axiosInstance = axios.create({
  baseURL: "http://localhost:2011/api/posts",
  withCredentials: true, //send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Single interceptor for handling authorization
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authServices.getAccessToken();
    console.log(
      "🔑 Request interceptor - Token status:",
      token ? "Present" : "Missing"
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "📤 Adding token to request:",
        `Bearer ${token.substring(0, 15)}...`
      );
    } else {
      console.warn("⚠️ No access token found for request");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("🔄 Response error status:", error.response?.status);
    console.log("🔄 Original request URL:", originalRequest?.url);

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 Token expired, attempting refresh...");
      originalRequest._retry = true;

      try {
        console.log("📡 Making refresh token request...");
        const { data } = await axios.post(
          "http://localhost:2011/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        if (data.accessToken) {
          console.log("✅ Refresh successful, got new token");
          setAccessToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          console.log("🔄 Retrying original request with new token");
          return axiosInstance(originalRequest);
        } else {
          console.warn("⚠️ Refresh response missing access token");
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 403
        ) {
          console.log("🚪 Session expired, logging out...");
          authServices.logout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class postsServices {
  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await axiosInstance.get<Post[]>("/");
      return response.data;
    } catch (error) {
      console.log("Error fetching posts:", error);
      throw error;
    }
  }

  async getPost(id: string): Promise<Post> {
    try {
      const response = await axiosInstance.get<Post>(`/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error fetching post:", error);
      throw error;
    }
  }

  async createPost(data: Partial<Post>): Promise<Post> {
    try {
      const response = await axiosInstance.post<Post>("/", data);
      return response.data;
    } catch (error) {
      console.log("Error creating post:", error);
      throw error;
    }
  }
}

export default new postsServices();
