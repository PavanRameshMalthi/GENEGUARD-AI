import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Dna,
  FileText,
  MoreHorizontal,
  ClipboardList,
  Activity,
  Target,
  History,
  Calendar,
  Users,
  Trophy,
  Settings,
  Shield,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI', path: '/copilot', icon: Bot },
    { label: 'Genetics', path: '/genetics', icon: Dna },
    { label: 'Reports', path: '/reports', icon: FileText },
  ];

  const moreItems = [
    { label: 'Analysis', path: '/analysis', icon: Activity, desc: 'Biometric breakdown & trends' },
    { label: 'Health Assessment', path: '/assessment', icon: ClipboardList, desc: 'Clinical questionnaire' },
    { label: "Log Today's Health", path: '/tracking', icon: Activity, desc: 'Daily vitals & logs' },
    { label: 'Health Goals', path: '/goals', icon: Target, desc: 'Active targets & progress' },
    { label: 'Health Timeline', path: '/timeline', icon: History, desc: 'Longitudinal health milestones' },
    { label: 'Preventive Calendar', path: '/calendar', icon: Calendar, desc: 'Screenings & checkups' },
    { label: 'Family Factors', path: '/family', icon: Users, desc: 'Hereditary risk tracking' },
    { label: 'Achievements', path: '/achievements', icon: Trophy, desc: 'Health milestones & badges' },
    { label: 'Settings', path: '/settings', icon: Settings, desc: 'Preferences & privacy' },
  ];

  if (user?.role === 'admin') {
    moreItems.push({
      label: 'Admin Dashboard',
      path: '/admin',
      icon: Shield,
      desc: 'Platform management',
    });
  }

  const isMoreActive =
    !mainTabs.some((t) => location.pathname === t.path) &&
    moreItems.some((m) => location.pathname.startsWith(m.path));

  return (
    <>
      {/* Fixed Mobile Bottom Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#090d1f]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-colors"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {mainTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="relative flex flex-col items-center justify-center flex-1 py-1 text-center outline-none select-none transition-colors"
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 ${
                    isActive
                      ? 'font-bold text-indigo-600 dark:text-indigo-400'
                      : 'font-medium text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}

          {/* More Button */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            aria-label="Open More Navigation Options"
            className="relative flex flex-col items-center justify-center flex-1 py-1 text-center outline-none select-none transition-colors"
          >
            <div
              className={`relative p-1.5 rounded-xl transition-all ${
                isMoreActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 ${
                isMoreActive
                  ? 'font-bold text-indigo-600 dark:text-indigo-400'
                  : 'font-medium text-slate-500 dark:text-slate-400'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* "More" Drawer Modal */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 overflow-y-auto custom-scrollbar lg:hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">All Features & Tools</h3>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pb-6">
                {moreItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-700/80 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
                        <Icon size={18} />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNavigation;
