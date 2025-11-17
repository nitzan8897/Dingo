import { render, screen } from '@testing-library/react';
import CaseStatsChart from '../case-stats-chart';
import { Case } from '@dingo/types';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'caseOutcome.WON': 'Won',
      'caseOutcome.LOST': 'Lost',
      'caseOutcome.SETTLED': 'Settled',
      'caseOutcome.ONGOING': 'Ongoing',
    };
    return translations[key] || key;
  },
}));

// Mock recharts to avoid canvas/SVG rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
    <div data-testid="bar-chart" data-chart-length={data.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey }: { dataKey: string }) => <div data-testid={`bar-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />,
}));

describe('CaseStatsChart', () => {
  const createMockCase = (outcome: 'WON' | 'LOST' | 'SETTLED' | 'ONGOING', id: string): Case => ({
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
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('should render empty fragment when no cases', () => {
    const { container } = render(<CaseStatsChart cases={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should include only outcomes that have cases', () => {
    const cases = [createMockCase('WON', '1'), createMockCase('WON', '2')];
    const { container } = render(<CaseStatsChart cases={cases} />);
    const chart = container.querySelector('[data-chart-length]');
    expect(chart?.getAttribute('data-chart-length')).toBe('1'); // Only WON outcome
  });

  it('should handle multiple different outcomes', () => {
    const cases = [
      createMockCase('WON', '1'),
      createMockCase('LOST', '2'),
      createMockCase('SETTLED', '3'),
      createMockCase('ONGOING', '4'),
    ];
    const { container } = render(<CaseStatsChart cases={cases} />);
    const chart = container.querySelector('[data-chart-length]');
    expect(chart?.getAttribute('data-chart-length')).toBe('4'); // All 4 outcomes
  });

  it('should aggregate multiple cases of same outcome', () => {
    const cases = [
      createMockCase('WON', '1'),
      createMockCase('WON', '2'),
      createMockCase('WON', '3'),
      createMockCase('LOST', '4'),
    ];
    const { container } = render(<CaseStatsChart cases={cases} />);
    const chart = container.querySelector('[data-chart-length]');
    expect(chart?.getAttribute('data-chart-length')).toBe('2'); // WON and LOST
  });
});
