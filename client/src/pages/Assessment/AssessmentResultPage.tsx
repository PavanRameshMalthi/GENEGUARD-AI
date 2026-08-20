import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import HealthScoreChart from '@/components/charts/HealthScoreChart';
import Card from '@/components/ui/Card';
import { AlertTriangle, TrendingUp, Apple, Activity, Droplet, Brain } from 'lucide-react';

export default function AssessmentResultPage() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <DisclaimerBanner />
        <h1 className="text-2xl font-bold">AI Health Analysis Result</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card glass className="col-span-1 p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-semibold mb-4">Your Health Score</h3>
            <HealthScoreChart score={88} />
          </Card>
          <Card glass className="col-span-2 p-6">
            <h3 className="font-semibold mb-4 text-xl">Health Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Based on your inputs, your overall health profile is strong. However, there are a few areas of improvement regarding sleep consistency and hydration.
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Risk Factors" icon={<AlertTriangle className="text-yellow-500" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Slightly elevated stress levels</li>
              <li>Sedentary work environment</li>
            </ul>
          </Card>
          
          <Card glass title="Lifestyle Improvements" icon={<TrendingUp className="text-green-500" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Aim for 7-8 hours of continuous sleep</li>
              <li>Incorporate daily 20-minute stretching</li>
            </ul>
          </Card>

          <Card glass title="Diet Suggestions" icon={<Apple className="text-red-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Increase omega-3 fatty acids</li>
              <li>Reduce processed sugar intake</li>
            </ul>
          </Card>

          <Card glass title="Mental Wellness" icon={<Brain className="text-purple-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Practice mindfulness meditation</li>
              <li>Take regular screen breaks</li>
            </ul>
          </Card>
          
          <Card glass title="Exercise Suggestions" icon={<Activity className="text-blue-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>30 mins brisk walking</li>
              <li>Yoga on weekends</li>
            </ul>
          </Card>

          <Card glass title="Hydration Advice" icon={<Droplet className="text-cyan-400" />}>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Drink at least 8 glasses of water</li>
              <li>Carry a reusable water bottle</li>
            </ul>
          </Card>
        </div>

        <Card glass className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={20} /> When to Visit a Doctor
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            If you experience severe chest pain, shortness of breath, or any sudden severe symptoms, please visit a doctor immediately. This AI analysis is not a medical diagnosis.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
