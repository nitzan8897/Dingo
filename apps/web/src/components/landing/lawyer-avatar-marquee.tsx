'use client';

import { Lawyer } from '@dingo/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LawyerAvatarMarqueeProps {
  lawyer: Lawyer;
  locale: string;
}

/**
 * Lawyer avatar component for marquee display
 * Shows lawyer icon above initials from first letter of first and last name
 */
const LawyerAvatarMarquee = ({ lawyer, locale }: LawyerAvatarMarqueeProps) => {
  const router = useRouter();
  const displayName = locale === 'en' ? lawyer.fullNameEn : lawyer.fullNameHe;

  // Get initials - first letter of first name and first letter of last name
  const nameParts = displayName.split(' ');
  const initials = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : displayName.slice(0, 2).toUpperCase();

  const handleClick = () => {
    router.push(`/lawyers/${lawyer.id}`);
  };

  return (
    <div
      className="relative group/item mx-2 cursor-pointer transition-transform hover:scale-110"
      onClick={handleClick}
    >
      <Avatar className="h-20 w-20">
        <AvatarImage src={undefined} alt={displayName} />
        <AvatarFallback className="text-xl font-semibold">
          <div className="flex flex-col items-center gap-1">
            <Scale className="h-6 w-6" />
            <span>{initials}</span>
          </div>
        </AvatarFallback>
      </Avatar>

      {/* Tooltip on hover */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-14 bg-black/90 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none z-[100]">
        LAWYER {displayName}
        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );
};

export default LawyerAvatarMarquee;
