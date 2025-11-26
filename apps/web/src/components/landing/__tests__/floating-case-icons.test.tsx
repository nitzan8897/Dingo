import { render } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import FloatingCaseIcons from '../floating-case-icons';
import { Case } from '@dingo/types';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('FloatingCaseIcons', () => {
  const mockPush = jest.fn();
  const mockCases: Case[] = [
    {
      id: '1',
      externalId: 'CASE-001',
      title: 'Criminal Defense Case',
      specialty: 'CRIMINAL',
      result: 'DEFENCE_WON',
      judgeName: 'Judge Smith',
      complexityScore: 8,
      rawText: 'Case details...',
      plaintiffLawyerIds: [],
      defendantLawyerIds: ['lawyer-1'],
      associatedLawyerIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      externalId: 'CASE-002',
      title: 'Civil Litigation Matter',
      specialty: 'CIVIL',
      result: 'settlement',
      judgeName: 'Judge Johnson',
      complexityScore: 6,
      rawText: 'Case details...',
      plaintiffLawyerIds: ['lawyer-2'],
      defendantLawyerIds: [],
      associatedLawyerIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render case tooltips with case titles', () => {
    const { container } = render(<FloatingCaseIcons cases={mockCases} />);

    // Check that case titles are in the DOM
    expect(container.textContent).toContain('Criminal Defense Case');
    expect(container.textContent).toContain('Civil Litigation Matter');
  });

  it('should render correct number of case icons', () => {
    const { container } = render(<FloatingCaseIcons cases={mockCases} />);

    // Find all floating icon elements
    const icons = container.querySelectorAll('.floating-icon');
    expect(icons).toHaveLength(2);
  });

  it('should have tooltip text that is not empty', () => {
    const { container } = render(<FloatingCaseIcons cases={mockCases} />);

    // Find all tooltip divs (they have z-[999] class)
    const tooltips = container.querySelectorAll('.z-\\[999\\]');

    tooltips.forEach((tooltip) => {
      // Each tooltip should have non-empty text content
      expect(tooltip.textContent).toBeTruthy();
      expect(tooltip.textContent!.trim().length).toBeGreaterThan(0);
    });
  });

  it('should use correct field name from Case type', () => {
    const { container } = render(<FloatingCaseIcons cases={mockCases} />);

    // Verify that the component accesses title, not name
    mockCases.forEach((caseItem) => {
      expect(container.textContent).toContain(caseItem.title);
    });
  });

  it('should render tooltips with proper styling for visibility', () => {
    const { container } = render(<FloatingCaseIcons cases={mockCases} />);

    const tooltips = container.querySelectorAll('.z-\\[999\\]');

    tooltips.forEach((tooltip) => {
      // Check that tooltip has black background for visibility
      expect(tooltip.className).toContain('bg-black');
      // Check that tooltip has white text
      expect(tooltip.className).toContain('text-white');
      // Check that tooltip has semibold font weight
      expect(tooltip.className).toContain('font-semibold');
    });
  });
});
