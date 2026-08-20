import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightData {
  date: string;
  weight: number;
}

interface WeightChartProps {
  data: WeightData[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const minWeight = Math.min(...data.map(d => d.weight)) - 5;
  const maxWeight = Math.max(...data.map(d => d.weight)) + 5;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis domain={[minWeight, maxWeight]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightChart;
