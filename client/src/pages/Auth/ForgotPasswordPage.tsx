import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Dna, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateEmail, sanitizeText } from '@/utils/validation';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid, dirtyFields }, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Simulate recovery link dispatch
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <AuthLayout>
      {/* Top Logo Icon */}
      <div className="flex flex-col items-center mb-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 shadow-sm">
          <Dna className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Enter your email to receive recovery instructions
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          <Input
            label="Email"
            type="email"
            icon={<Mail size={16} />}
            placeholder="name@example.com"
            {...register('email', {
              validate: (val) => validateEmail(val) || true
            })}
            error={dirtyFields.email ? (errors.email?.message as string) : undefined}
            isSuccess={Boolean(dirtyFields.email && !errors.email)}
            required
          />
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full justify-center h-10.5 text-xs font-bold" 
              loading={loading} 
              disabled={!isValid || loading}
              size="md"
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 space-y-3">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Check your inbox
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            We've sent recovery instructions to <strong className="text-slate-800 dark:text-slate-200">{getValues('email')}</strong>
          </p>
        </div>
      )}

      <div className="mt-5 text-center">
        <Link to="/login" className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors">
          <ArrowLeft size={13} className="mr-1.5" />
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
