import { getTranslations } from 'next-intl/server';
import { lawyerService } from '@/services/lawyer-service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

/**
 * Lawyer Profile Page - Server Component
 * Fetches lawyer data server-side for SEO and performance
 */
const LawyerProfilePage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const t = await getTranslations();

  try {
    const lawyer = await lawyerService.fetchLawyerById(id);

    return (
      <main className="min-h-screen p-8 dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {lawyer.fullNameEn}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {lawyer.city} • {lawyer.yearsOfExperience} {t('lawyer.yearsOfExperience')}
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Specialties
            </h2>
            <div className="flex flex-wrap gap-2">
              {lawyer.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    // If lawyer not found, show 404
    notFound();
  }
};

export default LawyerProfilePage;
