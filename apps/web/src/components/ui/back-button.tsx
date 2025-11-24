'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  fallbackUrl?: string;
  label?: string;
}

export function BackButton({ fallbackUrl, label }: BackButtonProps) {
  const router = useRouter();
  const t = useTranslations('common');

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackUrl) {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="gap-2 mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      {label || t('back')}
    </Button>
  );
}
