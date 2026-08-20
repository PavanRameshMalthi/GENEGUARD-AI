import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Card glass title="Appearance" className="p-6">
          <div className="flex gap-4">
            <button onClick={() => setTheme('light')} className={`flex-1 py-4 border rounded-xl flex flex-col items-center gap-2 ${theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <Sun size={24} /> Light
            </button>
            <button onClick={() => setTheme('dark')} className={`flex-1 py-4 border rounded-xl flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <Moon size={24} /> Dark
            </button>
            <button onClick={() => setTheme('system')} className={`flex-1 py-4 border rounded-xl flex flex-col items-center gap-2 ${theme === 'system' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <Monitor size={24} /> System
            </button>
          </div>
        </Card>

        <Card glass title="Notifications" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Alerts</h4>
                <p className="text-sm text-gray-500">Receive weekly health summaries.</p>
              </div>
              <input type="checkbox" className="toggle-checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-gray-500">Get notified for daily recommendations.</p>
              </div>
              <input type="checkbox" className="toggle-checkbox" defaultChecked />
            </div>
          </div>
        </Card>
        
        <Card glass title="Account" className="p-6 border-red-200 dark:border-red-900/50">
          <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete Account</Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
