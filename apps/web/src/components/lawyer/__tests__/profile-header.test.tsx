import { render, screen } from '@testing-library/react';
import ProfileHeader from '../profile-header';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'common.appName': 'Dingo',
      'home.subtitle': 'Smart Lawyer Ratings Platform',
    };
    return translations[key] || key;
  },
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => {
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

describe('ProfileHeader', () => {
  it('should render logo image', () => {
    render(<ProfileHeader locale="en" />);
    const logo = screen.getByAltText('Dingo Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/dingo-logo.png');
  });

  it('should render app name', () => {
    render(<ProfileHeader locale="en" />);
    expect(screen.getByText('Dingo')).toBeInTheDocument();
  });

  it('should render slogan', () => {
    render(<ProfileHeader locale="en" />);
    expect(screen.getByText('Smart Lawyer Ratings Platform')).toBeInTheDocument();
  });

  it('should wrap content in Link to homepage', () => {
    const { container } = render(<ProfileHeader locale="en" />);
    const link = container.querySelector('a[href="/en"]');
    expect(link).toBeInTheDocument();
  });

  it('should use correct locale in homepage link', () => {
    const { container } = render(<ProfileHeader locale="he" />);
    const link = container.querySelector('a[href="/he"]');
    expect(link).toBeInTheDocument();
  });
});
