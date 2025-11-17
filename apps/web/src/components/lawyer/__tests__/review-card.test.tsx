import { render, screen } from '@testing-library/react';
import ReviewCard from '../review-card';
import { Review } from '@dingo/types';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('ReviewCard', () => {
  const mockReview: Review = {
    id: '1',
    lawyerId: 'lawyer-1',
    reviewerName: 'John Doe',
    rating: 5,
    commentEn: 'Excellent service and professional approach.',
    commentHe: 'שירות מעולה וגישה מקצועית.',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15'),
  };

  it('should render reviewer name', () => {
    render(<ReviewCard review={mockReview} locale="en" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render comment in English', () => {
    render(<ReviewCard review={mockReview} locale="en" />);
    expect(screen.getByText('"Excellent service and professional approach."')).toBeInTheDocument();
  });

  it('should render comment in Hebrew', () => {
    render(<ReviewCard review={mockReview} locale="he" />);
    expect(screen.getByText('"שירות מעולה וגישה מקצועית."')).toBeInTheDocument();
  });

  it('should render 5 stars for 5-star rating', () => {
    const { container } = render(<ReviewCard review={mockReview} locale="en" />);
    const filledStars = container.querySelectorAll('.fill-yellow-400');
    expect(filledStars).toHaveLength(5);
  });

  it('should render 3 filled stars for 3-star rating', () => {
    const threeStarReview = { ...mockReview, rating: 3 };
    const { container } = render(<ReviewCard review={threeStarReview} locale="en" />);
    const filledStars = container.querySelectorAll('.fill-yellow-400');
    expect(filledStars).toHaveLength(3);
  });

  it('should render 1 filled star for 1-star rating', () => {
    const oneStarReview = { ...mockReview, rating: 1 };
    const { container } = render(<ReviewCard review={oneStarReview} locale="en" />);
    const filledStars = container.querySelectorAll('.fill-yellow-400');
    expect(filledStars).toHaveLength(1);
  });

  it('should render formatted date', () => {
    render(<ReviewCard review={mockReview} locale="en" />);
    // Date formatting will show as locale-specific format
    // We just verify the date element exists
    expect(screen.getByText(/2023|Jun|June/)).toBeInTheDocument();
  });

  it('should handle different reviewer names', () => {
    const customReview = { ...mockReview, reviewerName: 'Sarah Cohen' };
    render(<ReviewCard review={customReview} locale="en" />);
    expect(screen.getByText('Sarah Cohen')).toBeInTheDocument();
  });
});
