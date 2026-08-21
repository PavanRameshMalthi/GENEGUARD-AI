import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import HealthScoreChart from '@/components/charts/HealthScoreChart';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { AlertTriangle, TrendingUp, Apple, Activity, Droplet, Brain, Download } from 'lucide-react';
import { assessmentService } from '@/services/assessment.service';
import { reportService } from '@/services/report.service';
import { useToast } from '@/hooks/useToast';
import { Assessment, ExerciseItem } from '@/types';

export default function AssessmentResultPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState('');
  const [exerciseTab, setExerciseTab] = useState('beginner');
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) return;
      try {
        const res = await assessmentService.getAssessment(id);
        const data = res.data || res;
        setAssessment(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load assessment results.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  const handleDownloadReport = async () => {
    try {
      const html = await reportService.downloadHealthReport(id!);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.addEventListener('load', () => {
          win.print();
        });
      }
    } catch (err) {
      showError('Failed to download report');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-5xl mx-auto">
          <LoadingSkeleton variant="card" />
          <div className="grid md:grid-cols-2 gap-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !assessment) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto text-center py-12">
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Could not load results</h2>
          <p className="text-gray-500">{error || 'Assessment not found'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const { calculations, aiAnalysis } = assessment;

  if (!aiAnalysis) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto text-center py-12">
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">AI Analysis Unavailable</h2>
          <p className="text-gray-500">AI analysis is not available for this assessment. This may happen if the Gemini API key is not configured.</p>
        </div>
      </DashboardLayout>
    );
  }

  const renderExerciseTable = (items: ExerciseItem[]) => (
    <div className="overflow-x-auto">
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
      <div className="space-y-6 max-w-5xl mx-auto">
        <DisclaimerBanner />
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Health Analysis Result</h1>
          <Button onClick={handleDownloadReport} icon={<Download size={16} />}>
            Download Report
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card glass className="col-span-1 p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-semibold mb-4">Your Health Score</h3>
            <HealthScoreChart score={calculations.healthScore} />
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{calculations.healthScore}/100</p>
            <div className="mt-4 text-sm text-gray-500">
              Risk Level: <span className="font-bold text-primary-600">{calculations.riskLevel}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              BMI: <span className="font-bold">{calculations.bmi} ({calculations.bmiCategory})</span>
            </div>
          </Card>
          <Card glass className="col-span-2 p-6">
            <h3 className="font-semibold mb-4 text-xl">Overall Health Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">{aiAnalysis.overallHealthSummary}</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Calories Needed</div>
            <div className="font-bold text-lg">{calculations.caloriesNeeded}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Ideal Weight</div>
            <div className="font-bold text-lg">{calculations.idealWeightMin} - {calculations.idealWeightMax} kg</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Activity Level</div>
            <div className="font-bold text-lg">{calculations.activityLevel}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Rec. Sleep</div>
            <div className="font-bold text-lg">{calculations.recommendedSleep} hrs</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Water Req.</div>
            <div className="font-bold text-lg">{calculations.dailyWaterRequirement} L</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Risk Factors" icon={<AlertTriangle className="text-yellow-500" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {aiAnalysis.riskFactors.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Card>
          
          <Card glass title="Diet Plan" icon={<Apple className="text-red-400" />}>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div><strong>Breakfast:</strong> {aiAnalysis.dietPlan.breakfast.join(', ')}</div>
              <div><strong>Lunch:</strong> {aiAnalysis.dietPlan.lunch.join(', ')}</div>
              <div><strong>Dinner:</strong> {aiAnalysis.dietPlan.dinner.join(', ')}</div>
              <div><strong>Snacks:</strong> {aiAnalysis.dietPlan.snacks.join(', ')}</div>
              <div><strong>Avoid:</strong> {aiAnalysis.dietPlan.avoidFoods.join(', ')}</div>
              <div><strong>Healthy Foods:</strong> {aiAnalysis.dietPlan.healthyFoods.join(', ')}</div>
            </div>
          </Card>
        </div>

        <Card glass title="Exercise Plan" icon={<Activity className="text-blue-400" />}>
          <Tabs 
            tabs={[
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'advanced', label: 'Advanced' }
            ]} 
            activeTab={exerciseTab} 
            onChange={setExerciseTab} 
          />
          <div className="mt-4">
            {exerciseTab === 'beginner' && renderExerciseTable(aiAnalysis.exercisePlan.beginner)}
            {exerciseTab === 'intermediate' && renderExerciseTable(aiAnalysis.exercisePlan.intermediate)}
            {exerciseTab === 'advanced' && renderExerciseTable(aiAnalysis.exercisePlan.advanced)}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Sleep Analysis" icon={<Brain className="text-purple-400" />}>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><strong>Quality:</strong> {aiAnalysis.sleepAnalysis.quality}</p>
              <p><strong>Ideal Bed Time:</strong> {aiAnalysis.sleepAnalysis.idealBedTime}</p>
              <p><strong>Ideal Wake Time:</strong> {aiAnalysis.sleepAnalysis.idealWakeTime}</p>
              <div className="mt-2">
                <strong>Tips:</strong>
                <ul className="list-disc list-inside mt-1">
                  {aiAnalysis.sleepAnalysis.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
          </Card>

          <Card glass title="Hydration Analysis" icon={<Droplet className="text-cyan-400" />}>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><strong>Goal:</strong> {aiAnalysis.hydrationAnalysis.goal} L</p>
              <p><strong>Current:</strong> {aiAnalysis.hydrationAnalysis.current} L</p>
              <p><strong>Remaining:</strong> {aiAnalysis.hydrationAnalysis.remaining} L</p>
              <div className="mt-2">
                <strong>Tips:</strong>
                <ul className="list-disc list-inside mt-1">
                  {aiAnalysis.hydrationAnalysis.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
          </Card>

          <Card glass title="Lifestyle Improvements" icon={<TrendingUp className="text-green-500" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {aiAnalysis.lifestyleImprovements.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </Card>

          <Card glass title="Stress Management" icon={<Brain className="text-indigo-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {aiAnalysis.stressManagement.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </Card>
          
          <Card glass title="Weekly Goals" icon={<Activity className="text-orange-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {aiAnalysis.weeklyGoals.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </Card>

          <Card glass title="Preventive Health & Checkups" icon={<AlertTriangle className="text-blue-500" />}>
            <div className="space-y-4">
              <div>
                <strong>Advice:</strong>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 mt-1">
                  {aiAnalysis.preventiveHealthAdvice.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div>
                <strong>Checkups:</strong>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 mt-1">
                  {aiAnalysis.medicalCheckupSuggestions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <Card glass className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={20} /> When to Visit a Doctor
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            {aiAnalysis.whenToVisitDoctor} This AI analysis is not a medical diagnosis.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
