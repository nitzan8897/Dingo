'use client';

import { Lawyer } from '@dingo/types';
import LawyerCard from '@/components/lawyer/lawyer-card';
import { DataPagination } from '@/components/ui/data-pagination';

interface LawyersGridProps {
  lawyers: Lawyer[];
  onSpecialtyClick: (specialty: string) => void;
}

/**
 * Grid layout for displaying lawyer cards with pagination
 */
const LawyersGrid: React.FC<LawyersGridProps> = ({ lawyers, onSpecialtyClick }) => {
  return (
    <DataPagination
      data={lawyers}
      itemsPerPage={6}
      renderItems={(items) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((lawyer) => (
            <LawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              onSpecialtyClick={onSpecialtyClick}
            />
          ))}
        </div>
      )}
    />
  );
};

export default LawyersGrid;
