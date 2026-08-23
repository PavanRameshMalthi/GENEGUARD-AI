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
    <Modal isOpen={isOpen} onClose={onClose} title="Log Daily Health Tracking" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Tracking Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/30 text-sm"
          />
        </div>

        {/* 1. Hydration Section */}
        <div className="p-4 rounded-2xl bg-cyan-50/40 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30 space-y-3">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-sm">
            <Droplet size={18} /> Hydration Tracking
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Water Consumed (Liters)"
              type="number"
              step="0.1"
              min="0"
              max="20"
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
              value={waterGoal}
              onChange={(e) => setWaterGoal(parseFloat(e.target.value) || 2.5)}
              required
            />
          </div>
        </div>

        {/* 2. Sleep Section */}
        <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
            <Moon size={18} /> Sleep Architecture
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              label="Total Sleep (hrs)"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={totalSleep}
              onChange={(e) => setTotalSleep(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Sleep Goal (hrs)"
              type="number"
              step="0.5"
              min="4"
              max="14"
              value={sleepGoal}
              onChange={(e) => setSleepGoal(parseFloat(e.target.value) || 8)}
              required
            />
          </div>
        </div>

        {/* 3. Physical Activity */}
        <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <Activity size={18} /> Physical Activity & Exercise
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Daily Steps Count"
              type="number"
              min="0"
              max="100000"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
              required
            />
            <Input
              label="Walking Duration (minutes)"
              type="number"
              min="0"
              max="600"
              value={walkingMinutes}
              onChange={(e) => setWalkingMinutes(parseInt(e.target.value) || 0)}
            />
            <Input
              label="Exercise Type"
              type="text"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              placeholder="e.g. Jogging, Yoga, Gym"
            />
            <Input
              label="Exercise Duration (minutes)"
              type="number"
              min="0"
              max="300"
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* 4. Nutrition Section */}
        <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
            <Apple size={18} /> Daily Nutrition
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input
              label="Total Meals"
              type="number"
              min="1"
              max="10"
              value={mealsCount}
              onChange={(e) => setMealsCount(parseInt(e.target.value) || 3)}
            />
            <Input
              label="Fruit Servings"
              type="number"
              min="0"
              max="20"
              value={fruitsServings}
              onChange={(e) => setFruitsServings(parseInt(e.target.value) || 0)}
            />
            <Input
              label="Vegetable Servings"
              type="number"
              min="0"
              max="20"
              value={vegetablesServings}
              onChange={(e) => setVegetablesServings(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={fastFood}
                  onChange={(e) => setFastFood(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                Had fast food / ultra-processed meals today
              </label>
            </div>
          </div>
        </div>

        {/* 5. Wellness & Mood */}
        <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <Heart size={18} /> Wellness & Stress
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Stress Level ({stressLevel}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Energy Level ({energyLevel}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>
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
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Personal Wellness Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today? Any specific symptoms or achievements?"
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Daily Tracking
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DailyTrackingModal;
