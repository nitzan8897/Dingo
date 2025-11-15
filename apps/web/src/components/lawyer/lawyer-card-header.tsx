import React from 'react';

interface LawyerCardHeaderProps {
  fullName: string;
  city: string;
}

/**
 * Lawyer card header with name and city
 */
const LawyerCardHeader: React.FC<LawyerCardHeaderProps> = ({ fullName, city }) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{city}</p>
      </div>
    </div>
  );
};

export default LawyerCardHeader;
