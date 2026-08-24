import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  fullWidth?: boolean;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '', fullWidth = false }) => {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 rounded-xl max-w-full overflow-x-auto no-scrollbar ${
        fullWidth ? 'w-full flex' : 'w-max'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 select-none cursor-pointer ${
              fullWidth ? 'flex-1' : ''
            } ${
              isActive
                ? 'text-slate-900 dark:text-white font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeSegmentedTab"
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
            <span className="relative flex items-center gap-1.5 z-10 whitespace-nowrap">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
