import { getTranslations } from 'next-intl/server';
import HomeHeader from '@/components/home/home-header';
import HomeClient from './home-client';
import { lawyerService } from '@/services/lawyer-service';

/**
 * Server Component - Home Page
 * Fetches initial lawyer data server-side for:
 * - SEO: Search engines see full content
 * - Performance: No loading spinner on initial load
 * - SSR/SSG: Pre-rendered HTML with data
 * Header with toggles is provided by parent layout
 */
const HomePage = async () => {
  const t = await getTranslations();
  const initialLawyers = await lawyerService.fetchLawyers();

  return (
    <>
      <HomeHeader title={t('home.title')} subtitle={t('home.subtitle')} />
      <HomeClient initialLawyers={initialLawyers} />
    </>
  );
};

export default HomePage;
