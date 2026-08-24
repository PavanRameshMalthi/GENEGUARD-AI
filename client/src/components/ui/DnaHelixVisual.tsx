import React from 'react';
import { motion } from 'framer-motion';

interface DnaHelixVisualProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const DnaHelixVisual: React.FC<DnaHelixVisualProps> = ({
  className = '',
  size = 'lg',
  animated = true,
}) => {
  const dimensions = {
    sm: { width: 140, height: 180, strands: 8 },
    md: { width: 220, height: 280, strands: 12 },
    lg: { width: 340, height: 440, strands: 16 },
  }[size];

  const pairs = Array.from({ length: dimensions.strands }, (_, i) => {
    const progress = i / (dimensions.strands - 1);
    const angle = progress * Math.PI * 2.5;
    const y = 30 + progress * (dimensions.height - 60);
    const xOffset = Math.sin(angle) * (dimensions.width * 0.35);
    const depth = Math.cos(angle); // -1 (back) to +1 (front)
    const isFrontLeft = depth > 0;
    const opacity = 0.35 + (depth + 1) * 0.325; // 0.35 to 1.0
    const scale = 0.75 + (depth + 1) * 0.25;

    return {
      id: i,
      y,
      x1: dimensions.width / 2 - xOffset,
      x2: dimensions.width / 2 + xOffset,
      isFrontLeft,
      opacity,
      scale,
      depth,
    };
  });

  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute w-3/4 h-3/4 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-1/2 h-1/2 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* DNA Helix SVG */}
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          animated
            ? {
                y: [-6, 6, -6],
                rotate: [-0.5, 0.5, -0.5],
              }
            : undefined
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="dnaGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <linearGradient id="dnaGradientGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connecting Hydrogen Bonds & Nucleotides */}
        {pairs.map((pair) => (
          <g key={`bond-${pair.id}`} opacity={pair.opacity}>
            {/* Connecting Bar */}
            <line
              x1={pair.x1}
              y1={pair.y}
              x2={pair.x2}
              y2={pair.y}
              stroke="url(#dnaGradientLight)"
              strokeWidth={Math.max(1.5, pair.scale * 2.2)}
              strokeLinecap="round"
              strokeDasharray={pair.depth < 0 ? '4 3' : undefined}
            />

            {/* Left Node */}
            <circle
              cx={pair.x1}
              cy={pair.y}
              r={Math.max(3, pair.scale * 5.5)}
              fill={pair.isFrontLeft ? '#4f46e5' : '#818cf8'}
              className="dark:fill-indigo-400"
              filter="url(#softGlow)"
            />
            <circle
              cx={pair.x1}
              cy={pair.y}
              r={Math.max(1.5, pair.scale * 2.5)}
              fill="#ffffff"
              opacity="0.9"
            />

            {/* Right Node */}
            <circle
              cx={pair.x2}
              cy={pair.y}
              r={Math.max(3, pair.scale * 5.5)}
              fill={!pair.isFrontLeft ? '#4f46e5' : '#c084fc'}
              className="dark:fill-purple-400"
              filter="url(#softGlow)"
            />
            <circle
              cx={pair.x2}
              cy={pair.y}
              r={Math.max(1.5, pair.scale * 2.5)}
              fill="#ffffff"
              opacity="0.9"
            />
          </g>
        ))}

        {/* Floating Sparkle Particles */}
        <motion.circle
          cx={dimensions.width * 0.2}
          cy={dimensions.height * 0.3}
          r="2.5"
          fill="#818cf8"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={dimensions.width * 0.82}
          cy={dimensions.height * 0.65}
          r="3"
          fill="#c084fc"
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.circle
          cx={dimensions.width * 0.7}
          cy={dimensions.height * 0.2}
          r="2"
          fill="#60a5fa"
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </motion.svg>
    </div>
  );
};

export default DnaHelixVisual;
