import { getTranslations } from 'next-intl/server';
import LawyersHeader from '@/components/lawyers/lawyers-header';
import LawyersClient from './lawyers-client';
import { lawyerService } from '@/services/lawyer-service';

/**
 * Server Component - Lawyers Search Page
 * Fetches initial lawyer data server-side for:
 * - SEO: Search engines see full content
 * - Performance: No loading spinner on initial load
 * - SSR/SSG: Pre-rendered HTML with data
 * Header with toggles is provided by parent layout
 */
const LawyersPage = async () => {
  const t = await getTranslations();
  const initialLawyers = await lawyerService.fetchLawyers();

  return (
    <>
      <LawyersHeader title={t('lawyers.title')} subtitle={t('lawyers.subtitle')} />
      <LawyersClient initialLawyers={initialLawyers} />
    </>
  );
};

export default LawyersPage;
