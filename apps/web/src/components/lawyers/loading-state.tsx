import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message: string;
}

/**
 * Loading state component with skeleton placeholders
 * Now using shadcn/ui Skeleton component for better UX
 */
const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
      <p className="text-center text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default LoadingState;
