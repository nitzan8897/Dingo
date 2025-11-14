interface LoadingStateProps {
  message: string;
}

/**
 * Loading state component with spinner
 */
const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default LoadingState;
