import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
            error && 'border-red-500 focus-visible:ring-red-500/50 focus-visible:border-red-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
