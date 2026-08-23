import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { HealthGoal } from '@/types';
import { goalService } from '@/services/goal.service';
import { useToast } from '@/hooks/useToast';
import { Target, Sparkles } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  goalToEdit?: HealthGoal | null;
}

const PRESET_GOALS = [
  { title: 'Drink 2.5 L water daily', category: 'hydration', target: 2.5, unit: 'L' },
  { title: 'Walk 8,000 steps daily', category: 'activity', target: 8000, unit: 'steps' },
  { title: 'Sleep 8 hours nightly', category: 'sleep', target: 8, unit: 'hours' },
  { title: 'Exercise 30 minutes daily', category: 'activity', target: 30, unit: 'minutes' },
  { title: 'Maintain healthy weight', category: 'weight', target: 65, unit: 'kg' },
  { title: 'Zero fast food days per week', category: 'nutrition', target: 7, unit: 'days' }
];

const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  goalToEdit
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'hydration' | 'sleep' | 'activity' | 'nutrition' | 'weight' | 'general'>('activity');
  const [target, setTarget] = useState(8000);
  const [current, setCurrent] = useState(0);
  const [unit, setUnit] = useState('steps');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'Completed' | 'Overdue'>('In Progress');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setCategory(goalToEdit.category);
      setTarget(goalToEdit.target);
      setCurrent(goalToEdit.current);
      setUnit(goalToEdit.unit);
      setTargetDate(goalToEdit.targetDate ? new Date(goalToEdit.targetDate).toISOString().split('T')[0] : '');
      setStatus(goalToEdit.status);
    } else {
      setTitle('');
      setCategory('activity');
      setTarget(8000);
      setCurrent(0);
      setUnit('steps');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setTargetDate(defaultDate.toISOString().split('T')[0]);
      setStatus('In Progress');
    }
  }, [goalToEdit, isOpen]);

  const applyPreset = (preset: typeof PRESET_GOALS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category as any);
    setTarget(preset.target);
    setUnit(preset.unit);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) {
      error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<HealthGoal> = {
        title,
        category,
        target: Number(target),
        current: Number(current),
        unit,
        targetDate: new Date(targetDate).toISOString(),
        status
      };

      if (goalToEdit) {
        await goalService.updateGoal(goalToEdit._id, payload);
        success('Health goal updated successfully!');
      } else {
        await goalService.createGoal(payload);
        success('New health goal created successfully!');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save health goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={goalToEdit ? 'Edit Health Goal' : 'Create Health Goal'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preset Suggestions */}
        {!goalToEdit && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary-500" /> Quick Presets
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_GOALS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 transition-colors border border-transparent hover:border-primary-200"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <Input
          label="Goal Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Drink 2.5 L water daily"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            options={[
              { value: 'hydration', label: '💧 Hydration' },
              { value: 'sleep', label: '🌙 Sleep' },
              { value: 'activity', label: '🏃 Physical Activity' },
              { value: 'nutrition', label: '🥗 Nutrition' },
              { value: 'weight', label: '⚖️ Weight Management' },
              { value: 'general', label: '🎯 General Wellness' }
            ]}
          />
          <Input
            label="Measurement Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g. steps, L, hours, kg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target Value"
            type="number"
            step="any"
            value={target}
            onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
            required
          />
          <Input
            label="Current Progress"
            type="number"
            step="any"
            value={current}
            onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500/30"
              required
            />
          </div>

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { value: 'Not Started', label: 'Not Started' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Overdue', label: 'Overdue' }
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} icon={<Target size={16} />}>
            {goalToEdit ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal;
