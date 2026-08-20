import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary:
        'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-xl shadow-primary-500/20',
      secondary:
        'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500 shadow-xl shadow-accent-500/20',
      ghost:
        'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-gray-500',
      danger:
        'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-xl shadow-red-500/20',
      outline:
        'border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-700 dark:text-gray-200 focus:ring-primary-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
