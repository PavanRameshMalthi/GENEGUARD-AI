import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options?: { label: string; value: string }[];
  helperText?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, icon, options, helperText, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={`w-full rounded-lg border bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl transition-all duration-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white appearance-none ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700/30 focus:border-primary-500/50'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            {children}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
