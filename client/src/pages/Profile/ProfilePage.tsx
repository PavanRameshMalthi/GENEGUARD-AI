import React from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { success } = useToast();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      age: '',
      bloodGroup: '',
      allergies: '',
      medications: ''
    }
  });

  const onSubmit = (data: any) => {
    success('Profile updated successfully');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Card glass className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {user?.name?.[0]?.toUpperCase() || <User size={40} />}
              </div>
              <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
              <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3 space-y-6">
            <Card glass title="Personal Information" className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" {...register('name')} />
                  <Input label="Email" {...register('email')} disabled />
                  <Input label="Age" type="number" {...register('age')} />
                  <Input label="Blood Group" {...register('bloodGroup')} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Card>
            
            <Card glass title="Medical Profile" className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Textarea label="Known Allergies" rows={2} {...register('allergies')} />
                <Textarea label="Ongoing Medications" rows={2} {...register('medications')} />
                <div className="flex justify-end">
                  <Button type="submit">Update Profile</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
