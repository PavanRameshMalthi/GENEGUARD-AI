import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-400/20 dark:bg-primary-900/20 blur-3xl" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 lg:p-24 relative">
          <div className="max-w-md w-full relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-gray-700/30">
                <Shield className="h-10 w-10 text-primary-500" />
              </div>
              <span className="font-bold text-3xl tracking-tight text-gray-900 dark:text-white">GeneGuard AI</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Unlock the power of your genetic data.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Advanced analysis and personalized health recommendations tailored to your unique DNA profile. Secure, private, and insightful.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-black/5 dark:shadow-black/20"
          >
            {/* Mobile logo (visible only on small screens) */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary-500" />
                <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">GeneGuard AI</span>
              </Link>
            </div>
            
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
