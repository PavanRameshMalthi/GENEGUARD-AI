import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaterData {
  day: string;
  glasses: number;
}

interface WaterIntakeChartProps {
  data: WaterData[];
}

const WaterIntakeChart: React.FC<WaterIntakeChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
        />
        <Bar dataKey="glasses" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WaterIntakeChart;
