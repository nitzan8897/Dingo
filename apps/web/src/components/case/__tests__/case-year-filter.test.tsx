import { render, screen, fireEvent } from '@testing-library/react';
import CaseYearFilter from '../case-year-filter';

// Mock the Select components
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, dir }: any) => (
    <div data-testid="select-root" dir={dir}>
      <select
        data-testid="select-trigger"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      filterByYear: 'Filter by year',
      allYears: 'All Years',
    };
    return translations[key] || key;
  },
  useLocale: jest.fn(() => 'en'),
}));

describe('CaseYearFilter', () => {
  const mockProps = {
    selectedYear: undefined,
    onYearChange: jest.fn(),
    availableYears: [2024, 2023, 2022, 2021],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when availableYears is empty', () => {
    const { container } = render(
      <CaseYearFilter {...mockProps} availableYears={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render select component', () => {
    render(<CaseYearFilter {...mockProps} />);
    expect(screen.getByTestId('select-root')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
  });

  it('should render "All Years" option and all available years', () => {
    render(<CaseYearFilter {...mockProps} />);

    const select = screen.getByTestId('select-trigger');
    const options = select.querySelectorAll('option');

    // Should have "All Years" + 4 year options
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveValue('all');
    expect(options[0]).toHaveTextContent('All Years');

    mockProps.availableYears.forEach((year, index) => {
      expect(options[index + 1]).toHaveValue(year.toString());
      expect(options[index + 1]).toHaveTextContent(year.toString());
    });
  });

  it('should call onYearChange with undefined when "All Years" is selected', () => {
    const onYearChange = jest.fn();
    render(<CaseYearFilter {...mockProps} onYearChange={onYearChange} />);

    const select = screen.getByTestId('select-trigger');
    fireEvent.change(select, { target: { value: 'all' } });

    expect(onYearChange).toHaveBeenCalledWith(undefined);
  });

  it('should call onYearChange with year number when a year is selected', () => {
    const onYearChange = jest.fn();
    render(<CaseYearFilter {...mockProps} onYearChange={onYearChange} />);

    const select = screen.getByTestId('select-trigger');
    fireEvent.change(select, { target: { value: '2023' } });

    expect(onYearChange).toHaveBeenCalledWith(2023);
  });

  it('should display selected year value', () => {
    render(<CaseYearFilter {...mockProps} selectedYear={2023} />);

    const select = screen.getByTestId('select-trigger');
    expect(select).toHaveValue('2023');
  });

  it('should display "all" value when no year is selected', () => {
    render(<CaseYearFilter {...mockProps} selectedYear={undefined} />);

    const select = screen.getByTestId('select-trigger');
    expect(select).toHaveValue('all');
  });

  it('should set LTR direction for English locale', () => {
    const { useLocale } = require('next-intl');
    useLocale.mockReturnValue('en');

    render(<CaseYearFilter {...mockProps} />);
    const selectRoot = screen.getByTestId('select-root');
    expect(selectRoot).toHaveAttribute('dir', 'ltr');
  });

  it('should set RTL direction for Hebrew locale', () => {
    const { useLocale } = require('next-intl');
    useLocale.mockReturnValue('he');

    render(<CaseYearFilter {...mockProps} />);
    const selectRoot = screen.getByTestId('select-root');
    expect(selectRoot).toHaveAttribute('dir', 'rtl');
  });

  it('should handle year selection correctly when selectedYear changes', () => {
    const { rerender } = render(
      <CaseYearFilter {...mockProps} selectedYear={2024} />
    );

    let select = screen.getByTestId('select-trigger');
    expect(select).toHaveValue('2024');

    rerender(<CaseYearFilter {...mockProps} selectedYear={2022} />);

    select = screen.getByTestId('select-trigger');
    expect(select).toHaveValue('2022');
  });

  it('should render years in the order they are provided', () => {
    const unsortedYears = [2021, 2024, 2022, 2023];
    render(<CaseYearFilter {...mockProps} availableYears={unsortedYears} />);

    const select = screen.getByTestId('select-trigger');
    const options = select.querySelectorAll('option');

    // First option is "All Years", then the years in provided order
    const yearTexts = Array.from(options)
      .slice(1)
      .map((el) => el.textContent);

    expect(yearTexts).toEqual(['2021', '2024', '2022', '2023']);
  });

  it('should handle conversion of string to number correctly', () => {
    const onYearChange = jest.fn();
    render(<CaseYearFilter {...mockProps} onYearChange={onYearChange} />);

    const select = screen.getByTestId('select-trigger');

    // Test with a year string
    fireEvent.change(select, { target: { value: '2024' } });
    expect(onYearChange).toHaveBeenCalledWith(2024);
    expect(typeof onYearChange.mock.calls[0][0]).toBe('number');

    // Test with 'all' string
    onYearChange.mockClear();
    fireEvent.change(select, { target: { value: 'all' } });
    expect(onYearChange).toHaveBeenCalledWith(undefined);
  });

  it('should correctly identify Hebrew locale as RTL', () => {
    const { useLocale } = require('next-intl');
    useLocale.mockReturnValue('he');

    render(<CaseYearFilter {...mockProps} />);
    const selectRoot = screen.getByTestId('select-root');

    expect(selectRoot.getAttribute('dir')).toBe('rtl');
  });

  it('should correctly identify non-Hebrew locale as LTR', () => {
    const { useLocale } = require('next-intl');

    // Test with English
    useLocale.mockReturnValue('en');
    const { rerender, container } = render(<CaseYearFilter {...mockProps} />);
    let selectRoot = screen.getByTestId('select-root');
    expect(selectRoot.getAttribute('dir')).toBe('ltr');

    // Test with another locale
    useLocale.mockReturnValue('fr');
    rerender(<CaseYearFilter {...mockProps} />);
    selectRoot = screen.getByTestId('select-root');
    expect(selectRoot.getAttribute('dir')).toBe('ltr');
  });
});
