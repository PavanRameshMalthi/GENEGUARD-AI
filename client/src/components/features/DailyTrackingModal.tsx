import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { DailyTracking } from '@/types';
import { trackingService } from '@/services/tracking.service';
import { useToast } from '@/hooks/useToast';
import { Droplet, Moon, Activity, Apple, Heart } from 'lucide-react';

interface DailyTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DailyTracking | null;
  targetDate?: string;
}

const DailyTrackingModal: React.FC<DailyTrackingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  targetDate
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(targetDate || today);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  // Form State
  const [waterConsumed, setWaterConsumed] = useState(2.0);
  const [waterGoal, setWaterGoal] = useState(2.5);

  const [bedtime, setBedtime] = useState('23:00');
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [totalSleep, setTotalSleep] = useState(7.5);
  const [sleepGoal, setSleepGoal] = useState(8);

  const [steps, setSteps] = useState(6000);
  const [walkingMinutes, setWalkingMinutes] = useState(30);
  const [exerciseType, setExerciseType] = useState('Brisk Walking');
  const [exerciseDuration, setExerciseDuration] = useState(30);

  const [mealsCount, setMealsCount] = useState(3);
  const [fruitsServings, setFruitsServings] = useState(2);
  const [vegetablesServings, setVegetablesServings] = useState(3);
  const [fastFood, setFastFood] = useState(false);
  const [sugarIntake, setSugarIntake] = useState<'low' | 'moderate' | 'high'>('moderate');

  const [stressLevel, setStressLevel] = useState(5);
  const [mood, setMood] = useState<'great' | 'good' | 'neutral' | 'tired' | 'stressed'>('good');
  const [energyLevel, setEnergyLevel] = useState(7);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || today);
      setWaterConsumed(initialData.hydration?.waterConsumed ?? 2.0);
      setWaterGoal(initialData.hydration?.waterGoal ?? 2.5);

      setBedtime(initialData.sleep?.bedtime || '23:00');
      setWakeUpTime(initialData.sleep?.wakeUpTime || '07:00');
      setTotalSleep(initialData.sleep?.totalSleep ?? 7.5);
      setSleepGoal(initialData.sleep?.sleepGoal ?? 8);

      setSteps(initialData.physicalActivity?.steps ?? 6000);
      setWalkingMinutes(initialData.physicalActivity?.walkingMinutes ?? 30);
      setExerciseType(initialData.physicalActivity?.exerciseType || 'Brisk Walking');
      setExerciseDuration(initialData.physicalActivity?.exerciseDuration ?? 30);

      setMealsCount(initialData.nutrition?.mealsCount ?? 3);
      setFruitsServings(initialData.nutrition?.fruitsServings ?? 2);
      setVegetablesServings(initialData.nutrition?.vegetablesServings ?? 3);
      setFastFood(initialData.nutrition?.fastFood ?? false);
      setSugarIntake(initialData.nutrition?.sugarIntake || 'moderate');

      setStressLevel(initialData.wellness?.stressLevel ?? 5);
      setMood(initialData.wellness?.mood || 'good');
      setEnergyLevel(initialData.wellness?.energyLevel ?? 7);
      setNotes(initialData.wellness?.notes || '');
    } else {
      setDate(targetDate || today);
    }
  }, [initialData, targetDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<DailyTracking> = {
        date,
        hydration: {
          waterConsumed: Number(waterConsumed),
          waterGoal: Number(waterGoal),
          remainingWater: Math.max(0, Number((Number(waterGoal) - Number(waterConsumed)).toFixed(1)))
        },
        sleep: {
          bedtime,
          wakeUpTime,
          totalSleep: Number(totalSleep),
          sleepGoal: Number(sleepGoal)
        },
        physicalActivity: {
          steps: Number(steps),
          walkingMinutes: Number(walkingMinutes),
          exerciseType,
          exerciseDuration: Number(exerciseDuration)
        },
        nutrition: {
          mealsCount: Number(mealsCount),
          fruitsServings: Number(fruitsServings),
          vegetablesServings: Number(vegetablesServings),
          fastFood,
          sugarIntake
        },
        wellness: {
          stressLevel: Number(stressLevel),
          mood,
          energyLevel: Number(energyLevel),
          notes
        }
      };

      await trackingService.saveTracking(payload);
      success('Daily health tracking saved successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save daily tracking data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Today's Health" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selector */}
        <div>
          <Input
            label="Tracking Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            required
          />
        </div>

        {/* 1. Hydration Section */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/40 dark:bg-cyan-950/20 border border-cyan-100/80 dark:border-cyan-900/30 space-y-4">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-semibold text-sm">
            <Droplet size={18} />
            <span>Hydration</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Water Consumed (Liters)"
              type="number"
              step="0.1"
              min="0"
              max="20"
              placeholder="e.g. 2.0"
              value={waterConsumed}
              onChange={(e) => setWaterConsumed(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Daily Water Goal (Liters)"
              type="number"
              step="0.1"
              min="0.5"
              max="20"
              placeholder="e.g. 2.5"
              value={waterGoal}
              onChange={(e) => setWaterGoal(parseFloat(e.target.value) || 2.5)}
              required
            />
          </div>
        </div>

        {/* 2. Sleep Section */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/30 space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-sm">
            <Moon size={18} />
            <span>Sleep</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bedtime"
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              required
            />
            <Input
              label="Wake-up Time"
              type="time"
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              required
            />
            <Input
              label="Total Sleep (Hours)"
              type="number"
              step="0.5"
              min="0"
              max="24"
              placeholder="e.g. 7.5"
              value={totalSleep}
              onChange={(e) => setTotalSleep(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Sleep Goal (Hours)"
              type="number"
              step="0.5"
              min="4"
              max="14"
              placeholder="e.g. 8.0"
              value={sleepGoal}
              onChange={(e) => setSleepGoal(parseFloat(e.target.value) || 8)}
              required
            />
          </div>
        </div>

        {/* 3. Physical Activity */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
            <Activity size={18} />
            <span>Physical Activity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Daily Steps Count"
              type="number"
              min="0"
              max="100000"
              placeholder="e.g. 6000"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
              required
            />
            <Input
              label="Walking Duration (Minutes)"
              type="number"
              min="0"
              max="600"
              placeholder="e.g. 30"
              value={walkingMinutes}
              onChange={(e) => setWalkingMinutes(parseInt(e.target.value) || 0)}
            />
            <Input
              label="Exercise Type"
              type="text"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              placeholder="e.g. Brisk Walking, Yoga"
            />
            <Input
              label="Exercise Duration (Minutes)"
              type="number"
              min="0"
              max="300"
              placeholder="e.g. 30"
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* 4. Nutrition Section */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
            <Apple size={18} />
            <span>Nutrition</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Meals"
              type="number"
              min="1"
              max="10"
              placeholder="e.g. 3"
              value={mealsCount}
              onChange={(e) => setMealsCount(parseInt(e.target.value) || 3)}
            />
            <Select
              label="Sugar Intake Level"
              value={sugarIntake}
              onChange={(e) => setSugarIntake(e.target.value as any)}
              options={[
                { value: 'low', label: 'Low (Healthy)' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'high', label: 'High (Excessive Sugar)' }
              ]}
            />
            <Input
              label="Fruit Servings"
              type="number"
              min="0"
              max="20"
              placeholder="e.g. 2"
              value={fruitsServings}
              onChange={(e) => setFruitsServings(parseInt(e.target.value) || 0)}
            />
            <Input
              label="Vegetable Servings"
              type="number"
              min="0"
              max="20"
              placeholder="e.g. 3"
              value={vegetablesServings}
              onChange={(e) => setVegetablesServings(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-3">
            <input
              type="checkbox"
              id="fastFood"
              checked={fastFood}
              onChange={(e) => setFastFood(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="fastFood"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
            >
              Had fast food or ultra-processed meals today
            </label>
          </div>
        </div>

        {/* 5. Stress / Wellness */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/80 dark:border-rose-900/30 space-y-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm">
            <Heart size={18} />
            <span>Stress / Wellness</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Overall Mood"
              value={mood}
              onChange={(e) => setMood(e.target.value as any)}
              options={[
                { value: 'great', label: '😄 Great' },
                { value: 'good', label: '🙂 Good' },
                { value: 'neutral', label: '😐 Neutral' },
                { value: 'tired', label: '🥱 Tired' },
                { value: 'stressed', label: '😫 Stressed' }
              ]}
            />

            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Stress Level</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                  {stressLevel} / 10
                </span>
              </label>
              <div className="h-[42px] px-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                  aria-label="Stress Level"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Energy Level</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  {energyLevel} / 10
                </span>
              </label>
              <div className="h-[42px] px-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                  aria-label="Energy Level"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Personal Wellness Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today? Any specific symptoms or achievements?"
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors duration-200 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons (Sticky Footer) */}
        <div className="sticky bottom-0 -mx-5 sm:-mx-7 -mb-5 sm:-mb-7 px-5 sm:px-7 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 z-10">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto justify-center"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="w-full sm:w-auto justify-center"
          >
            Save Health Data
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DailyTrackingModal;
