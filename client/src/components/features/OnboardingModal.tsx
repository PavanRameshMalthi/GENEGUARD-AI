import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle2, Dna, Sparkles, FileText, Brain, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import DnaHelixVisual from '@/components/ui/DnaHelixVisual';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Understand my genetics',
    'Explore health insights'
  ]);

  const goalsOptions = [
    { id: 'genetics', label: 'Understand my genetics', icon: Dna },
    { id: 'reports', label: 'Analyze a report', icon: FileText },
    { id: 'insights', label: 'Explore health insights', icon: Heart },
    { id: 'ai', label: 'Ask AI questions', icon: Brain },
  ];

  const toggleGoal = (label: string) => {
    setSelectedGoals((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleFinish = (action: 'upload' | 'dashboard') => {
    localStorage.setItem('geneguard_onboarding_completed', 'true');
    onClose();
    if (action === 'upload') {
      navigate('/reports');
    } else {
      navigate('/dashboard');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card (Reference Image 3) */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[380px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 z-10 text-center flex flex-col justify-between min-h-[460px]"
        >
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between h-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="p-1.5 -ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => handleFinish('dashboard')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Skip
            </button>
          </div>

          {/* STEP 1: Welcome (Reference Design 3) */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="my-auto space-y-4 py-4"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                <Dna className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Welcome to GeneGuard AI
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Let's personalize your experience in a few simple steps.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => setStep(2)}
                  className="w-full justify-center h-11 text-xs font-bold"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Goals / Intentions (Reference Design 3) */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="my-auto space-y-4 py-2"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  What brings you here?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select all that apply
                </p>
              </div>

              <div className="space-y-2 pt-2 text-left">
                {goalsOptions.map((opt) => {
                  const isSelected = selectedGoals.includes(opt.label);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleGoal(opt.label)}
                      className={`w-full p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <opt.icon size={15} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                        <span>{opt.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setStep(3)}
                  className="w-full justify-center h-11 text-xs font-bold"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: All Set (Reference Design 3) */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="my-auto space-y-4 py-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Check size={32} strokeWidth={3} />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  You're all set!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Let's upload your first report or start your assessment to get personalized insights.
                </p>
              </div>

              <div className="space-y-2 pt-3">
                <Button
                  onClick={() => handleFinish('upload')}
                  className="w-full justify-center h-11 text-xs font-bold"
                >
                  Upload Report
                </Button>
                <button
                  type="button"
                  onClick={() => handleFinish('dashboard')}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {/* Bottom Dot Progress Indicators (Reference Design 3) */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s
                    ? 'w-5 bg-indigo-600'
                    : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
