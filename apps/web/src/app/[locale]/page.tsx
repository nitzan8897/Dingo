import { getLocale } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import LandingClient from '@/components/landing/landing-client';

/**
 * Server Component - Landing Page
 * Fetches random lawyers and cases for the landing page
 * Following SOLID principles - service layer handles data fetching logic
 */
const LandingPage = async () => {
  // Fetch locale and random data in parallel
  const [locale, randomLawyers, randomCases] = await Promise.all([
    getLocale(),
    lawyerService.fetchRandomLawyers(5),
    caseService.fetchRandomCases(5),
  ]);

  return <LandingClient lawyers={randomLawyers} cases={randomCases} locale={locale} />;
};

export default LandingPage;
