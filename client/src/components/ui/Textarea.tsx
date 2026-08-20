import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full rounded-lg border bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl transition-all duration-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white min-h-[100px] resize-y ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 dark:border-gray-700/30 focus:border-primary-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
