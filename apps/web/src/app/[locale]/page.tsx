import { getLocale } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import LandingClient from '@/components/landing/landing-client';

/**
 * Server Component - Landing Page
 * Fetches 20 random lawyers and cases for marquee display
 * Each page fetches its own data - no global context needed
 */
const LandingPage = async () => {
  // Fetch locale and 20 random items for landing page marquee
  const [locale, randomLawyers, randomCases] = await Promise.all([
    getLocale(),
    lawyerService.fetchRandomLawyers(20),
    caseService.fetchRandomCases(20),
  ]);

  return <LandingClient lawyers={randomLawyers} cases={randomCases} locale={locale} />;
};

export default LandingPage;
