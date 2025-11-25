'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import NavigationSidebar from './navigation-sidebar';
import SidebarTrigger from './sidebar-trigger';

/**
 * NavigationWrapper component
 * Manages the navigation sidebar state and trigger button
 */
const NavigationWrapper = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('common');

  const handleToggle = (): void => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <SidebarTrigger onClick={handleToggle} aria-label={t('appName')} />
      <NavigationSidebar open={open} onOpenChange={setOpen} />
    </>
  );
};

export default NavigationWrapper;
