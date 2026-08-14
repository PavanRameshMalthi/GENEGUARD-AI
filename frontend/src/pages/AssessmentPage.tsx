import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm as useReactHookForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type FormData = {
  age: number;
  height: number;
  weight: number;
  bloodPressure: string;
  diabetes: string;
  smoking: string;
  alcohol: string;
  exerciseFrequency: string;
  sleepHours: number;
  waterIntake: number;
  existingConditions: string;
  familyHistory: string;
  symptoms: string;
  stressLevel: string;
  medicalNotes: string;
};

export const AssessmentPage: React.FC = () => {
  const { register, handleSubmit } = useReactHookForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');

    // Convert string booleans to actual booleans
    const payload = {
      ...data,
      diabetes: data.diabetes === 'Yes',
      smoking: data.smoking === 'Yes',
      alcohol: data.alcohol === 'Yes',
    };

    try {
      // Step 1: Call AI Analysis API
      const aiRes = await fetch('http://localhost:5000/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(payload)
      });
      
      const aiData = await aiRes.json();
      
      if (!aiRes.ok) throw new Error(aiData.message || 'AI Analysis failed');

      // Step 2: Save Assessment
      const saveRes = await fetch('http://localhost:5000/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ ...payload, aiAnalysis: aiData })
      });
      
      const saveData = await saveRes.json();
      
      if (!saveRes.ok) throw new Error(saveData.message || 'Failed to save assessment');

      // Navigate to Analysis Page
      navigate(`/analysis/${saveData._id}`);

    } catch (err: any) {
      setError(err.message || 'An error occurred during assessment processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 py-8 lg:py-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Health Assessment</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Fill out this secure form to receive your personalized AI wellness insights. 
            All data is processed confidentially.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <Card glass>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 mb-4">Basic Metrics</h3>
                <Input label="Age" type="number" {...register('age', { required: true, min: 18, max: 120 })} />
                <Input label="Height (cm)" type="number" {...register('height', { required: true })} />
                <Input label="Weight (kg)" type="number" {...register('weight', { required: true })} />
                <Input label="Blood Pressure (e.g. 120/80)" type="text" {...register('bloodPressure')} />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 mb-4">Lifestyle</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Exercise Frequency</label>
                  <select {...register('exerciseFrequency')} className="h-11 rounded-xl border border-gray-200 bg-white px-3 dark:bg-slate-900 dark:border-slate-700">
                    <option value="None">None</option>
                    <option value="1-2 times/week">1-2 times/week</option>
                    <option value="3-5 times/week">3-5 times/week</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>

                <Input label="Average Sleep (Hours)" type="number" step="0.5" {...register('sleepHours')} />
                <Input label="Water Intake (Liters/day)" type="number" step="0.5" {...register('waterIntake')} />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Stress Level</label>
                  <select {...register('stressLevel')} className="h-11 rounded-xl border border-gray-200 bg-white px-3 dark:bg-slate-900 dark:border-slate-700">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Diabetes</label>
                <select {...register('diabetes')} className="h-11 rounded-xl border border-gray-200 bg-white px-3 dark:bg-slate-900 dark:border-slate-700">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Smoking</label>
                <select {...register('smoking')} className="h-11 rounded-xl border border-gray-200 bg-white px-3 dark:bg-slate-900 dark:border-slate-700">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Alcohol Consumption</label>
                <select {...register('alcohol')} className="h-11 rounded-xl border border-gray-200 bg-white px-3 dark:bg-slate-900 dark:border-slate-700">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-lg pb-2">Medical History & Notes</h3>
              <Input label="Existing Conditions (Optional)" type="text" {...register('existingConditions')} placeholder="e.g., Asthma, Hypertension" />
              <Input label="Family History (Optional)" type="text" {...register('familyHistory')} placeholder="e.g., Heart Disease" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Additional Symptoms / Notes</label>
                <textarea 
                  {...register('medicalNotes')} 
                  rows={4}
                  className="rounded-xl border border-gray-200 bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Any current symptoms or concerns..."
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto min-w-[200px]">
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  'Generate AI Assessment'
                )}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;
