import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'chart';
  rows?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  rows = 1,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded-lg';

  if (variant === 'avatar') {
    return <div className={`${baseClasses} rounded-full w-12 h-12 ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 border border-gray-100 dark:border-gray-800 rounded-2xl w-full ${className}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`${baseClasses} rounded-full w-10 h-10`} />
          <div className="space-y-2">
            <div className={`${baseClasses} h-4 w-32`} />
            <div className={`${baseClasses} h-3 w-24`} />
          </div>
        </div>
        <div className="space-y-3">
          <div className={`${baseClasses} h-4 w-full`} />
          <div className={`${baseClasses} h-4 w-5/6`} />
          <div className={`${baseClasses} h-4 w-4/6`} />
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`w-full h-64 flex items-end gap-2 ${className}`}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} w-full`}
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} h-4 ${i === rows - 1 && rows > 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
