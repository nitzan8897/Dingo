import { getLocale } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { caseService } from '@/services/case-service';
import LandingClient from '@/components/landing/landing-client';

/**
 * Server Component - Landing Page
 * Fetches ALL lawyers and cases once, stores in context for app-wide use
 */
const LandingPage = async () => {
  // Fetch locale and ALL data in parallel (fetch once, use everywhere)
  const [locale, allLawyers, allCases] = await Promise.all([
    getLocale(),
    lawyerService.fetchLawyers(),
    caseService.fetchCases(),
  ]);

  return <LandingClient lawyers={allLawyers} cases={allCases} locale={locale} />;
};

export default LandingPage;
