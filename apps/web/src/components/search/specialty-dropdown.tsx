'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Specialty } from '@dingo/types';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface SpecialtyDropdownProps {
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
}

/**
 * SpecialtyDropdown component
 * A searchable dropdown with multi-select specialty filtering
 * Now using shadcn/ui Command + Popover for better UX and accessibility
 */
const SpecialtyDropdown: React.FC<SpecialtyDropdownProps> = ({
  selectedSpecialties,
  onSpecialtiesChange,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const allSpecialties = Object.values(Specialty);

  const handleSpecialtyToggle = (specialty: string): void => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];

    onSpecialtiesChange(newSpecialties);
  };

  const handleClearAll = (): void => {
    onSpecialtiesChange([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between px-4 h-10 text-base md:text-sm"
        >
          <span className="truncate">
            {selectedSpecialties.length > 0
              ? `${selectedSpecialties.length} ${t('search.specialties')}`
              : t('search.chooseSpecialties')}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t('search.searchSpecialties')} />
          <CommandList>
            <CommandEmpty>{t('common.noResults')}</CommandEmpty>
            <CommandGroup>
              {allSpecialties.map((specialty) => (
                <CommandItem
                  key={specialty}
                  value={specialty}
                  onSelect={() => handleSpecialtyToggle(specialty)}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      'mr-3 rtl:mr-0 rtl:ml-3',
                      selectedSpecialties.includes(specialty)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <Check className={cn('h-4 w-4')} />
                  </div>
                  <span>{t(`specialties.${specialty}`)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedSpecialties.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearAll}
                    className="justify-center text-center cursor-pointer"
                  >
                    {t('search.clearAll')}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SpecialtyDropdown;
