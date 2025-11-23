import { render, screen } from '@testing-library/react';
import CaseStatsChart from '../case-stats-chart';
import { ProfileCase } from '@dingo/types';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'caseOutcome.WON': 'Won',
      'caseOutcome.LOST': 'Lost',
      'caseOutcome.SETTLED': 'Settled',
      'caseOutcome.ONGOING': 'Ongoing',
      'chart.caseOutcomes': 'Case Outcomes',
    };
    return translations[key] || key;
  },
}));

// Mock recharts to avoid canvas/SVG rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data, dataKey }: { data: unknown[]; dataKey: string }) => (
    <div data-testid={`pie-${dataKey}`} data-chart-length={data.length} />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Cell: () => <div data-testid="cell" />,
}));

describe('CaseStatsChart', () => {
  const createMockCase = (outcome: 'WON' | 'LOST' | 'SETTLED' | 'ONGOING', id: string): ProfileCase => ({
    id,
    lawyerId: 'lawyer-1',
    titleEn: `Case ${id}`,
    titleHe: `תיק ${id}`,
    descriptionEn: 'Description',
    descriptionHe: 'תיאור',
    outcome,
    year: 2023,
    isFeatured: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  it('should render chart title', () => {
    const cases = [createMockCase('WON', '1')];
    render(<CaseStatsChart cases={cases} />);
    expect(screen.getByText('Case Outcomes')).toBeInTheDocument();
  });

  it('should render chart components', () => {
    const cases = [createMockCase('WON', '1'), createMockCase('LOST', '2')];
    render(<CaseStatsChart cases={cases} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should render empty fragment when no cases', () => {
    const { container } = render(<CaseStatsChart cases={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should include only outcomes that have cases', () => {
    const cases = [createMockCase('WON', '1'), createMockCase('WON', '2')];
    render(<CaseStatsChart cases={cases} />);
    const pie = screen.getByTestId('pie-count');
    expect(pie.getAttribute('data-chart-length')).toBe('1'); // Only WON outcome
  });

  it('should handle multiple different outcomes', () => {
    const cases = [
      createMockCase('WON', '1'),
      createMockCase('LOST', '2'),
      createMockCase('SETTLED', '3'),
      createMockCase('ONGOING', '4'),
    ];
    render(<CaseStatsChart cases={cases} />);
    const pie = screen.getByTestId('pie-count');
    expect(pie.getAttribute('data-chart-length')).toBe('4'); // All 4 outcomes
  });

  it('should aggregate multiple cases of same outcome', () => {
    const cases = [
      createMockCase('WON', '1'),
      createMockCase('WON', '2'),
      createMockCase('WON', '3'),
      createMockCase('LOST', '4'),
    ];
    render(<CaseStatsChart cases={cases} />);
    const pie = screen.getByTestId('pie-count');
    expect(pie.getAttribute('data-chart-length')).toBe('2'); // WON and LOST
  });
});
