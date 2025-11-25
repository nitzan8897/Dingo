import { render, screen, fireEvent } from '@testing-library/react';
import NavigationSidebar from '../navigation-sidebar';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
  usePathname: () => '/en',
}));

describe('NavigationSidebar', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
  });

  it('should render navigation links when open', () => {
    render(<NavigationSidebar open={true} onOpenChange={mockOnOpenChange} />);

    const homeLinks = screen.getAllByText('home');
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(screen.getByText('lawyers')).toBeInTheDocument();
    expect(screen.getByText('cases')).toBeInTheDocument();
  });

  it('should call onOpenChange when a link is clicked', () => {
    render(<NavigationSidebar open={true} onOpenChange={mockOnOpenChange} />);

    const lawyersLink = screen.getByText('lawyers');
    fireEvent.click(lawyersLink);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not render when closed', () => {
    const { container } = render(
      <NavigationSidebar open={false} onOpenChange={mockOnOpenChange} />
    );

    const sheetContent = container.querySelector('[role="dialog"]');
    expect(sheetContent).not.toBeInTheDocument();
  });
});
