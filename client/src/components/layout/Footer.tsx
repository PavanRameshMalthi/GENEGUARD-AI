import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { APP_NAME } from '@/utils/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              AI-powered preventive healthcare and clinical health intelligence platform.
            </p>
          </div>

          {/* Core Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <Link
              to="/dashboard"
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/assessment"
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Health Assessment
            </Link>
            <Link
              to="/tracking"
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Daily Tracking
            </Link>
            <Link
              to="/copilot"
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              AI Health Coach
            </Link>
          </nav>
        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} GeneGuard AI. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xl">
            Disclaimer: GeneGuard AI provides educational wellness insights and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
