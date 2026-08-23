import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { TimelineEvent } from '@/types';
import { timelineService } from '@/services/timeline.service';
import { 
  History, 
  ClipboardList, 
  Activity, 
  Moon, 
  Droplet, 
  FileText, 
  Target, 
  Sparkles, 
  FileBarChart,
  Calendar
} from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'All Events', icon: History },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList },
  { id: 'exercise', label: 'Exercise & Movement', icon: Activity },
  { id: 'sleep', label: 'Sleep Records', icon: Moon },
  { id: 'hydration', label: 'Hydration', icon: Droplet },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'goals', label: 'Goals', icon: Target }
];

export default function TimelinePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);

  const fetchTimeline = async (category: string) => {
    try {
      setLoading(true);
      const res = await timelineService.getTimelineEvents({ category, limit: 50 });
      if (res.data) {
        setEvents(res.data.events || []);
        setTotalEvents(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline(activeCategory);
  }, [activeCategory]);

  const getEventIcon = (type: string, category: string) => {
    if (type === 'assessment' || category === 'assessments') return <ClipboardList className="text-primary-500" size={18} />;
    if (type === 'sleep' || category === 'sleep') return <Moon className="text-indigo-500" size={18} />;
    if (type === 'hydration' || category === 'hydration') return <Droplet className="text-cyan-500" size={18} />;
    if (type === 'exercise' || category === 'exercise') return <Activity className="text-emerald-500" size={18} />;
    if (type === 'report' || category === 'reports') return <FileText className="text-purple-500" size={18} />;
    if (type === 'weekly_report') return <FileBarChart className="text-blue-500" size={18} />;
    if (type === 'goal' || category === 'goals') return <Target className="text-amber-500" size={18} />;
    return <Sparkles className="text-primary-500" size={18} />;
  };

  const getEventBadgeClass = (category: string) => {
    switch (category) {
      case 'assessments':
        return 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300';
      case 'sleep':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300';
      case 'hydration':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300';
      case 'exercise':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'reports':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300';
      case 'goals':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout title="Health Timeline">
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <History size={14} /> Chronological Health History
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Your Health Timeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            A chronological timeline of your assessments, score adjustments, daily hydration, sleep, exercise records, medical uploads, and milestones.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'bg-white/70 dark:bg-gray-900/70 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/60 dark:border-gray-800'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Timeline Event Feed */}
        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={History}
            title={activeCategory === 'all' ? 'No Health Timeline Events Yet' : `No ${activeCategory} events found`}
            description={
              activeCategory === 'all'
                ? 'Complete your first health assessment or log daily tracking metrics to automatically populate your health timeline.'
                : `You have not recorded any ${activeCategory} data yet.`
            }
          />
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-primary-200 dark:border-primary-900/40 space-y-6 my-6">
            {events.map((event) => {
              const eventDate = new Date(event.eventDate || event.createdAt || Date.now());
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div key={event._id} className="relative group">
                  {/* Node Circle on Timeline Bar */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-4 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500 shadow-sm shadow-primary-500/30 group-hover:scale-110 transition-transform">
                    {getEventIcon(event.eventType, event.category)}
                  </div>

                  {/* Event Card */}
                  <Card glass className="p-5 transition-all duration-300 hover:shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getEventBadgeClass(event.category)}`}>
                          {event.category}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                          {event.title}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Calendar size={13} /> {formattedDate}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Metadata preview pill */}
                    {event.data && Object.keys(event.data).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap gap-2 text-[11px]">
                        {event.data.healthScore !== undefined && (
                          <span className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            Score: <strong className="text-gray-900 dark:text-white">{event.data.healthScore}/100</strong>
                          </span>
                        )}
                        {event.data.bmi !== undefined && (
                          <span className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            BMI: <strong className="text-gray-900 dark:text-white">{event.data.bmi}</strong>
                          </span>
                        )}
                        {event.data.waterConsumed !== undefined && (
                          <span className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            Water: <strong className="text-gray-900 dark:text-white">{event.data.waterConsumed} L</strong>
                          </span>
                        )}
                        {event.data.totalSleep !== undefined && (
                          <span className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            Sleep: <strong className="text-gray-900 dark:text-white">{event.data.totalSleep} hrs</strong>
                          </span>
                        )}
                        {event.data.steps !== undefined && event.data.steps > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            Steps: <strong className="text-gray-900 dark:text-white">{event.data.steps.toLocaleString()}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
