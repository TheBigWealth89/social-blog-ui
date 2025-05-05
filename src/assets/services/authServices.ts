import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:2011/api/auth",
  withCredentials: true, //send cookies
});

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
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  logout() {
    localStorage.removeItem("user");
  }
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}
export default new AuthServices();
