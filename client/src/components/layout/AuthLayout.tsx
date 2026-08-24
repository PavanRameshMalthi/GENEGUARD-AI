import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c18] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 transition-colors duration-200 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Centered Auth Card Container */}
      <div className="w-full max-w-[440px] z-10 my-auto">
        <div className="flex flex-col items-center mb-6 text-center">
          <Link to="/" className="flex items-center gap-2.5 group mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              {APP_NAME}
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            AI-Powered Preventive Clinical Intelligence
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
