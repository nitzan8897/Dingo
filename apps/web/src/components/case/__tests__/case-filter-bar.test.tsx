import { render, screen, fireEvent } from '@testing-library/react';
import CaseFilterBar from '../case-filter-bar';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'case.searchPlaceholder': 'Search cases...',
      'case.filterBySpecialty': 'Filter by specialty',
      'case.filterByStatus': 'Filter by status',
      'case.filterByYear': 'Filter by year',
    };
    return translations[key] || key;
  },
}));

describe('CaseFilterBar', () => {
  const mockProps = {
    searchQuery: '',
    onSearchChange: jest.fn(),
    selectedSpecialty: undefined,
    onSpecialtyChange: jest.fn(),
    selectedStatus: undefined,
    onStatusChange: jest.fn(),
    selectedYear: undefined,
    onYearChange: jest.fn(),
    availableYears: [2024, 2023, 2022],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    render(<CaseFilterBar {...mockProps} />);
    expect(
      screen.getByPlaceholderText('Search cases...')
    ).toBeInTheDocument();
  });

  it('should call onSearchChange when typing in search input', () => {
    render(<CaseFilterBar {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Search cases...');

    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockProps.onSearchChange).toHaveBeenCalledWith('test search');
  });

  it('should render specialty filter section', () => {
    render(<CaseFilterBar {...mockProps} />);
    expect(screen.getByText('Filter by specialty')).toBeInTheDocument();
  });

  it('should render status filter section', () => {
    render(<CaseFilterBar {...mockProps} />);
    expect(screen.getByText('Filter by status')).toBeInTheDocument();
  });

  it('should render year filter section when years are available', () => {
    render(<CaseFilterBar {...mockProps} />);
    expect(screen.getByText('Filter by year')).toBeInTheDocument();
  });

  it('should not render year filter section when no years available', () => {
    const propsWithoutYears = { ...mockProps, availableYears: [] };
    render(<CaseFilterBar {...propsWithoutYears} />);
    expect(screen.queryByText('Filter by year')).not.toBeInTheDocument();
  });

  it('should display current search value', () => {
    const propsWithSearch = { ...mockProps, searchQuery: 'existing search' };
    render(<CaseFilterBar {...propsWithSearch} />);
    const searchInput = screen.getByPlaceholderText('Search cases...');
    expect(searchInput).toHaveValue('existing search');
  });
});
