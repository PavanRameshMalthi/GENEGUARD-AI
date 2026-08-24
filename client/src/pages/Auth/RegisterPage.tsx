import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { validateName, validateEmail, validatePassword, sanitizeText } from '@/utils/validation';

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const { error: showError, success } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors, isValid, dirtyFields } } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const sanitizedName = sanitizeText(data.name);
      const sanitizedEmail = sanitizeText(data.email).toLowerCase();
      const newUser = await registerAuth({ name: sanitizedName, email: sanitizedEmail, password: data.password });
      success('Account created successfully!');
      if (newUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Registration failed';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
          Create Account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Join GeneGuard AI for predictive health intelligence
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        <Input
          label="Full Name"
          type="text"
          icon={<User size={18} />}
          placeholder="Jane Doe"
          {...register('name', {
            validate: (val) => validateName(val) || true
          })}
          error={dirtyFields.name ? (errors.name?.message as string) : undefined}
          isSuccess={Boolean(dirtyFields.name && !errors.name)}
          required
        />

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

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          icon={<Lock size={18} />}
          placeholder="••••••••"
          {...register('confirmPassword', { 
            required: 'Please confirm your password.',
            validate: value => value === password || 'Passwords do not match.'
          })}
          error={dirtyFields.confirmPassword ? (errors.confirmPassword?.message as string) : undefined}
          isSuccess={Boolean(dirtyFields.confirmPassword && !errors.confirmPassword && password)}
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
            Create Account
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
