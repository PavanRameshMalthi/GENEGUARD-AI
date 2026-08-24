import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  isSuccess?: boolean;
  icon?: React.ReactNode;
  options?: { label: string; value: string }[];
  helperText?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, isSuccess, icon, options, helperText, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);
    const errorId = selectId ? `${selectId}-error` : undefined;
    const helperId = selectId ? `${selectId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-rose-500 text-[10px] font-medium lowercase">*required</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full h-11 rounded-xl border bg-white dark:bg-slate-900 transition-colors duration-200 px-3.5 text-sm text-slate-900 dark:text-white appearance-none pr-10 outline-none ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-rose-500 ring-1 ring-rose-500/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : isSuccess
                ? 'border-emerald-500 ring-1 ring-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center gap-1.5 pointer-events-none">
            {error ? (
              <AlertCircle size={18} className="text-red-500" />
            ) : isSuccess ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
