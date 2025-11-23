import { render, screen } from '@testing-library/react';
import { Case } from '@dingo/types';
import CaseCard from '../case-card';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'caseResult.DEFENCE_WON': 'Defence Won',
      'caseResult.ATTACK_WON': 'Attack Won',
      'caseResult.settlement': 'Settlement',
      'specialties.CRIMINAL': 'Criminal Law',
      'specialties.CIVIL': 'Civil Law',
      'case.viewPDF': 'View PDF',
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('CaseCard', () => {
  const mockCase: Case = {
    id: 'case-1',
    externalId: '12345-01-24',
    title: 'Test Case Title',
    specialty: 'CRIMINAL',
    result: 'DEFENCE_WON',
    judgeName: 'Judge Smith',
    pdfUrl: 'https://example.com/case.pdf',
    openedAt: new Date('2024-01-15'),
    closedAt: new Date('2024-06-20'),
    complexityScore: 0.7,
    rawText: 'Case details...',
    plaintiffLawyerIds: [],
    defendantLawyerIds: [],
    associatedLawyerIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should render case title', () => {
    render(<CaseCard case_={mockCase} />);
    expect(screen.getByText('Test Case Title')).toBeInTheDocument();
  });

  it('should render case status badge', () => {
    render(<CaseCard case_={mockCase} />);
    expect(screen.getByText('Defence Won')).toBeInTheDocument();
  });

  it('should render specialty badge', () => {
    render(<CaseCard case_={mockCase} />);
    expect(screen.getByText('Criminal Law')).toBeInTheDocument();
  });

  it('should render year badge when closedAt is present', () => {
    render(<CaseCard case_={mockCase} />);
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('should render judge name when present', () => {
    render(<CaseCard case_={mockCase} />);
    expect(screen.getByText('Judge Smith')).toBeInTheDocument();
  });

  it('should render PDF link when pdfUrl is present', () => {
    render(<CaseCard case_={mockCase} />);
    expect(screen.getByText('View PDF')).toBeInTheDocument();
  });

  it('should not render PDF link when pdfUrl is not present', () => {
    const caseWithoutPdf = { ...mockCase, pdfUrl: undefined };
    render(<CaseCard case_={caseWithoutPdf} />);
    expect(screen.queryByText('View PDF')).not.toBeInTheDocument();
  });

  it('should link to case detail page', () => {
    const { container } = render(<CaseCard case_={mockCase} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/en/cases/12345-01-24');
  });

  it('should render dates in correct format', () => {
    render(<CaseCard case_={mockCase} />);
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jun 20, 2024/)).toBeInTheDocument();
  });

  it('should apply correct status color for win', () => {
    render(<CaseCard case_={mockCase} />);
    const winBadge = screen.getByText('Defence Won');
    expect(winBadge).toHaveClass('bg-emerald-100');
  });

  it('should apply correct status color for lose', () => {
    const loseCase = { ...mockCase, result: 'ATTACK_WON' as const };
    render(<CaseCard case_={loseCase} />);
    const loseBadge = screen.getByText('Attack Won');
    expect(loseBadge).toHaveClass('bg-red-100');
  });

  it('should apply correct status color for settlement', () => {
    const settlementCase = { ...mockCase, result: 'settlement' as const };
    render(<CaseCard case_={settlementCase} />);
    const settlementBadge = screen.getByText('Settlement');
    expect(settlementBadge).toHaveClass('bg-blue-100');
  });
});
