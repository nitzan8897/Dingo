'use client';

import { Case, CaseOutcome } from '@dingo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CaseStatsChartProps {
  cases: Case[];
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

  const chartData = [
    { outcome: 'WON', count: stats.WON || 0, color: '#10b981' },
    { outcome: 'SETTLED', count: stats.SETTLED || 0, color: '#3b82f6' },
    { outcome: 'ONGOING', count: stats.ONGOING || 0, color: '#f59e0b' },
    { outcome: 'LOST', count: stats.LOST || 0, color: '#ef4444' },
  ].filter(item => item.count > 0);

  if (chartData.length === 0) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Case Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="outcome"
              tickFormatter={(value) => t(`caseOutcome.${value}`)}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => t(`caseOutcome.${value}`)}
              formatter={(value) => [value, 'Cases']}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CaseStatsChart;
