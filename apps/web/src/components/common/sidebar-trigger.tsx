'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarTriggerProps {
  onClick: () => void;
  'aria-label': string;
}

/**
 * SidebarTrigger component
 * Floating hamburger button that opens the navigation sidebar
 */
const SidebarTrigger = ({ onClick, 'aria-label': ariaLabel }: SidebarTriggerProps): JSX.Element => {
  return (
    <Button
      onClick={onClick}
      variant="default"
      size="icon"
      aria-label={ariaLabel}
      className="fixed top-4 right-4 z-40 shadow-lg hover:shadow-xl transition-shadow"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export default SidebarTrigger;
