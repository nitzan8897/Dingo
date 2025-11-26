'use client';

import { Lawyer } from '@dingo/types';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Scale } from 'lucide-react';

interface FloatingLawyerIconsProps {
  lawyers: Lawyer[];
}

/**
 * FloatingLawyerIcons component
 * Displays floating lawyer icons with hover tooltips
 */
const FloatingLawyerIcons = ({ lawyers }: FloatingLawyerIconsProps): JSX.Element => {
  const router = useRouter();
  const locale = useLocale();

  const handleLawyerClick = (lawyerId: string): void => {
    router.push(`/lawyers/${lawyerId}`);
  };

  return (
    <div className="relative w-full h-96 overflow-visible">
      {lawyers.map((lawyer, index) => {
        const lawyerName = locale === 'he' ? lawyer.fullNameHe : lawyer.fullNameEn;

        return (
          <div
            key={lawyer.id}
            className="floating-icon absolute cursor-pointer group"
            style={{
              left: `${(index * 20) % 90}%`,
              top: `${30 + (index * 20) % 70}px`,
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${5 + index * 0.7}s`,
            }}
            onClick={() => handleLawyerClick(lawyer.id)}
          >
            <div className="p-6 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-125">
              <Scale className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 px-4 py-2 bg-black text-white text-sm font-semibold rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-[999]">
              {lawyerName}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FloatingLawyerIcons;
