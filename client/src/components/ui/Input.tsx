import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSuccess?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
  numericOnly?: boolean;
  integerOnly?: boolean;
  allowDecimals?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      isSuccess,
      icon,
      helperText,
      id,
      type = 'text',
      numericOnly,
      integerOnly,
      allowDecimals,
      onKeyDown,
      onPaste,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    const isNumeric = type === 'number' || numericOnly || integerOnly;
    const allowsDec = allowDecimals ?? (type === 'number' && !integerOnly);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isNumeric) {
        // Prevent minus sign, plus sign, exponent (e/E), and spaces
        if (['-', '+', 'e', 'E', ' '].includes(e.key)) {
          e.preventDefault();
          return;
        }

        // Prevent decimal point if integers only
        if ((integerOnly || allowsDec === false) && (e.key === '.' || e.key === ',')) {
          e.preventDefault();
          return;
        }

        // Prevent multiple decimal points
        if ((e.key === '.' || e.key === ',') && e.currentTarget.value.includes('.')) {
          e.preventDefault();
          return;
        }
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (isNumeric) {
        const text = e.clipboardData.getData('text');
        // Check if pasted text contains invalid characters
        if (integerOnly) {
          if (!/^\d+$/.test(text.trim())) {
            e.preventDefault();
            const clean = text.replace(/\D/g, '');
            if (clean) {
              document.execCommand('insertText', false, clean);
            }
            return;
          }
        } else {
          if (!/^\d*\.?\d*$/.test(text.trim())) {
            e.preventDefault();
            let clean = text.replace(/[^0-9.]/g, '');
            const parts = clean.split('.');
            if (parts.length > 2) {
              clean = parts[0] + '.' + parts.slice(1).join('');
            }
            if (clean) {
              document.execCommand('insertText', false, clean);
            }
            return;
          }
        }
      }

      if (onPaste) {
        onPaste(e);
      }
    };

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-rose-500 text-[10px] font-medium lowercase">*required</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full h-11 rounded-xl border bg-white dark:bg-slate-900 transition-colors duration-200 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none ${
              icon ? 'pl-10' : ''
            } ${
              error || (isSuccess && !icon) ? 'pr-10' : ''
            } ${
              error
                ? 'border-rose-500 ring-1 ring-rose-500/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : isSuccess
                ? 'border-emerald-500 ring-1 ring-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {error ? (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none">
              <AlertCircle size={18} />
            </div>
          ) : isSuccess ? (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
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

Input.displayName = 'Input';

export default Input;
