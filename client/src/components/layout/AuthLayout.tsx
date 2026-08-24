import React from 'react';
import { Shield, Dna } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080c18] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Auth Card Container (Reference Image 2) */}
      <div className="w-full max-w-[420px] z-10 my-auto py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
