import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HealthScoreChartProps {
  score: number;
}

const HealthScoreChart: React.FC<HealthScoreChartProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];

  let color = '#ef4444'; // red
  if (score >= 70) color = '#22c55e'; // green
  else if (score >= 40) color = '#eab308'; // yellow

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          startAngle={180}
          endAngle={0}
          dataKey="value"
          stroke="none"
        >
          <Cell key="cell-0" fill={color} />
          <Cell key="cell-1" fill="rgba(156, 163, 175, 0.2)" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default HealthScoreChart;
