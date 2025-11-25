import { getLocale } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import LandingClient from '@/components/landing/landing-client';

/**
 * Server Component - Landing Page
 * Fetches random lawyers and cases for the landing page
 */
const LandingPage = async () => {
  // Fetch locale and data in parallel
  const [locale, allLawyers, allCases] = await Promise.all([
    getLocale(),
    lawyerService.fetchLawyers(),
    caseService.fetchCases(),
  ]);

  // Select 5 random lawyers
  const randomLawyers = allLawyers
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  // Select 5 random cases
  const randomCases = allCases
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return <LandingClient lawyers={randomLawyers} cases={randomCases} locale={locale} />;
};

export default LandingPage;
