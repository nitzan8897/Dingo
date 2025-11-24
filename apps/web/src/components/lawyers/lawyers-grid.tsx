import { Lawyer } from '@dingo/types';
import LawyerCard from '@/components/lawyer/lawyer-card';

interface LawyersGridProps {
  lawyers: Lawyer[];
  onSpecialtyClick: (specialty: string) => void;
}

/**
 * Grid layout for displaying lawyer cards
 */
const LawyersGrid: React.FC<LawyersGridProps> = ({ lawyers, onSpecialtyClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lawyers.map((lawyer) => (
        <LawyerCard
          key={lawyer.id}
          lawyer={lawyer}
          onSpecialtyClick={onSpecialtyClick}
        />
      ))}
    </div>
  );
};

export default LawyersGrid;
