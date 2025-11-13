import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { getDirection, type Locale, locales } from '@dingo/i18n';
import { notFound } from 'next/navigation';
import { Heebo } from 'next/font/google';
import '../globals.css';

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  display: 'swap',
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const t = await getTranslations({ locale: locale as Locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

/**
 * Locale layout - provides locale-specific configuration and i18n context
 * Uses suppressHydrationWarning to prevent errors from browser extensions
 * that inject attributes into the body tag (e.g., password managers)
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const direction = getDirection(typedLocale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={direction}>
      <body className={`${heebo.className} bg-gray-50`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}