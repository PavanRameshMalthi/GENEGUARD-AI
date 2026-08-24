import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { validateEmail, validatePassword, sanitizeText } from '@/utils/validation';

export default function LoginPage() {
  const { login } = useAuth();
  const { error: showError, success } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isValid, dirtyFields } } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const sanitizedEmail = sanitizeText(data.email).toLowerCase();
      const loggedInUser = await login({ email: sanitizedEmail, password: data.password });
      success('Logged in successfully!');
      if (loggedInUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Failed to login';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sign in to access your preventive health dashboard
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
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock size={18} />}
            placeholder="••••••••"
            {...register('password', {
              validate: (val) => validatePassword(val) || true
            })}
            error={dirtyFields.password ? (errors.password?.message as string) : undefined}
            isSuccess={Boolean(dirtyFields.password && !errors.password)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              {...register('rememberMe')}
              className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4" 
            />
            <span className="text-slate-600 dark:text-slate-400">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full justify-center h-11 text-base font-semibold" 
            loading={loading} 
            disabled={!isValid || loading}
            size="md"
          >
            Sign In
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
