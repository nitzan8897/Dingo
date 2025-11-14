import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Not Found page (404)
 * Displayed when a page cannot be found
 */
export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <main className="min-h-screen flex items-center justify-center p-8 dark:bg-gray-900 transition-colors">
      <div className="max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/dingo-notfound.png"
            alt="Dingo Not Found"
            width={192}
            height={192}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('description')}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          {t('backHome')}
        </Link>
      </div>
    </main>
  );
}
