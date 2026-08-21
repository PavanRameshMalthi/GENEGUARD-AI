import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isSuccess?: boolean;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, isSuccess, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);
    const errorId = textareaId ? `${textareaId}-error` : undefined;
    const helperId = textareaId ? `${textareaId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-red-500 text-xs font-normal">*Required</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full rounded-lg border bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl transition-all duration-300 px-4 py-2 outline-none dark:text-white min-h-[100px] resize-y ${
              error
                ? 'border-red-500 ring-1 ring-red-500/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : isSuccess
                ? 'border-emerald-500 ring-1 ring-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                : 'border-gray-200 dark:border-gray-700/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {error ? (
            <div className="absolute right-3 top-3 text-red-500 pointer-events-none">
              <AlertCircle size={18} />
            </div>
          ) : isSuccess ? (
            <div className="absolute right-3 top-3 text-emerald-500 pointer-events-none">
              <CheckCircle2 size={18} />
            </div>
          ) : null}
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

Textarea.displayName = 'Textarea';

export default Textarea;
