import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/common/language-switcher';
import ThemeToggle from '@/components/common/theme-toggle';
import HomeHeader from '@/components/home/home-header';
import HomeClient from './home-client';
import { lawyerService } from '@/services/lawyer-service';

/**
 * Server Component - Home Page
 * Fetches initial lawyer data server-side for:
 * - SEO: Search engines see full content
 * - Performance: No loading spinner on initial load
 * - SSR/SSG: Pre-rendered HTML with data
 */
const Page = async () => {
  const t = await getTranslations();
  const initialLawyers = await lawyerService.fetchLawyers();

  return (
    <main className="min-h-screen p-8 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end gap-3 mb-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <HomeHeader title={t('home.title')} subtitle={t('home.subtitle')} />

        <HomeClient initialLawyers={initialLawyers} />
      </div>
    </main>
  );
}

export default Page;
