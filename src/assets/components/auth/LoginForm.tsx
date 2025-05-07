// components/auth/LoginForm.tsx
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import AuthServices from "../../services/authServices";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onFlip: () => void;
}

export const LoginForm = ({ onFlip }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  const onChangeEmail = (e: React.FormEvent) => {
    const email = (e.target as HTMLInputElement).value;
    setEmail(email);
  };
  const onChangePassword = (e: React.FormEvent) => {
    const password = (e.target as HTMLInputElement).value;
    setPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setFormErrors({});
    
    // Client-side validation
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format.";
    }
    if (!password.trim()) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSuccessful(false);
      return;
    }
    
    try {
      setSuccessful(true); //Clear form error 
      const response = await AuthServices.login(email, password);
      navigate("/homePage");
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error);

      const resData = (error as any)?.response?.data;

      if (resData?.errors && typeof resData.errors === "object") {
        // structured field errors
        setFormErrors({
          email: resData.errors.email,
          password: resData.errors.password,
        });
      } else if (resData?.error) {
        // general single error (non-field-specific)
        setMessage(resData.error);
      } else {
        setMessage("Something went wrong!");
      }

      setSuccessful(false);
    }
  };

  return (
    <div className="p-8 relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Login to your account</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label
            htmlFor="login-identifier"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              id="login-identifier"
              type="text"
              value={email}
              onChange={onChangeEmail}
              className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="username or email@example.com"
            />
          </div>
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={onChangePassword}
              className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="••••••••"
            />
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            Forgot password?
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          Login
        </motion.button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 p-3 rounded-lg text-center ${
              successful
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
            role="alert"
          >
            {message}
          </motion.div>
        )}
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Google
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            GitHub
          </button>
        </div> */}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onFlip}
            className="text-purple-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
