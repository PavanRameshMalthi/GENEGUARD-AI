import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const CurrentIcon = icons[theme as keyof typeof icons] || Monitor;

  return (
    <button
      onClick={cycleTheme}
      className="relative p-2.5 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-black/5 dark:shadow-black/20 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CurrentIcon className="w-5 h-5" />
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
