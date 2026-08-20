import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1 
          className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          404
        </motion.h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved to another universe.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" size="lg" icon={<Home size={18} />}>
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" icon={<LayoutDashboard size={18} />}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
