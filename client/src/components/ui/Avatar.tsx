import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Generate a somewhat consistent background color based on the name
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
  ];
  const colorIndex = name.length % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 shadow-sm ${sizes[size]} ${
        !src ? `${bgColor} text-white` : 'bg-gray-100 dark:bg-gray-800'
      } ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
