interface SpecialtyDropdownButtonProps {
  isOpen: boolean;
  selectedCount: number;
  onClick: () => void;
  chooseText: string;
  specialtiesText: string;
}

/**
 * Trigger button for the specialty dropdown
 */
const SpecialtyDropdownButton: React.FC<SpecialtyDropdownButtonProps> = ({
  isOpen,
  selectedCount,
  onClick,
  chooseText,
  specialtiesText,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-left flex items-center justify-between transition-colors"
    >
      <span className="text-gray-700 dark:text-gray-200">
        {selectedCount > 0
          ? `${selectedCount} ${specialtiesText}`
          : chooseText}
      </span>
      <svg
        className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export default SpecialtyDropdownButton;
