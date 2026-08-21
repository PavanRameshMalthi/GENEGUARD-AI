import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  isVisible: boolean;
  position?: 'right' | 'top' | 'bottom';
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  isVisible,
  position = 'right',
  children
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (position === 'right') {
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.right + 10
        });
      } else if (position === 'top') {
        setCoords({
          top: rect.top - 8,
          left: rect.left + rect.width / 2
        });
      } else {
        setCoords({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2
        });
      }
    }
  }, [isVisible, position]);

  return (
    <>
      <div ref={triggerRef} className="inline-flex items-center justify-center">
        {children}
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isVisible && coords && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: position === 'right' ? -6 : 0 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.92, x: position === 'right' ? -6 : 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                transform: position === 'right' ? 'translateY(-50%)' : 'translateX(-50%)',
                zIndex: 9999
              }}
              role="tooltip"
              className="pointer-events-none whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg shadow-2xl backdrop-blur-xl bg-gray-900/95 text-white dark:bg-gray-100 dark:text-gray-900 border border-gray-700/50 dark:border-gray-300/50"
            >
              {content}
              {position === 'right' && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900/95 dark:border-r-gray-100" />
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
