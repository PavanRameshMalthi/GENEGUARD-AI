import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import ProgressBar from '@/components/ui/ProgressBar';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/assessment/result/mock-id');
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Step {step} of 3</span>
            <span className="text-gray-500">{step === 1 ? 'Personal Info' : step === 2 ? 'Lifestyle' : 'Medical History'}</span>
          </div>
          <ProgressBar value={(step / 3) * 100} animated color="primary" />
        </div>

        <Card glass padding="lg">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Age" type="number" required />
                    <Select label="Gender" options={[{label: 'Male', value: 'm'}, {label: 'Female', value: 'f'}]} required />
                    <Input label="Height (cm)" type="number" required />
                    <Input label="Weight (kg)" type="number" required />
                    <Select label="Blood Group" options={[{label: 'A+', value: 'A+'}, {label: 'O+', value: 'O+'}]} required />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Lifestyle Factors</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Smoking" options={[{label: 'Never', value: 'never'}, {label: 'Current', value: 'current'}]} required />
                    <Select label="Alcohol" options={[{label: 'Never', value: 'never'}, {label: 'Moderate', value: 'moderate'}]} required />
                    <Select label="Exercise" options={[{label: 'Sedentary', value: 'sedentary'}, {label: 'Active', value: 'active'}]} required />
                    <Input label="Sleep hours" type="number" min={1} max={16} required />
                    <Input label="Water intake (glasses)" type="number" min={1} max={20} required />
                    <Select label="Stress Level" options={[{label: 'Low', value: 'low'}, {label: 'High', value: 'high'}]} required />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Medical History</h2>
                  <Textarea label="Family History" rows={3} placeholder="Describe family medical conditions" />
                  <Textarea label="Medical History" rows={3} placeholder="Previous/current conditions" />
                  <Textarea label="Current Symptoms" rows={3} placeholder="Any symptoms you are experiencing" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>Back</Button>
              {step < 3 ? (
                <Button type="button" onClick={handleNext}>Next Step</Button>
              ) : (
                <Button type="submit">Submit Assessment</Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      <Modal isOpen={isSubmitting} onClose={() => {}} title="Analyzing Data...">
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium animate-pulse">AI is processing your health profile...</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
