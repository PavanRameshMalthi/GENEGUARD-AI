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

export default function RegisterPage() {
  const { register: registerAuth, loading } = useAuth();
  const { error: showError, success } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data: any) => {
    try {
      await registerAuth({ name: data.name, email: data.email, password: data.password });
      success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      showError(err.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto my-8"
      >
        <Card glass padding="lg" className="shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Join GeneGuard AI for better health</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              icon={<User size={18} />}
              placeholder="John Doe"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message as string}
            />

            <Input
              label="Email Address"
              type="email"
              icon={<Mail size={18} />}
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message as string}
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock size={18} />}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                error={errors.password?.message as string}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock size={18} />}
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message as string}
            />

            <Button type="submit" className="w-full mt-6" loading={loading} size="lg">
              Register
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Log in here
            </Link>
          </p>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
