interface EmptyStateProps {
  message: string;
}

/**
 * Empty state component when no results are found
 */
const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-600 dark:text-gray-300 text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
