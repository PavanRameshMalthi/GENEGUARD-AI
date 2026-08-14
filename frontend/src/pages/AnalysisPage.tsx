import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, CheckCircle, Info, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assessments', {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          const current = data.find((a: any) => a._id === id);
          setAssessment(current);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user && id) fetchAssessment();
  }, [user, id]);

  if (loading) {
    return <div className="flex-1 flex justify-center items-center py-20 text-slate-500">Loading analysis...</div>;
  }

  if (!assessment) {
    return <div className="flex-1 text-center py-20 text-slate-500">Assessment not found.</div>;
  }

  const ai = assessment.aiAnalysis;
  if (!ai) return <div className="flex-1 text-center py-20">Analysis data missing.</div>;

  const isLowRisk = ai.riskLevel === 'Low';
  const isMedRisk = ai.riskLevel === 'Medium';
  const riskColor = isLowRisk ? 'text-green-500' : isMedRisk ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <Link to="/dashboard" className="text-primary hover:underline text-sm mb-4 inline-block">&larr; Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Health Analysis</h1>
        <p className="text-slate-600 dark:text-slate-400">Review your personalized wellness insights.</p>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card glass className="md:col-span-2 flex flex-col justify-center items-center p-8 border-none bg-gradient-to-br from-primary/5 to-secondary/5">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="text-center"
          >
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Wellness Score</div>
            <div className="text-7xl font-extrabold text-primary mb-4">{ai.healthScore}</div>
            <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto text-lg leading-relaxed">{ai.summary}</p>
          </motion.div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-xl border-4 ${isLowRisk ? 'border-green-500' : isMedRisk ? 'border-yellow-500' : 'border-red-500'}`}>
              <Activity className={`w-10 h-10 ${riskColor}`} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Risk Level</h3>
          <div className={`text-2xl font-black ${riskColor}`}>{ai.riskLevel}</div>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <ListSection title="Potential Risk Factors" items={ai.possibleRiskFactors} icon={<AlertTriangle className="w-5 h-5 text-red-500" />} />
        <ListSection title="Lifestyle Suggestions" items={ai.lifestyleSuggestions} icon={<CheckCircle className="w-5 h-5 text-secondary" />} />
        <ListSection title="Diet & Nutrition" items={ai.dietRecommendations} icon={<Info className="w-5 h-5 text-primary" />} />
        <ListSection title="Exercise & Activity" items={ai.exerciseSuggestions} icon={<Info className="w-5 h-5 text-primary" />} />
        <ListSection title="Sleep & Recovery" items={ai.sleepRecommendations} icon={<Info className="w-5 h-5 text-primary" />} />
        <ListSection title="Mental Wellness" items={ai.mentalWellnessTips} icon={<Info className="w-5 h-5 text-primary" />} />
      </div>

      <div className="mt-8">
        <Card className="bg-slate-50 dark:bg-slate-900 border-none">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-primary" /> When to Consult a Doctor
          </h3>
          <p className="text-slate-700 dark:text-slate-300">{ai.whenToConsultDoctor}</p>
        </Card>
      </div>
    </div>
  );
};

const ListSection = ({ title, items, icon }: { title: string, items: string[], icon: React.ReactNode }) => (
  <Card>
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
    </div>
    {items && items.length > 0 ? (
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm">
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-500">No specific data generated.</p>
    )}
  </Card>
);

export default AnalysisPage;
