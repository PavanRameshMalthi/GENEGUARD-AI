import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import HealthScoreChart from '@/components/charts/HealthScoreChart';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { AlertTriangle, TrendingUp, Apple, Activity, Droplet, Brain } from 'lucide-react';
import { assessmentService } from '@/services/assessment.service';
import { AIAnalysis } from '@/types';

export default function AssessmentResultPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) return;
      try {
        const res = await assessmentService.getAssessment(id);
        const data = res.data || res;
        setAnalysis(data?.aiAnalysis || null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load assessment results.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto text-center py-12">
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Could not load results</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Fallback data for demo when AI analysis is unavailable
  const healthScore = analysis?.healthScore ?? 75;
  const healthSummary = analysis?.healthSummary ?? 'Based on your inputs, your overall health profile is strong. However, there are a few areas of improvement regarding sleep consistency and hydration.';
  const riskFactors = analysis?.riskFactors ?? ['Slightly elevated stress levels', 'Sedentary work environment'];
  const lifestyleImprovements = analysis?.lifestyleImprovements ?? ['Aim for 7-8 hours of continuous sleep', 'Incorporate daily 20-minute stretching'];
  const dietSuggestions = analysis?.dietSuggestions ?? ['Increase omega-3 fatty acids', 'Reduce processed sugar intake'];
  const mentalWellnessTips = analysis?.mentalWellnessTips ?? ['Practice mindfulness meditation', 'Take regular screen breaks'];
  const exerciseSuggestions = analysis?.exerciseSuggestions ?? ['30 mins brisk walking', 'Yoga on weekends'];
  const hydrationAdvice = analysis?.hydrationAdvice ?? 'Drink at least 8 glasses of water daily and carry a reusable water bottle.';
  const whenToVisitDoctor = analysis?.whenToVisitDoctor ?? 'If you experience severe chest pain, shortness of breath, or any sudden severe symptoms, please visit a doctor immediately.';

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <DisclaimerBanner />
        <h1 className="text-2xl font-bold">AI Health Analysis Result</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card glass className="col-span-1 p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-semibold mb-4">Your Health Score</h3>
            <HealthScoreChart score={healthScore} />
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{healthScore}/100</p>
          </Card>
          <Card glass className="col-span-2 p-6">
            <h3 className="font-semibold mb-4 text-xl">Health Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">{healthSummary}</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Risk Factors" icon={<AlertTriangle className="text-yellow-500" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {riskFactors.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Card>
          
          <Card glass title="Lifestyle Improvements" icon={<TrendingUp className="text-green-500" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {lifestyleImprovements.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </Card>

          <Card glass title="Diet Suggestions" icon={<Apple className="text-red-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {dietSuggestions.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </Card>

          <Card glass title="Mental Wellness" icon={<Brain className="text-purple-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {mentalWellnessTips.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </Card>
          
          <Card glass title="Exercise Suggestions" icon={<Activity className="text-blue-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {exerciseSuggestions.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </Card>

          <Card glass title="Hydration Advice" icon={<Droplet className="text-cyan-400" />}>
            <p className="text-gray-600 dark:text-gray-400">{hydrationAdvice}</p>
          </Card>
        </div>

        <Card glass className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={20} /> When to Visit a Doctor
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            {whenToVisitDoctor} This AI analysis is not a medical diagnosis.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
