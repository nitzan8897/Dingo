import ProfileHeader from '@/components/lawyer/profile-header';
import LawyersClient from './lawyers-client';
import { lawyerService } from '@/services/lawyer-service';
import { type Locale } from '@dingo/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Server Component - Lawyers Search Page
 * Fetches initial lawyer data server-side for:
 * - SEO: Search engines see full content
 * - Performance: No loading spinner on initial load
 * - SSR/SSG: Pre-rendered HTML with data
 * Header with toggles is provided by parent layout
 */
const LawyersPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const initialLawyers = await lawyerService.fetchLawyers();

  return (
    <>
      <ProfileHeader locale={locale as Locale} />
      <LawyersClient initialLawyers={initialLawyers} />
    </>
  );
};

export default LawyersPage;
