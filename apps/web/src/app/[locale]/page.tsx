import { getLocale } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import LandingClient from '@/components/landing/landing-client';

/**
 * Server Component - Landing Page
 * Fetches only 5 random lawyers and cases for display
 * Each page fetches its own data - no global context needed
 */
const LandingPage = async () => {
  // Fetch locale and only 5 random items for landing page display
  const [locale, randomLawyers, randomCases] = await Promise.all([
    getLocale(),
    lawyerService.fetchRandomLawyers(5),
    caseService.fetchRandomCases(5),
  ]);

  return <LandingClient lawyers={randomLawyers} cases={randomCases} locale={locale} />;
};

export default LandingPage;
