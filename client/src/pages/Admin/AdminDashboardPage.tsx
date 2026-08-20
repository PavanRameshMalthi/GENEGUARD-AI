import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { Users, FileText, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glass className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </Card>
          <Card glass className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">Assessments</p>
              <h3 className="text-2xl font-bold">3,842</h3>
            </div>
          </Card>
          <Card glass className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">Reports Analyzed</p>
              <h3 className="text-2xl font-bold">856</h3>
            </div>
          </Card>
        </div>

        <Card glass title="Recent Users" className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-4 font-medium border-b dark:border-gray-700">Name</th>
                  <th className="p-4 font-medium border-b dark:border-gray-700">Email</th>
                  <th className="p-4 font-medium border-b dark:border-gray-700">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b dark:border-gray-700">John Doe</td>
                  <td className="p-4 border-b dark:border-gray-700">john@example.com</td>
                  <td className="p-4 border-b dark:border-gray-700">User</td>
                </tr>
                <tr>
                  <td className="p-4 border-b dark:border-gray-700">Jane Smith</td>
                  <td className="p-4 border-b dark:border-gray-700">jane@example.com</td>
                  <td className="p-4 border-b dark:border-gray-700">Admin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
