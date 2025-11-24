import { render, screen } from '@testing-library/react';
import PageHeader from '../page-header';

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => {
    return <img src={src} alt={alt} width={width} height={height} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('PageHeader', () => {
  it('should render logo image', () => {
    render(<PageHeader title="Dingo" subtitle="Smart Lawyer Ratings Platform" />);
    const logo = screen.getByAltText('Dingo Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/dingo-logo.png');
  });

  it('should render title', () => {
    render(<PageHeader title="Dingo" subtitle="Smart Lawyer Ratings Platform" />);
    expect(screen.getByText('Dingo')).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    render(<PageHeader title="Dingo" subtitle="Smart Lawyer Ratings Platform" />);
    expect(screen.getByText('Smart Lawyer Ratings Platform')).toBeInTheDocument();
  });

  it('should render custom title and subtitle', () => {
    render(<PageHeader title="Custom Title" subtitle="Custom Subtitle" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });
});
