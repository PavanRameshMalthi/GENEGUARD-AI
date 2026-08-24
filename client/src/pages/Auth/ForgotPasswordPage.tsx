import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid, dirtyFields }, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <AuthLayout>
      {!isSubmitted ? (
        <>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
              Reset Password
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your registered email address and we'll send you recovery instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              icon={<Mail size={18} />}
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
                className="w-full justify-center h-11 text-base font-semibold" 
                loading={loading} 
                disabled={!isValid || loading}
                size="md"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
            Check your email
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            We've sent recovery instructions to <strong>{getValues('email')}</strong>
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
          <ArrowLeft size={14} className="mr-1.5" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
