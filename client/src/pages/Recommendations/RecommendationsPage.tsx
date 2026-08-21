import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Tabs from '@/components/ui/Tabs';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { ClipboardList, Droplet, Brain, Activity, Apple, CheckCircle } from 'lucide-react';
import { assessmentService } from '@/services/assessment.service';
import { Assessment, ExerciseItem } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('diet');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await assessmentService.getLatestAssessment();
        setAssessment(res.data || res);
      } catch {
        setAssessment(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-6xl mx-auto">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      </DashboardLayout>
    );
  }

  if (!assessment || !assessment.aiAnalysis) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Action Plan</h1>
          </div>
          <EmptyState
            icon={ClipboardList}
            title="No Recommendations Available"
            description="Complete your health assessment to receive personalized AI recommendations and an action plan."
            action={{ label: 'Start Assessment', onClick: () => navigate('/assessment') }}
          />
        </div>
      </DashboardLayout>
    );
  }

  const { aiAnalysis } = assessment;

  const renderExerciseTable = (items: ExerciseItem[]) => (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3 rounded-tl-lg">Name</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Calories</th>
            <th className="px-4 py-3 rounded-tr-lg">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.name}</td>
              <td className="px-4 py-3">{item.duration}</td>
              <td className="px-4 py-3">{item.caloriesBurned}</td>
              <td className="px-4 py-3">{item.frequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Action Plan</h1>
        </div>
        <DisclaimerBanner />
        
        <Tabs 
          tabs={[
            { id: 'diet', label: 'Diet Plan' }, 
            { id: 'exercise', label: 'Exercise Plan' },
            { id: 'sleep', label: 'Sleep' },
            { id: 'hydration', label: 'Hydration' },
            { id: 'lifestyle', label: 'Lifestyle' },
            { id: 'goals', label: 'Goals & Advice' }
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div className="mt-6">
          {activeTab === 'diet' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card glass title="Meals" icon={<Apple className="text-red-500" />}>
                <div className="space-y-4 text-sm">
                  <div><strong>Breakfast:</strong> <ul className="list-disc pl-5 mt-1">{aiAnalysis.dietPlan.breakfast.map((i, idx) => <li key={idx}>{i}</li>)}</ul></div>
                  <div><strong>Lunch:</strong> <ul className="list-disc pl-5 mt-1">{aiAnalysis.dietPlan.lunch.map((i, idx) => <li key={idx}>{i}</li>)}</ul></div>
                  <div><strong>Dinner:</strong> <ul className="list-disc pl-5 mt-1">{aiAnalysis.dietPlan.dinner.map((i, idx) => <li key={idx}>{i}</li>)}</ul></div>
                  <div><strong>Snacks:</strong> <ul className="list-disc pl-5 mt-1">{aiAnalysis.dietPlan.snacks.map((i, idx) => <li key={idx}>{i}</li>)}</ul></div>
                </div>
              </Card>
              <Card glass title="Dietary Guidelines" icon={<CheckCircle className="text-green-500" />}>
                <div className="space-y-4 text-sm">
                  <div><strong>Healthy Foods to Include:</strong> <ul className="list-disc pl-5 mt-1">{aiAnalysis.dietPlan.healthyFoods.map((i, idx) => <li key={idx}>{i}</li>)}</ul></div>
                  <div><strong>Foods to Avoid:</strong> <ul className="list-disc pl-5 mt-1">{aiAnalysis.dietPlan.avoidFoods.map((i, idx) => <li key={idx}>{i}</li>)}</ul></div>
                  <div><strong>Protein Tips:</strong> <p className="mt-1 text-gray-600 dark:text-gray-400">{aiAnalysis.dietPlan.proteinTips}</p></div>
                  <div><strong>Fiber Tips:</strong> <p className="mt-1 text-gray-600 dark:text-gray-400">{aiAnalysis.dietPlan.fiberTips}</p></div>
                  <div><strong>Sugar Reduction:</strong> <p className="mt-1 text-gray-600 dark:text-gray-400">{aiAnalysis.dietPlan.sugarReduction}</p></div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'exercise' && (
            <div className="space-y-6">
              <Card glass title="Beginner Exercises" icon={<Activity className="text-blue-500" />}>
                {renderExerciseTable(aiAnalysis.exercisePlan.beginner)}
              </Card>
              <Card glass title="Intermediate Exercises" icon={<Activity className="text-blue-500" />}>
                {renderExerciseTable(aiAnalysis.exercisePlan.intermediate)}
              </Card>
              <Card glass title="Advanced Exercises" icon={<Activity className="text-blue-500" />}>
                {renderExerciseTable(aiAnalysis.exercisePlan.advanced)}
              </Card>
            </div>
          )}

          {activeTab === 'sleep' && (
            <Card glass title="Sleep Analysis" icon={<Brain className="text-indigo-500" />}>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500">Quality</div>
                    <div className="font-bold text-lg">{aiAnalysis.sleepAnalysis.quality}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500">Ideal Bed Time</div>
                    <div className="font-bold text-lg">{aiAnalysis.sleepAnalysis.idealBedTime}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500">Ideal Wake Time</div>
                    <div className="font-bold text-lg">{aiAnalysis.sleepAnalysis.idealWakeTime}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 mt-4 text-base">Sleep Tips:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                    {aiAnalysis.sleepAnalysis.tips.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'hydration' && (
            <Card glass title="Hydration Analysis" icon={<Droplet className="text-cyan-500" />}>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500">Goal</div>
                    <div className="font-bold text-lg">{aiAnalysis.hydrationAnalysis.goal} L</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500">Current Intake</div>
                    <div className="font-bold text-lg">{aiAnalysis.hydrationAnalysis.current} L</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500">Remaining</div>
                    <div className="font-bold text-lg">{aiAnalysis.hydrationAnalysis.remaining} L</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 mt-4 text-base">Hydration Tips:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                    {aiAnalysis.hydrationAnalysis.tips.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'lifestyle' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card glass title="Lifestyle Improvements" icon={<CheckCircle className="text-green-500" />}>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {aiAnalysis.lifestyleImprovements.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              </Card>
              <Card glass title="Stress Management" icon={<Brain className="text-purple-500" />}>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {aiAnalysis.stressManagement.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </Card>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card glass title="Weekly Goals" icon={<CheckCircle className="text-orange-500" />}>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {aiAnalysis.weeklyGoals.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </Card>
              <Card glass title="Preventive Health Advice" icon={<Activity className="text-blue-500" />}>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {aiAnalysis.preventiveHealthAdvice.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
