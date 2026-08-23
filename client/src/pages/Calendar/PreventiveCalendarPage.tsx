import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import { calendarService } from '@/services/calendar.service';
import { PreventiveEvent, RecommendedScreening } from '@/types';
import { useToast } from '@/hooks/useToast';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Trash2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Stethoscope,
  Syringe,
  FileCheck2,
  MapPin,
  UserCheck
} from 'lucide-react';

export default function PreventiveCalendarPage() {
  const [events, setEvents] = useState<PreventiveEvent[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState<Partial<PreventiveEvent>>({
    title: '',
    category: 'screening',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    frequency: 'annual',
    doctorName: '',
    location: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const [eventsRes, recsRes] = await Promise.allSettled([
        calendarService.getEvents({ month: selectedMonth, year: selectedYear }),
        calendarService.getRecommendedScreenings()
      ]);

      if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
        setEvents(eventsRes.value.data);
      }
      if (recsRes.status === 'fulfilled' && recsRes.value.data) {
        setRecommendations(recsRes.value.data);
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [selectedMonth, selectedYear]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) {
      showError('Please provide a title and date');
      return;
    }
    setSaving(true);
    try {
      await calendarService.createEvent(eventForm);
      success('Preventive checkup added to calendar!');
      setIsModalOpen(false);
      setEventForm({
        title: '',
        category: 'screening',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        frequency: 'annual',
        doctorName: '',
        location: '',
        notes: ''
      });
      fetchCalendarData();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRecommendation = async (rec: RecommendedScreening) => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + (rec.recommendedMonthsAhead || 1));
    const dateStr = targetDate.toISOString().split('T')[0];

    try {
      await calendarService.createEvent({
        title: rec.title,
        category: rec.category,
        description: rec.description,
        date: dateStr,
        frequency: rec.frequency as any,
        isAiRecommended: true,
        riskFactorTag: rec.riskFactorTag
      });
      success(`Added "${rec.title}" to calendar for ${targetDate.toLocaleDateString()}!`);
      fetchCalendarData();
    } catch {
      showError('Failed to add screening to calendar');
    }
  };

  const handleToggleStatus = async (ev: PreventiveEvent) => {
    const nextStatus = ev.status === 'completed' ? 'scheduled' : 'completed';
    try {
      await calendarService.updateEvent(ev._id, { status: nextStatus });
      success(nextStatus === 'completed' ? 'Marked screening as completed! 🎉' : 'Screening rescheduled');
      fetchCalendarData();
    } catch {
      showError('Failed to update event status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this scheduled screening?')) return;
    try {
      await calendarService.deleteEvent(id);
      success('Event deleted');
      fetchCalendarData();
    } catch {
      showError('Failed to delete event');
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'screening': return <FileCheck2 size={16} className="text-primary-500" />;
      case 'vaccination': return <Syringe size={16} className="text-emerald-500" />;
      case 'doctor_visit': return <Stethoscope size={16} className="text-purple-500" />;
      case 'lab_test': return <Sparkles size={16} className="text-amber-500" />;
      default: return <CalendarIcon size={16} className="text-blue-500" />;
    }
  };

  return (
    <DashboardLayout title="Preventive Health Calendar">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <CalendarIcon size={14} /> Preventive Health Schedule
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Screenings & Checkup Calendar
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/api/calendar/export-ics"
              download="geneguard-health-calendar.ics"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Download size={14} /> Sync (.ics)
            </a>
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={15} />}>
              Add Checkup
            </Button>
          </div>
        </div>

        <DisclaimerBanner />

        {/* AI Recommendations Panel */}
        {recommendations.length > 0 && (
          <Card glass className="p-6 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20 border-primary-100 dark:border-primary-900/40">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm mb-3">
              <Sparkles size={18} /> Recommended Preventive Screenings for Your Age & Biometrics
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-800 flex flex-col justify-between space-y-3 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(rec.category)}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                        {rec.riskFactorTag}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs">
                      {rec.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {rec.reason}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddRecommendation(rec)}
                    icon={<Plus size={13} />}
                    className="w-full text-xs"
                  >
                    Add to Calendar
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Month Navigation & Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {monthNames[selectedMonth - 1]} {selectedYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <span className="text-xs text-gray-400">
            {events.length} screenings scheduled
          </span>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-3">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title={`No Screenings in ${monthNames[selectedMonth - 1]} ${selectedYear}`}
            description="You don't have any medical checkups, screenings, or appointments scheduled for this month."
            action={{ label: 'Schedule Checkup', onClick: () => setIsModalOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => {
              const isCompleted = ev.status === 'completed';
              const isOverdue = ev.status === 'overdue';

              return (
                <Card key={ev._id} glass className="p-5 flex flex-col justify-between transition-all hover:shadow-md">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-primary-50 dark:bg-primary-950/40 shrink-0">
                          {getCategoryIcon(ev.category)}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block capitalize">
                            {ev.category.replace('_', ' ')} {ev.isAiRecommended && '• AI Recommended'}
                          </span>
                          <h3 className={`font-bold text-base ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {ev.title}
                          </h3>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : isOverdue
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}>
                        {ev.status}
                      </span>
                    </div>

                    {ev.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {ev.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-4">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {ev.date} at {ev.time || '09:00'}
                      </span>
                      {ev.doctorName && (
                        <span className="flex items-center gap-1">
                          <UserCheck size={13} /> Dr. {ev.doctorName}
                        </span>
                      )}
                      {ev.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {ev.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleToggleStatus(ev)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                        isCompleted
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      {isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    </button>

                    <button
                      onClick={() => handleDelete(ev._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Event Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Schedule Preventive Checkup</h3>

              <form onSubmit={handleCreateEvent} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Checkup Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Blood Chemistry & Lipid Profile"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    >
                      <option value="screening">Diagnostic Screening</option>
                      <option value="vaccination">Vaccination / Immunization</option>
                      <option value="doctor_visit">Doctor Consultation</option>
                      <option value="lab_test">Laboratory Test</option>
                      <option value="lifestyle">Lifestyle / Wellness Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                    <select
                      value={eventForm.frequency}
                      onChange={(e) => setEventForm({ ...eventForm, frequency: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    >
                      <option value="once">One-Time</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="semi-annual">Semi-Annual</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Doctor / Specialist</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Sarah Jenkins"
                      value={eventForm.doctorName}
                      onChange={(e) => setEventForm({ ...eventForm, doctorName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Clinic / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Memorial Hospital Lab 3"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={saving}>
                    Save Checkup
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
