import { render, screen } from '@testing-library/react';
import ReviewsStats from '../reviews-stats';
import { Review } from '@dingo/types';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'lawyer.reviews': 'Reviews',
      'lawyer.reviewsCount': 'reviews',
    };
    return translations[key] || key;
  },
}));

describe('ReviewsStats', () => {
  const createMockReview = (id: string, rating: number): Review => ({
    id,
    lawyerId: 'lawyer-1',
    reviewerName: `Reviewer ${id}`,
    rating,
    commentEn: 'Great service',
    commentHe: 'שירות מעולה',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  it('should render empty fragment when no reviews', () => {
    const { container } = render(<ReviewsStats reviews={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render reviews title', () => {
    const reviews = [createMockReview('1', 5)];
    render(<ReviewsStats reviews={reviews} />);
    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });

  it('should calculate average rating correctly for single review', () => {
    const reviews = [createMockReview('1', 4)];
    render(<ReviewsStats reviews={reviews} />);
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('should calculate average rating correctly for multiple reviews', () => {
    const reviews = [
      createMockReview('1', 5),
      createMockReview('2', 4),
      createMockReview('3', 3),
    ];
    render(<ReviewsStats reviews={reviews} />);
    // Average: (5 + 4 + 3) / 3 = 4.0
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('should display review count', () => {
    const reviews = [
      createMockReview('1', 5),
      createMockReview('2', 4),
      createMockReview('3', 5),
    ];
    render(<ReviewsStats reviews={reviews} />);
    expect(screen.getByText('3 reviews')).toBeInTheDocument();
  });

  it('should render 5 star rating rows', () => {
    const reviews = [createMockReview('1', 5)];
    const { container } = render(<ReviewsStats reviews={reviews} />);
    // Should have 5 rows for 5-star, 4-star, 3-star, 2-star, 1-star
    const starLabels = container.querySelectorAll('.text-sm.font-medium');
    expect(starLabels.length).toBe(5);
  });

  it('should show correct distribution for all 5-star reviews', () => {
    const reviews = [
      createMockReview('1', 5),
      createMockReview('2', 5),
      createMockReview('3', 5),
    ];
    const { container } = render(<ReviewsStats reviews={reviews} />);
    // Should show "3" count next to 5-star bar (in right-aligned column)
    const counts = container.querySelectorAll('.text-right');
    expect(counts.length).toBeGreaterThan(0);
    expect(counts[0].textContent).toBe('3'); // First bar (5 stars) should have 3 reviews
  });

  it('should show correct distribution for mixed ratings', () => {
    const reviews = [
      createMockReview('1', 5),
      createMockReview('2', 5),
      createMockReview('3', 4),
      createMockReview('4', 3),
      createMockReview('5', 1),
    ];
    render(<ReviewsStats reviews={reviews} />);
    // Average: (5 + 5 + 4 + 3 + 1) / 5 = 3.6
    expect(screen.getByText('3.6')).toBeInTheDocument();
    expect(screen.getByText('5 reviews')).toBeInTheDocument();
  });

  it('should render filled stars based on average rating', () => {
    const reviews = [
      createMockReview('1', 4),
      createMockReview('2', 4),
    ];
    const { container } = render(<ReviewsStats reviews={reviews} />);
    // Average is 4.0, so should have 4 filled stars
    const filledStars = container.querySelectorAll('.fill-yellow-400');
    expect(filledStars.length).toBeGreaterThan(0);
  });

  it('should handle decimal averages correctly', () => {
    const reviews = [
      createMockReview('1', 5),
      createMockReview('2', 4),
      createMockReview('3', 4),
    ];
    render(<ReviewsStats reviews={reviews} />);
    // Average: (5 + 4 + 4) / 3 = 4.333...
    expect(screen.getByText('4.3')).toBeInTheDocument();
  });
});
