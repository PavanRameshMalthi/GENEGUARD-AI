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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card glass padding="lg" className="shadow-2xl">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <Input
                  label="Email Address"
                  type="email"
                  icon={<Mail size={18} />}
                  placeholder="you@example.com"
                  {...register('email', {
                    validate: (val) => validateEmail(val) || true
                  })}
                  error={dirtyFields.email ? (errors.email?.message as string) : undefined}
                  isSuccess={Boolean(dirtyFields.email && !errors.email)}
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  loading={loading} 
                  disabled={!isValid || loading}
                  size="lg"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={32} />
              </motion.div>
              <h2 className="text-2xl font-bold mb-4">Check your email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
                We've sent password reset instructions to <strong>{getValues('email')}</strong>
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
