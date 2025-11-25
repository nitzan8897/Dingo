'use client';

import { Lawyer } from '@dingo/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface LawyerAvatarMarqueeProps {
  lawyer: Lawyer;
  locale: string;
}

/**
 * Lawyer avatar component for marquee display
 * Shows lawyer image or initials from first two letters of name
 */
const LawyerAvatarMarquee = ({ lawyer, locale }: LawyerAvatarMarqueeProps) => {
  const displayName = locale === 'en' ? lawyer.fullNameEn : lawyer.fullNameHe;

  // Get initials - first two letters of first name
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="w-24 h-24 flex items-center justify-center hover:shadow-lg transition-shadow">
      <CardContent className="p-2 flex items-center justify-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={undefined} alt={displayName} />
          <AvatarFallback className="text-xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
};

export default LawyerAvatarMarquee;
