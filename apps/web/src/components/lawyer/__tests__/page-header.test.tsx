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
    render(<PageHeader locale="en" />);
    const logo = screen.getByAltText('Dingo Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/dingo-logo.png');
  });

  it('should render app name from translations', () => {
    render(<PageHeader locale="en" />);
    expect(screen.getByText('common.appName')).toBeInTheDocument();
  });

  it('should render subtitle from translations', () => {
    render(<PageHeader locale="en" />);
    expect(screen.getByText('landing.subtitle')).toBeInTheDocument();
  });

  it('should create link with correct locale', () => {
    render(<PageHeader locale="he" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/he');
  });
});
