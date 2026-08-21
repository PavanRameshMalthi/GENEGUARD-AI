import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/user.service';
import { User } from 'lucide-react';
import { BLOOD_GROUPS } from '@/utils/constants';
import { validateName, validateAge, sanitizeText } from '@/utils/validation';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { success, error: showError } = useToast();
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingMedical, setLoadingMedical] = useState(false);

  const { 
    register: registerPersonal, 
    handleSubmit: handleSubmitPersonal, 
    formState: { errors: personalErrors, isValid: isPersonalValid } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      age: user?.profile?.age ? String(user.profile.age) : '',
      bloodGroup: user?.profile?.bloodGroup || ''
    }
  });

  const { 
    register: registerMedical, 
    handleSubmit: handleSubmitMedical 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      allergies: (user?.profile?.medicalHistory || []).join(', ') || '',
      medications: ''
    }
  });

  const onSubmitPersonal = async (data: any) => {
    setLoadingPersonal(true);
    try {
      const sanitizedName = sanitizeText(data.name);
      const sanitizedAge = data.age ? Math.round(Number(data.age)) : undefined;

      const payload = {
        name: sanitizedName,
        age: sanitizedAge,
        bloodGroup: data.bloodGroup || undefined
      };

      const res = await userService.updateProfile(payload);
      const updated = res.data || res;
      if (updated) {
        updateUser(updated);
      }
      success('Personal information updated successfully');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingPersonal(false);
    }
  };

  const onSubmitMedical = async (data: any) => {
    setLoadingMedical(true);
    try {
      const allergiesList = data.allergies
        ? data.allergies.split(',').map((s: string) => sanitizeText(s)).filter(Boolean)
        : [];

      const payload = {
        medicalHistory: allergiesList
      };

      const res = await userService.updateProfile(payload);
      const updated = res.data || res;
      if (updated) {
        updateUser(updated);
      }
      success('Medical profile updated successfully');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to update medical profile');
    } finally {
      setLoadingMedical(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Card glass className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
                {user?.name?.[0]?.toUpperCase() || <User size={40} />}
              </div>
              <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
              <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
              <div className="mt-4 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                {user?.role || 'Member'}
              </div>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3 space-y-6">
            <Card glass title="Personal Information" className="p-6">
              <form onSubmit={handleSubmitPersonal(onSubmitPersonal)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Full Name" 
                    {...registerPersonal('name', {
                      validate: (val) => validateName(val) || true
                    })}
                    error={personalErrors.name?.message as string}
                    required
                  />
                  <Input 
                    label="Email" 
                    value={user?.email || ''} 
                    disabled 
                    helperText="Email address cannot be changed."
                  />
                  <Input 
                    label="Age" 
                    type="number" 
                    min={1} 
                    max={120} 
                    step="1"
                    integerOnly
                    placeholder="1–120"
                    {...registerPersonal('age', {
                      validate: (val) => (!val ? true : validateAge(val) || true)
                    })}
                    error={personalErrors.age?.message as string}
                    helperText="Allowed range: 1–120 years."
                  />
                  <Select 
                    label="Blood Group" 
                    {...registerPersonal('bloodGroup')}
                    options={[
                      { label: 'Select Blood Group', value: '' },
                      ...BLOOD_GROUPS.map(b => ({ label: b, value: b }))
                    ]}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" loading={loadingPersonal} disabled={!isPersonalValid || loadingPersonal}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
            
            <Card glass title="Medical Profile" className="p-6">
              <form onSubmit={handleSubmitMedical(onSubmitMedical)} className="space-y-4">
                <Textarea 
                  label="Known Allergies (Comma-separated)" 
                  rows={2} 
                  placeholder="e.g. Peanuts, Dust, Penicillin"
                  {...registerMedical('allergies')} 
                  helperText="Separate multiple allergies with commas."
                />
                <Textarea 
                  label="Ongoing Medications (Optional)" 
                  rows={2} 
                  placeholder="e.g. Vitamin D 1000IU, Multivitamins"
                  {...registerMedical('medications')} 
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit" loading={loadingMedical} disabled={loadingMedical}>
                    Update Profile
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
