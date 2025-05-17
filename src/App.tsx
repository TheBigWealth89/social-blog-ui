import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import CreatePost from "./components/pages/CreatePost";
import PostDetail from "./components/pages/PostDetail";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <BrowserRouter>
      <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />
      <main className="container mx-auto px-2 md:px-4 py-8 bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
