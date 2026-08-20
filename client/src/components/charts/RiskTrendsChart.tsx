import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RiskData {
  category: string;
  value: number;
}

interface RiskTrendsChartProps {
  data: RiskData[];
}

const RiskTrendsChart: React.FC<RiskTrendsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="rgba(156, 163, 175, 0.3)" />
        <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Radar name="Risk" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RiskTrendsChart;
