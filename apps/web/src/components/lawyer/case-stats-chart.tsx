'use client';

import { ProfileCase, CaseOutcome } from '@dingo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface CaseStatsChartProps {
  cases: ProfileCase[];
}

/**
 * CaseStatsChart component
 * Displays case outcome statistics as a bar chart
 */
const CaseStatsChart = ({ cases }: CaseStatsChartProps): JSX.Element => {
  const t = useTranslations();

  // Calculate statistics
  const stats = cases.reduce((acc, case_) => {
    acc[case_.outcome] = (acc[case_.outcome] || 0) + 1;
    return acc;
  }, {} as Record<CaseOutcome, number>);

  const total = cases.length;
  const chartData = [
    { outcome: 'WON', count: stats.WON || 0, color: '#10b981' },
    { outcome: 'SETTLED', count: stats.SETTLED || 0, color: '#3b82f6' },
    { outcome: 'ONGOING', count: stats.ONGOING || 0, color: '#f59e0b' },
    { outcome: 'LOST', count: stats.LOST || 0, color: '#ef4444' },
  ].filter(item => item.count > 0).map(item => ({
    ...item,
    name: t(`caseOutcome.${item.outcome}`),
    percentage: ((item.count / total) * 100).toFixed(1)
  }));

  // Custom label renderer for better RTL support
  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, percentage } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-gray-700 dark:fill-gray-300 text-sm font-medium"
      >
        {`${name} ${percentage}%`}
      </text>
    );
  };

  if (chartData.length === 0) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t('chart.caseOutcomes')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={renderLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} cases`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CaseStatsChart;
