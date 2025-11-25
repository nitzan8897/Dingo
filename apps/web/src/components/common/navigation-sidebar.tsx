'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Home, Users, Briefcase } from 'lucide-react';
import { type Locale } from '@dingo/i18n';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface NavigationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

/**
 * NavigationSidebar component
 * Provides navigation links to main pages using Sheet component
 */
const NavigationSidebar = ({ open, onOpenChange, title }: NavigationSidebarProps): JSX.Element => {
  const t = useTranslations('navigation');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as Locale;

  const navItems = [
    { href: `/${locale}`, label: t('home'), icon: Home },
    { href: `/${locale}/lawyers`, label: t('lawyers'), icon: Users },
    { href: `/${locale}/cases`, label: t('cases'), icon: Briefcase },
  ];

  const isActive = (href: string): boolean => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}`;
    }
    return pathname.startsWith(href);
  };

  const handleLinkClick = (): void => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className={title ? '' : 'sr-only'}>
            {title || 'Navigation'}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu
          </SheetDescription>
        </SheetHeader>
        <nav className={`flex flex-col gap-4 ${title ? 'mt-8' : 'mt-4'}`} aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(href)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-lg font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationSidebar;
