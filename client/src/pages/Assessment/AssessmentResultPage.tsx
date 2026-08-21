import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import HealthScoreChart from '@/components/charts/HealthScoreChart';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { 
  AlertTriangle, 
  TrendingUp, 
  Apple, 
  Activity, 
  Droplet, 
  Brain, 
  Download, 
  Sparkles, 
  RotateCw,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { assessmentService } from '@/services/assessment.service';
import { aiService } from '@/services/ai.service';
import { reportService } from '@/services/report.service';
import { useToast } from '@/hooks/useToast';
import { Assessment, ExerciseItem } from '@/types';

export default function AssessmentResultPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState('');
  const [exerciseTab, setExerciseTab] = useState('beginner');
  const { error: showError, success: showSuccess } = useToast();

  const fetchAssessment = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await assessmentService.getAssessment(id);
      const data = res.data || res;
      setAssessment(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load assessment results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const handleRegenerateAI = async () => {
    if (!id || !assessment) return;
    try {
      setIsGeneratingAI(true);
      const res = await aiService.analyzeHealth(assessment, id);
      if (res.data?.assessment) {
        setAssessment(res.data.assessment);
      } else if (res.data?.analysis) {
        setAssessment(prev => prev ? { ...prev, aiAnalysis: res.data.analysis } : null);
      } else {
        await fetchAssessment();
      }
      showSuccess('AI Health Insights refreshed successfully!');
    } catch (err: any) {
      showError("We're unable to generate your AI health insights right now. Please try again in a few moments.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

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
        <div className="max-w-3xl mx-auto text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Could Not Load Assessment</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {error || 'The requested health assessment could not be found.'}
          </p>
          <Button onClick={fetchAssessment} icon={<RotateCw size={16} />}>
            Retry Loading
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { calculations, aiAnalysis } = assessment;

  // If aiAnalysis is somehow missing, render a friendly AI generation trigger
  if (!aiAnalysis) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-16 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-lg mt-8 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary-600 to-primary-400 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary-500/20 animate-pulse">
            <Sparkles size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generating AI Health Analysis</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
              Your assessment biometrics are saved. Click below to analyze your health profile with GeneGuard AI.
            </p>
          </div>
          <div className="pt-2">
            <Button 
              onClick={handleRegenerateAI} 
              loading={isGeneratingAI}
              icon={<Sparkles size={18} />}
              className="px-8 py-3 rounded-xl shadow-lg shadow-primary-500/25"
            >
              {isGeneratingAI ? 'Analyzing your health with AI...' : 'Generate AI Health Analysis'}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderExerciseTable = (items: ExerciseItem[] = []) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 dark:bg-gray-800/80 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3 rounded-tl-xl font-semibold">Exercise</th>
            <th className="px-4 py-3 font-semibold">Duration</th>
            <th className="px-4 py-3 font-semibold">Est. Burn</th>
            <th className="px-4 py-3 rounded-tr-xl font-semibold">Frequency</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-4 py-3.5 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                {item.name}
              </td>
              <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{item.duration}</td>
              <td className="px-4 py-3.5 text-emerald-600 dark:text-emerald-400 font-medium">{item.caloriesBurned}</td>
              <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{item.frequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <DisclaimerBanner />
        
        {/* Header with Title and Action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={14} /> AI Health Analysis
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Personalized Health Insights
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRegenerateAI} 
              loading={isGeneratingAI}
              icon={<RotateCw size={16} />}
            >
              Refresh Analysis
            </Button>
            <Button onClick={handleDownloadReport} icon={<Download size={16} />}>
              Download Report
            </Button>
          </div>
        </div>
        
        {/* Top Summary & Health Score Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card glass className="col-span-1 p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Overall Health Score</h3>
            <HealthScoreChart score={calculations?.healthScore || aiAnalysis.healthScore || 80} />
            <p className="text-3xl font-extrabold mt-2 text-gray-900 dark:text-white">
              {calculations?.healthScore || aiAnalysis.healthScore || 80}/100
            </p>
            <div className="mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Risk Level: <span className="font-bold text-primary-600 dark:text-primary-400">{calculations?.riskLevel || 'Low'}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              BMI: <span className="font-bold text-gray-700 dark:text-gray-300">{calculations?.bmi} ({calculations?.bmiCategory})</span>
            </div>
          </Card>

          <Card glass className="col-span-2 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-2">
              <Brain size={18} /> Executive Summary
            </div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Overall Health Summary</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {aiAnalysis.overallHealthSummary}
            </p>
          </Card>
        </div>

        {/* Biometrics Quick Cards */}
        {calculations && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            <Card className="p-4 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Calories Needed</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">{calculations.caloriesNeeded} kcal</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Ideal Weight</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">{calculations.idealWeightMin} - {calculations.idealWeightMax} kg</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Activity Level</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white capitalize">{calculations.activityLevel}</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Rec. Sleep</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">{calculations.recommendedSleep} hrs</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Water Target</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">{calculations.dailyWaterRequirement} L</div>
            </Card>
          </div>
        )}

        {/* Risk Factors & Diet Plan */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Identified Risk Factors" icon={<AlertTriangle className="text-yellow-500" />}>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
              {aiAnalysis.riskFactors && aiAnalysis.riskFactors.length > 0 ? (
                aiAnalysis.riskFactors.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0"></span>
                    <span>{r}</span>
                  </li>
                ))
              ) : (
                <li className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={16} /> No critical high-risk indicators identified.
                </li>
              )}
            </ul>
          </Card>
          
          <Card glass title="Dietary Recommendations" icon={<Apple className="text-red-400" />}>
            <div className="space-y-3.5 text-sm text-gray-600 dark:text-gray-300">
              {aiAnalysis.dietPlan?.breakfast && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Breakfast:</strong>{' '}
                  {aiAnalysis.dietPlan.breakfast.join(', ')}
                </div>
              )}
              {aiAnalysis.dietPlan?.lunch && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Lunch:</strong>{' '}
                  {aiAnalysis.dietPlan.lunch.join(', ')}
                </div>
              )}
              {aiAnalysis.dietPlan?.dinner && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Dinner:</strong>{' '}
                  {aiAnalysis.dietPlan.dinner.join(', ')}
                </div>
              )}
              {aiAnalysis.dietPlan?.snacks && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Snacks:</strong>{' '}
                  {aiAnalysis.dietPlan.snacks.join(', ')}
                </div>
              )}
              {aiAnalysis.dietPlan?.healthyFoods && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <strong className="text-emerald-600 dark:text-emerald-400">Nutrient Powerhouses:</strong>{' '}
                  {aiAnalysis.dietPlan.healthyFoods.join(', ')}
                </div>
              )}
              {aiAnalysis.dietPlan?.avoidFoods && (
                <div className="text-xs">
                  <strong className="text-red-500">Limit or Avoid:</strong>{' '}
                  {aiAnalysis.dietPlan.avoidFoods.join(', ')}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Exercise Recommendations */}
        <Card glass title="Personalized Exercise Plan" icon={<Activity className="text-blue-500" />}>
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
            {exerciseTab === 'beginner' && renderExerciseTable(aiAnalysis.exercisePlan?.beginner || [])}
            {exerciseTab === 'intermediate' && renderExerciseTable(aiAnalysis.exercisePlan?.intermediate || [])}
            {exerciseTab === 'advanced' && renderExerciseTable(aiAnalysis.exercisePlan?.advanced || [])}
          </div>
        </Card>

        {/* Sleep & Hydration Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Sleep Architecture & Analysis" icon={<Brain className="text-purple-400" />}>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between items-center bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl">
                <span>Sleep Quality Rating:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{aiAnalysis.sleepAnalysis?.quality || 'Optimal'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-gray-500 block">Target Bed Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{aiAnalysis.sleepAnalysis?.idealBedTime || '22:30'}</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-gray-500 block">Target Wake Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{aiAnalysis.sleepAnalysis?.idealWakeTime || '06:30'}</span>
                </div>
              </div>
              {aiAnalysis.sleepAnalysis?.tips && (
                <ul className="space-y-1.5 pt-1 text-xs">
                  {aiAnalysis.sleepAnalysis.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card glass title="Hydration & Fluid Balance" icon={<Droplet className="text-cyan-400" />}>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30">
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 block font-medium">Daily Goal</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{aiAnalysis.hydrationAnalysis?.goal || 2.8} L</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30">
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 block font-medium">Current</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{aiAnalysis.hydrationAnalysis?.current || 2.0} L</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30">
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 block font-medium">Remaining</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{aiAnalysis.hydrationAnalysis?.remaining || 0.8} L</span>
                </div>
              </div>
              {aiAnalysis.hydrationAnalysis?.tips && (
                <ul className="space-y-1.5 pt-1 text-xs">
                  {aiAnalysis.hydrationAnalysis.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>

        {/* Stress & Lifestyle Improvements */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Stress Management Techniques" icon={<Brain className="text-indigo-400" />}>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
              {aiAnalysis.stressManagement?.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card glass title="Lifestyle & Habit Enhancements" icon={<TrendingUp className="text-emerald-500" />}>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
              {aiAnalysis.lifestyleImprovements?.map((l, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Weekly Goals & Preventive Health */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card glass title="Weekly Action Goals" icon={<Activity className="text-orange-400" />}>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
              {aiAnalysis.weeklyGoals?.map((g, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-orange-500 mt-0.5 shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card glass title="Preventive Screenings & Advice" icon={<Stethoscope className="text-primary-500" />}>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <strong className="text-gray-900 dark:text-white text-xs uppercase tracking-wider block mb-1.5">Recommended Screenings:</strong>
                <ul className="space-y-1 text-xs">
                  {aiAnalysis.medicalCheckupSuggestions?.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {aiAnalysis.preventiveHealthAdvice && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <strong className="text-gray-900 dark:text-white text-xs uppercase tracking-wider block mb-1.5">Preventive Advice:</strong>
                  <ul className="space-y-1 text-xs">
                    {aiAnalysis.preventiveHealthAdvice.slice(0, 3).map((a, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* When to Consult a Doctor */}
        <Card glass className="bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 p-6">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2.5 text-base">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
            When to Consult a Physician
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300/90 leading-relaxed">
            {aiAnalysis.whenToVisitDoctor}
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
