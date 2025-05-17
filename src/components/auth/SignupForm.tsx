import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { FiMail, FiImage } from "react-icons/fi";
import authServices from "../services/authServices";
interface SignupFormProps {
  onFlip: () => void;
}
export const SignupForm = ({ onFlip }: SignupFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    terms?: string;
  }>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const onChangeUsername = (e: React.FormEvent) => {
    const username = (e.target as HTMLInputElement).value;
    setUsername(username);
  };

  const onChangeEmail = (e: React.FormEvent) => {
    const email = (e.target as HTMLInputElement).value;
    setEmail(email);
  };
  const onChangePassword = (e: React.FormEvent) => {
    const password = (e.target as HTMLInputElement).value;
    setPassword(password);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  //Handler submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(true);

    // Client-side validation
    const errors: {
      username?: string;
      email?: string;
      password?: string;
      terms?: string;
    } = {};
    if (!username.trim()) {
      errors.username = "Username is required.";
    }
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
    if (!termsAccepted) {
      errors.terms = "You must accept the Terms and Privacy Policy.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSuccessful(false);
      return;
    }

    try {
      setFormErrors({}); // Clear old field errors
      let profilePictureString = "";
      if (profilePicture) {
        const reader = new FileReader();
        profilePictureString = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject("Failed to read file");
          reader.readAsDataURL(profilePicture);
        });
      }
      const response = await authServices.signup(
        username,
        email,
        password,
        profilePictureString
      );
      console.log("Signup successful:", response);
    } catch (error) {
      const resData = (error as any)?.response?.data;

      if (resData?.errors) {
        // structured field errors
        setFormErrors({
          username: resData.errors.username,
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
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-2">Join our community</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label
            htmlFor="signup-username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={onChangeUsername}
              className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                formErrors.username ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="cooluser123"
            />
          </div>

          {formErrors.username && (
            <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label
            htmlFor="signup-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={onChangeEmail}
              className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="email@example.com"
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
            htmlFor="signup-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="signup-password"
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
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label
            htmlFor="signup-avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Profile Picture (optional)
          </label>
          <div className="mt-1 flex items-center">
            <div className="relative group">
              {profilePicture ? (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiImage className="text-gray-400 text-xl" />
                </div>
              )}
              <input
                id="signup-avatar"
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleAvatarChange}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                <span className="text-white text-xs text-center">Upload</span>
              </div>
            </div>
            <label
              htmlFor="signup-avatar"
              className="ml-4 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Choose a photo
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center"
        >
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            checked={termsAccepted}
            onChange={handleTermsChange}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </label>
        </motion.div>
        {formErrors.terms && (
          <p className="text-red-500 text-sm mt-1">{formErrors.terms}</p>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          Sign Up
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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onFlip}
            className="text-purple-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
