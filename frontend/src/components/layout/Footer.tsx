import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-slate-900 dark:text-white">GeneGuard AI</span>
          </Link>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
            GeneGuard AI provides educational health insights only. It is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before making any medical decisions.
          </p>

          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-500">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-600">
            &copy; {new Date().getFullYear()} GeneGuard AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
