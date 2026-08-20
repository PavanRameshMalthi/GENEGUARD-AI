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
import { assessmentService } from '@/services/assessment.service';
import { useToast } from '@/hooks/useToast';
import { BLOOD_GROUPS, GENDERS } from '@/utils/constants';

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { error: showError } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    personalInfo: { name: '', age: '', gender: '', height: '', weight: '', bloodGroup: '' },
    lifestyle: { smoking: 'never', alcohol: 'never', exercise: 'sedentary', sleep: '', waterIntake: '', stress: 'low' },
    medical: { familyHistory: '', medicalHistory: '', symptoms: '' }
  });

  const updateField = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev as any)[section], [field]: value }
    }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        personalInfo: {
          ...formData.personalInfo,
          age: Number(formData.personalInfo.age) || 0,
          height: Number(formData.personalInfo.height) || 0,
          weight: Number(formData.personalInfo.weight) || 0,
        },
        lifestyle: {
          ...formData.lifestyle,
          sleep: Number(formData.lifestyle.sleep) || 0,
          waterIntake: Number(formData.lifestyle.waterIntake) || 0,
        },
        medical: {
          familyHistory: formData.medical.familyHistory.split(',').map(s => s.trim()).filter(Boolean),
          medicalHistory: formData.medical.medicalHistory.split(',').map(s => s.trim()).filter(Boolean),
          symptoms: formData.medical.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        }
      };

      const res = await assessmentService.createAssessment(payload);
      const assessment = res.data || res;
      const assessmentId = assessment?._id || assessment?.id;
      
      if (assessmentId) {
        navigate(`/assessment/${assessmentId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create assessment. Please try again.';
      showError(msg);
      setIsSubmitting(false);
    }
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
                    <Input label="Name" type="text" value={formData.personalInfo.name} onChange={e => updateField('personalInfo', 'name', e.target.value)} required />
                    <Input label="Age" type="number" value={formData.personalInfo.age} onChange={e => updateField('personalInfo', 'age', e.target.value)} required />
                    <Select label="Gender" value={formData.personalInfo.gender} onChange={e => updateField('personalInfo', 'gender', e.target.value)} options={GENDERS.map(g => ({ label: g, value: g.toLowerCase() }))} required />
                    <Input label="Height (cm)" type="number" value={formData.personalInfo.height} onChange={e => updateField('personalInfo', 'height', e.target.value)} required />
                    <Input label="Weight (kg)" type="number" value={formData.personalInfo.weight} onChange={e => updateField('personalInfo', 'weight', e.target.value)} required />
                    <Select label="Blood Group" value={formData.personalInfo.bloodGroup} onChange={e => updateField('personalInfo', 'bloodGroup', e.target.value)} options={BLOOD_GROUPS.map(b => ({ label: b, value: b }))} required />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Lifestyle Factors</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Smoking" value={formData.lifestyle.smoking} onChange={e => updateField('lifestyle', 'smoking', e.target.value)} options={[{label: 'Never', value: 'never'}, {label: 'Former', value: 'former'}, {label: 'Current', value: 'current'}]} required />
                    <Select label="Alcohol" value={formData.lifestyle.alcohol} onChange={e => updateField('lifestyle', 'alcohol', e.target.value)} options={[{label: 'Never', value: 'never'}, {label: 'Occasional', value: 'occasional'}, {label: 'Moderate', value: 'moderate'}, {label: 'Heavy', value: 'heavy'}]} required />
                    <Select label="Exercise" value={formData.lifestyle.exercise} onChange={e => updateField('lifestyle', 'exercise', e.target.value)} options={[{label: 'Sedentary', value: 'sedentary'}, {label: 'Light', value: 'light'}, {label: 'Moderate', value: 'moderate'}, {label: 'Active', value: 'active'}]} required />
                    <Input label="Sleep hours" type="number" min={1} max={16} value={formData.lifestyle.sleep} onChange={e => updateField('lifestyle', 'sleep', e.target.value)} required />
                    <Input label="Water intake (glasses)" type="number" min={1} max={20} value={formData.lifestyle.waterIntake} onChange={e => updateField('lifestyle', 'waterIntake', e.target.value)} required />
                    <Select label="Stress Level" value={formData.lifestyle.stress} onChange={e => updateField('lifestyle', 'stress', e.target.value)} options={[{label: 'Low', value: 'low'}, {label: 'Moderate', value: 'moderate'}, {label: 'High', value: 'high'}, {label: 'Very High', value: 'very-high'}]} required />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Medical History</h2>
                  <Textarea label="Family History" rows={3} placeholder="Diabetes, Hypertension, Heart Disease (comma separated)" value={formData.medical.familyHistory} onChange={e => updateField('medical', 'familyHistory', e.target.value)} />
                  <Textarea label="Medical History" rows={3} placeholder="Previous/current conditions (comma separated)" value={formData.medical.medicalHistory} onChange={e => updateField('medical', 'medicalHistory', e.target.value)} />
                  <Textarea label="Current Symptoms" rows={3} placeholder="Any symptoms you are experiencing (comma separated)" value={formData.medical.symptoms} onChange={e => updateField('medical', 'symptoms', e.target.value)} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>Back</Button>
              {step < 3 ? (
                <Button type="button" onClick={handleNext}>Next Step</Button>
              ) : (
                <Button type="submit" loading={isSubmitting}>Submit Assessment</Button>
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
