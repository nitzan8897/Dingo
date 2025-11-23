'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type Locale } from '@dingo/i18n';

interface ProfileHeaderProps {
  locale: Locale;
}

/**
 * ProfileHeader component
 * Displays logo and slogan with navigation back to homepage
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ locale }) => {
  const t = useTranslations();

  return (
    <Link href={`/${locale}`} className="block mb-8 hover:opacity-80 transition-opacity">
      <header className="text-center">
        <div className="flex items-center justify-center gap-6 mb-2">
          <Image
            src="/images/dingo-logo.png"
            alt="Dingo Logo"
            width={80}
            height={80}
            className="object-contain"
          />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('common.appName')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('home.subtitle')}
        </p>
      </header>
    </Link>
  );
};

export default ProfileHeader;
