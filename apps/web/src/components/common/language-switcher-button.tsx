import React from 'react';

interface LanguageSwitcherButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel: string;
}

/**
 * Language switcher button with globe icon
 */
const LanguageSwitcherButton: React.FC<LanguageSwitcherButtonProps> = ({
  isOpen,
  onClick,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {/* Language/Globe icon */}
      <svg
        className="w-5 h-5 text-gray-700 dark:text-gray-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    </button>
  );
};

export default LanguageSwitcherButton;
