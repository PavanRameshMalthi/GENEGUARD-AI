import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg border bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl transition-all duration-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700/30 focus:border-primary-500/50'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
