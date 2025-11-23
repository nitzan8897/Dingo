import { render, screen } from '@testing-library/react';
import CaseCard from '../case-card';
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

describe('CaseCard', () => {
  const mockCase: ProfileCase = {
    id: '1',
    lawyerId: 'lawyer-1',
    titleEn: 'Test Case English',
    titleHe: 'מקרה בדיקה',
    descriptionEn: 'This is a test case description in English',
    descriptionHe: 'זהו תיאור מקרה בדיקה בעברית',
    outcome: 'WON',
    year: 2023,
    isFeatured: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  it('should render case title in English', () => {
    render(<CaseCard case_={mockCase} locale="en" />);
    expect(screen.getByText('Test Case English')).toBeInTheDocument();
  });

  it('should render case title in Hebrew', () => {
    render(<CaseCard case_={mockCase} locale="he" />);
    expect(screen.getByText('מקרה בדיקה')).toBeInTheDocument();
  });

  it('should render case description in English', () => {
    render(<CaseCard case_={mockCase} locale="en" />);
    expect(screen.getByText('This is a test case description in English')).toBeInTheDocument();
  });

  it('should render case description in Hebrew', () => {
    render(<CaseCard case_={mockCase} locale="he" />);
    expect(screen.getByText('זהו תיאור מקרה בדיקה בעברית')).toBeInTheDocument();
  });

  it('should render case year', () => {
    render(<CaseCard case_={mockCase} locale="en" />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('should render case outcome badge', () => {
    render(<CaseCard case_={mockCase} locale="en" />);
    expect(screen.getByText('Won')).toBeInTheDocument();
  });

  it('should render correct outcome for LOST cases', () => {
    const lostCase = { ...mockCase, outcome: 'LOST' as const };
    render(<CaseCard case_={lostCase} locale="en" />);
    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('should render correct outcome for SETTLED cases', () => {
    const settledCase = { ...mockCase, outcome: 'SETTLED' as const };
    render(<CaseCard case_={settledCase} locale="en" />);
    expect(screen.getByText('Settled')).toBeInTheDocument();
  });

  it('should render correct outcome for ONGOING cases', () => {
    const ongoingCase = { ...mockCase, outcome: 'ONGOING' as const };
    render(<CaseCard case_={ongoingCase} locale="en" />);
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });
});
