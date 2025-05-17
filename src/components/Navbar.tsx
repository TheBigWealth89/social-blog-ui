import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMenu, IoClose, IoSearch, IoAdd } from "react-icons/io5";
import authServices from "./services/authServices";
import { User } from "./models/user";

interface NavbarProps {
  toggleTheme: () => void;
  darkMode: boolean;
}

export default function Navbar({ toggleTheme, darkMode }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // Profile drop down
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user data when component mounts
    const currentUser = authServices.getCurrentUser();
    setUser(currentUser);

    // Listen for storage events (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        const user = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(user);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for route changes to recheck auth state
  useEffect(() => {
    const currentUser = authServices.getCurrentUser();
    setUser(currentUser);
  }, [window.location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authServices.logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <nav className="bg-white  shadow-md px-4 py-4 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-70 hover:text-gray-900  focus:outline-none"
              aria-label="Toggle menu"
            >
              <IoMenu size={24} />
            </button>

            <Link
              to="/"
              className="text-xl font-semibold font-inter text-gray-800  hover:text-gray-900 dark:hover:text-gray-200"
            >
              My Blog
            </Link>
          </div>

          {/* Middle - Search (shown on larger screens) */}
          {user && (
            <div className="hidden md:flex items-center relative flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <IoSearch className="absolute right-3 text-gray-500 dark:text-gray-400" />
            </div>
          )}

          {/* Right side - Navigation and Actions */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Mobile search button */}
            {user && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden text-gray-700 hover:text-gray-900 "
                aria-label="Toggle search"
              >
                <IoSearch size={20} />
              </button>
            )}

            {user ? (
              <>
                {/* Create Post Button */}
                <Link
                  to="/create-post"
                  className=" flex items-center px-4 py-2 text-sm font-medium text-white bg-[#3a47de] hover:bg-[#2d37b0] rounded-lg transition duration-200"
                >
                  <IoAdd size={20} className="mr-1" /> Create Post
                </Link>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      onMouseEnter={() => setIsProfileDropdownOpen(true)}
                    >
                      <img
                        src={user?.profilePicture}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#3a47de]"
                      />
                      <span className="hidden md:inline text-sm font-medium text-gray-700">
                        {user?.username}
                      </span>
                    </div>
                    {/* IsProfile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
                        onMouseLeave={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.username}
                          </p>
                        </div>
                        <Link
                          to="/create-post"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Create Post
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                        <Link
                          to="/reading-list"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Reading List
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/signup"
                className="px-4 py-2 text-base font-semibold font-[inter] border border-[#3a47de] text-[#3a47de] hover:text-white hover:bg-[#3a47de] rounded-lg transition duration-200"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search (shown when toggled) */}
        {isSearchOpen && (
          <div className=" md:hidden mt-3 px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <IoSearch className="absolute right-3 top-2.5 text-gray-500 " />
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[60%] bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl text-gray-900 dark:text-white font-semibold font-inter">
            Dev Community
          </h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* User Profile in Sidebar */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePicture || "https://via.placeholder.com/40"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#3a47de]"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 m-4 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <ul className="py-4">
          <li>
            <Link
              to="/"
              className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/create-post"
                className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Post
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/posts"
              className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              All Posts
            </Link>
          </li>
          <li>
            <Link
              to="/community"
              className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </li>
          {user && (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-6 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
