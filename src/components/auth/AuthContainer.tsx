import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform-style-preserve-3d"
          >
            {isLogin ? (
              <LoginForm onFlip={handleFlip} />
            ) : (
              <SignupForm onFlip={handleFlip} />
            )}
            
            <button
              onClick={handleFlip}
              className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
             
             
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};