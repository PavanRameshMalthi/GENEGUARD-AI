import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Moon, Sun } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile & Settings</h1>
      </div>
      <Card className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl">
          <User />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-slate-500">{user?.email}</p>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-xl font-bold mb-4">Preferences</h3>
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white">Appearance</h4>
            <p className="text-sm text-slate-500">Toggle light and dark mode</p>
          </div>
          <Button variant="outline" onClick={toggleTheme} className="gap-2">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
