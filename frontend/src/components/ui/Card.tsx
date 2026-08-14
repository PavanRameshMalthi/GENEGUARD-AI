import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border p-6',
          glass 
            ? 'glass-panel dark:bg-slate-900/70 dark:border-slate-700' 
            : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
