'use client';

import { Case } from '@dingo/types';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

interface FloatingCaseIconsProps {
  cases: Case[];
}

/**
 * FloatingCaseIcons component
 * Displays floating case icons with hover tooltips
 */
const FloatingCaseIcons = ({ cases }: FloatingCaseIconsProps): JSX.Element => {
  const router = useRouter();

  const handleCaseClick = (caseExternalId: string): void => {
    router.push(`/cases/${caseExternalId}`);
  };

  return (
    <div className="relative w-full h-96 overflow-visible">
      {cases.map((caseItem, index) => (
        <div
          key={caseItem.id}
          className="floating-icon absolute cursor-pointer group"
          style={{
            left: `${(index * 20) % 90}%`,
            top: `${30 + (index * 20) % 70}px`,
            animationDelay: `${index * 0.8}s`,
            animationDuration: `${5 + index * 0.7}s`,
          }}
          onClick={() => handleCaseClick(caseItem.externalId)}
        >
          <div className="p-6 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-125">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 px-4 py-2 bg-black text-white text-sm font-semibold rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-[999] max-w-xs truncate">
            {caseItem.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingCaseIcons;
