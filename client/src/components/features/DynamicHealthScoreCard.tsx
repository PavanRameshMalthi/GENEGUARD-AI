import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  Moon, 
  Droplets, 
  Activity, 
  Apple, 
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DynamicScoreResult } from '@/types';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';

interface DynamicHealthScoreCardProps {
  scoreData: DynamicScoreResult;
}

const DynamicHealthScoreCard: React.FC<DynamicHealthScoreCardProps> = ({ scoreData }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!scoreData || !scoreData.hasData) {
    return (
      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Dynamic Health Score</h3>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500">
            Pending Data
          </span>
        </div>
        <div className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>No health score available yet.</p>
          <p className="text-xs mt-1 text-gray-400">Complete your first assessment or daily tracking to calculate your score.</p>
        </div>
      </Card>
    );
  }

  const { overallScore, riskLevel, scoreChange = 0, changeExplanation, subScores } = scoreData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  const getRiskBadge = (level: string) => {
    if (level === 'Low') {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50';
    }
    if (level === 'Moderate') {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50';
    }
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/50';
  };

  return (
    <Card glass className="p-6 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Health Score</h3>
          <span className="text-xs text-gray-400">Dynamic 0–100</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getRiskBadge(riskLevel)}`}>
          {riskLevel} Risk
        </span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-baseline gap-3 my-3">
        <span className={`text-5xl font-black tracking-tight ${getScoreColor(overallScore)}`}>
          {overallScore}
        </span>
        <span className="text-gray-400 text-sm font-medium">/ 100</span>

        {/* Delta change badge */}
        {scoreChange !== 0 ? (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ml-auto ${
              scoreChange > 0
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            {scoreChange > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {scoreChange > 0 ? `+${scoreChange}` : scoreChange} pts
          </span>
        ) : (
          <span className="flex items-center gap-0.5 text-xs font-medium text-gray-400 ml-auto">
            <Minus size={13} /> Steady
          </span>
        )}
      </div>

      {/* Why score changed explanation */}
      {changeExplanation && (
        <div className="my-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          <Info size={15} className="text-primary-500 mt-0.5 shrink-0" />
          <p>{changeExplanation}</p>
        </div>
      )}

      {/* Sub-score Toggle Button */}
      <button
        type="button"
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full mt-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
      >
        <span>{showBreakdown ? 'Hide Sub-Score Breakdown' : 'View Sub-Score Breakdown'}</span>
        {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Collapsible Sub-scores */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-2 space-y-3"
          >
            {/* Sleep Sub-score */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                  <Moon size={13} className="text-indigo-400" /> Sleep Architecture
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{subScores.sleepScore}/100</span>
              </div>
              <ProgressBar progress={subScores.sleepScore} color="#6366f1" size="sm" />
            </div>

            {/* Hydration Sub-score */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                  <Droplets size={13} className="text-cyan-400" /> Daily Hydration
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{subScores.hydrationScore}/100</span>
              </div>
              <ProgressBar progress={subScores.hydrationScore} color="#06b6d4" size="sm" />
            </div>

            {/* Physical Activity Sub-score */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                  <Activity size={13} className="text-emerald-400" /> Physical Movement
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{subScores.activityScore}/100</span>
              </div>
              <ProgressBar progress={subScores.activityScore} color="#10b981" size="sm" />
            </div>

            {/* Nutrition Sub-score */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                  <Apple size={13} className="text-amber-400" /> Nutrition Quality
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{subScores.nutritionScore}/100</span>
              </div>
              <ProgressBar progress={subScores.nutritionScore} color="#f59e0b" size="sm" />
            </div>

            {/* Lifestyle Sub-score */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                  <Heart size={13} className="text-rose-400" /> Lifestyle & Stress
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{subScores.lifestyleScore}/100</span>
              </div>
              <ProgressBar progress={subScores.lifestyleScore} color="#f43f5e" size="sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default DynamicHealthScoreCard;
