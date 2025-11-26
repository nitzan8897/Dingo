'use client';

import { Case } from '@dingo/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CaseAvatarMarqueeProps {
  case_: Case;
}

/**
 * Case avatar component for marquee display
 * Shows case icon above first letter of case title
 */
const CaseAvatarMarquee = ({ case_ }: CaseAvatarMarqueeProps) => {
  const router = useRouter();
  // Get first letter of case title
  const initial = case_.title.charAt(0).toUpperCase();

  const handleClick = () => {
    router.push(`/cases/${case_.id}`);
  };

  return (
    <div
      className="relative group/item mx-2 cursor-pointer transition-transform hover:scale-110"
      onClick={handleClick}
    >
      <Avatar className="h-20 w-20">
        <AvatarFallback className="text-xl font-semibold">
          <div className="flex flex-col items-center gap-1">
            <FileText className="h-6 w-6" />
            <span>{initial}</span>
          </div>
        </AvatarFallback>
      </Avatar>

      {/* Tooltip on hover */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-14 bg-black/90 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none z-[100]">
        CASE {case_.title}
        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );
};

export default CaseAvatarMarquee;
