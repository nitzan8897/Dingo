'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Button } from './button';

interface DataPaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  renderItems: (items: T[]) => React.ReactNode;
  className?: string;
}

/**
 * Reusable pagination component for data arrays
 * Displays pagination controls and renders a subset of items with animations
 * Supports RTL for Hebrew locale
 */
export function DataPagination<T>({
  data,
  itemsPerPage,
  renderItems,
  className,
}: DataPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const locale = useLocale();
  const isRTL = locale === 'he';

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setTimeout(() => setIsAnimating(false), 50);
    }, 150);
  };

  const handlePrevious = () => {
    const newPage = Math.max(0, currentPage - 1);
    handlePageChange(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(totalPages - 1, currentPage + 1);
    handlePageChange(newPage);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className={className} dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        className={`transition-all duration-200 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {renderItems(currentItems)}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            {isRTL ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {currentPage + 1}/{totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
          >
            {isRTL ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
