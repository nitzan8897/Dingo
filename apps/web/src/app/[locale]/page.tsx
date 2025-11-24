import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Server Component - Landing Page
 * Minimal landing page with CTA to lawyers search
 */
const LandingPage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {t('landing.title')}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        {t('landing.subtitle')}
      </p>
      <Link href="lawyers">
        <Button size="lg" className="text-lg px-8 py-6">
          {t('landing.findLawyers')}
        </Button>
      </Link>
    </div>
  );
};

export default LandingPage;
