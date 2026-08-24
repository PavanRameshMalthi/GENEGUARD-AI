import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Dna, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
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
    if (loading) return;
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
      if (err.response?.status === 429) {
        showError('Too many login attempts. Please wait a moment and try again.');
      } else if (err.response?.status === 401) {
        showError('Invalid email or password.');
      } else if (err.response?.status === 400) {
        showError(err.response?.data?.message || 'Invalid email or password format.');
      } else if (!err.response && (err.message?.includes('Network') || err.code === 'ERR_NETWORK')) {
        showError('Unable to connect to the server. Please try again.');
      } else {
        showError(err.response?.data?.message || err.message || 'An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Top Logo Icon (Reference Design 2) */}
      <div className="flex flex-col items-center mb-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 shadow-sm">
          <Dna className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Sign in to continue to GeneGuard AI
        </p>
      </div>

      {/* Segmented Tabs (Reference Design 2) */}
      <div className="mb-5">
        <Tabs
          tabs={[
            { id: 'login', label: 'Login' },
            { id: 'register', label: 'Sign Up' }
          ]}
          activeTab="login"
          onChange={(tab) => {
            if (tab === 'register') navigate('/register');
          }}
          fullWidth
        />
      </div>

      {/* Form */}
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
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock size={16} />}
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
            className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              {...register('rememberMe')}
              className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-3.5 w-3.5" 
            />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full justify-center h-10.5 text-xs font-bold" 
            loading={loading} 
            disabled={!isValid || loading}
            size="md"
          >
            Login
          </Button>
        </div>
      </form>

      {/* Bottom Switch Link */}
      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
