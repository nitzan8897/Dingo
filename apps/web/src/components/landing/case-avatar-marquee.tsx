'use client';

import { Case } from '@dingo/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Scale } from 'lucide-react';

interface CaseAvatarMarqueeProps {
  case_: Case;
}

/**
 * Case avatar component for marquee display
 * Shows first letter of case title
 */
const CaseAvatarMarquee = ({ case_ }: CaseAvatarMarqueeProps) => {
  // Get first letter of case title
  const initial = case_.title.charAt(0).toUpperCase();

  return (
    <Card className="w-24 h-24 flex items-center justify-center hover:shadow-lg transition-shadow">
      <CardContent className="p-2 flex items-center justify-center">
        <Avatar className="h-20 w-20 bg-primary/10">
          <AvatarFallback className="text-2xl font-bold text-primary bg-transparent">
            <div className="flex flex-col items-center gap-1">
              <Scale className="h-6 w-6" />
              <span>{initial}</span>
            </div>
          </AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
};

export default CaseAvatarMarquee;
