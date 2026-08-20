import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface BMIChartProps {
  bmi: number;
  category: string;
}

const BMIChart: React.FC<BMIChartProps> = ({ bmi, category }) => {
  const data = [{ name: 'BMI', value: bmi }];
  
  const getColor = (val: number) => {
    if (val < 18.5) return '#3b82f6';
    if (val < 25) return '#22c55e';
    if (val < 30) return '#eab308';
    return '#ef4444';
  };

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <XAxis type="number" domain={[10, 40]} hide />
        <YAxis type="category" dataKey="name" hide />
        <Tooltip cursor={{fill: 'transparent'}} />
        <Bar dataKey="value" barSize={20} radius={[10, 10, 10, 10]}>
          <Cell fill={getColor(bmi)} />
        </Bar>
        <ReferenceLine x={18.5} stroke="#6b7280" strokeDasharray="3 3" />
        <ReferenceLine x={25} stroke="#6b7280" strokeDasharray="3 3" />
        <ReferenceLine x={30} stroke="#6b7280" strokeDasharray="3 3" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BMIChart;
